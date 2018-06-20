const {getSalt, getHash} = require('./util');

var options = {
  // Initialization Options
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://localhost:5432/notez';
var db = pgp(connectionString);

/*******************************************************************************
 * Check Login
 * -----------------------------------------------------------------------------
 * Params: None (cookie)
 * Body: None
 * Success: 
 * Failure: 
 ******************************************************************************/
function checkLogin(req, res, next) {
  console.log(req.session)
  if (req.session.userId) {
    res.status(200)
       .json({
         email: req.session.email,
         id: req.session.userId
    });
  }
  else {
    res.status(401)
    .json({"loggedId": 'false'})
  }
}
/*******************************************************************************
 * Register User
 * -----------------------------------------------------------------------------
 * Params: None
 * Body: email, password
 * Success: email, id
 * Failure: 
 ******************************************************************************/
function registerUser(req, res, next) {
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
      // set session/cookie info
      req.session.userId = id;
      req.session.email = email;
      res.status(200)
         .json({
           email: email,
           id: req.session.userId
      });
    })
    .catch( (err) => {
      res.status(401)
        .json({
          error: `User with email: ${email} already registered`
        });
    });
}

/*******************************************************************************
 * Login User
 * -----------------------------------------------------------------------------
 * Params: None
 * Body: email, password
 * Success: ?
 * Failure: ?
 ******************************************************************************/
function loginUser(req, res, next) {
  let email = req.body.email;
  let password = req.body.password;

  // TODO: validate email & password
  // if not valid, redirect to register page with warning

  let salt;
  let id;
  let hash;
  db.one('SELECT id, data FROM public."user" WHERE email=$1', [email])
    .then( (result) => {
      console.log(result)
      id = parseInt(result.id);
      salt = result.data.salt;
      hash = result.data.hash;

      let authenticated = hash === getHash(salt, password);
      if (authenticated) {
        // set session/cookie info
        req.session.userId = id;
        req.session.email = email;
        res.status(200)
           .json({
             email: email,
             id: req.session.userId
        });
      }
      else {
        res.status(401)
           .json({'error': 'Incorrect Password'})
      }
    })
    .catch(function (err) {
      res.status(401)
         .json({'error': 'User Does Not Exist'})
    });

}

/*******************************************************************************
 * Logout User
 * -----------------------------------------------------------------------------
 * Params: None
 * Body: None
 * Success: ?
 * Failure: ?
 ******************************************************************************/
function logoutUser(req, res, next) {
  console.log(req.cookie)
  if (req.sessionID) {
    req.session.destroy( () => {
      res.status(200)
         .json({'session': 'logged out'});
    });
  }
  else {
    res.send("already logged out!");
  }

}

/*******************************************************************************
 * Delete User
 * -----------------------------------------------------------------------------
 * Params: userId
 * Body: None
 * Success: ?
 * Failure: ?
 ******************************************************************************/
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
  checkLogin: checkLogin,
  registerUser: registerUser,
  loginUser: loginUser,
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