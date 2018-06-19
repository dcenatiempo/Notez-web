const {getSalt, getHash} = require('./util');

var options = {
  // Initialization Options
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://localhost:5432/notez';
var db = pgp(connectionString);

// add query functions
function createUser(req, res, next) {
  // gather request data
  let email = req.body.email;
  let password = req.body.password;

  // TODO: validate email & password
  // if not valid, redirect to register page with warning

  let salt = getSalt();
  let hash = getHash(salt, password);
  let data = {
    "salt": salt,
    "hash": hash
  };

  db.one('insert into public."user" (email, data) values($1, $2) RETURNING id;', [email, data])
    .then( (id) => {
      // session/cookie stuff
      req.session.userId = id;
    })
    .then( () => {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted new user'
        });
    })
    .catch( (err) => {
      return next(err);
    });
}

function getUser(req, res, next) {
  // gather request data
  let email = req.body.email;
  let password = req.body.password;

  // TODO: validate email & password
  // if not valid, redirect to register page with warning

  let salt;
  let id;
  let hash;
  db.one('SELECT id, data FROM public."user" WHERE email=$1', [email])
    .then( (result) => {
      id = parseInt(result.id);
      salt = result.data.salt;
      hash = result.data.hash;

      console.log(salt)
      let authenticated = hash === getHash(salt, password);
      if (authenticated) {
        // req.session.id = id;
        res.send("Logged In!")
      }
      else {
        res.send("bad password")
      }
    })
    .catch(function (err) {
      // TODO: if no results I need to give warning & redirect or something
      return next(err);
    });

}

function logoutUser(req, res, next) {
  console.log(req.cookie)
  if (req.sessionID) {
    // req.session.destroy(req.sessionID);
    // res.clearCookie("key");
    res.send("session deleted");
  }
  else {
    res.send("already logged out!");
  }

}

function deleteUser(req, res, next) {
  // gather request data
  let userId = parseInt(req.params.userId);

  db.none('DELETE FROM public."user" WHERE id=$1', [userId])
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Delete user'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

module.exports = {
  createUser: createUser,
  getUser: getUser,
  logoutUser: logoutUser,
  // updateUser: updateUser,
  deleteUser: deleteUser,
  // createNotebook: createNotebook,
  // getAllUserNotebooks: getAllUserNotebooks,
  // updateNotebook: updateNotebook,
  // deleteNotebook: deleteNotebook,
  // createNote: createNote,
  // getAllUserNotes: getAllUserNotes,
  // getAllNotebookNotes: getAllNotebookNotes,
  // getsingelNote: getsingleNote,
  // updateNote: updateNote,
  // deleteNote: deleteNote,
};