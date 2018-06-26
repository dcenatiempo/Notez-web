const {getSalt, getHash} = require('./util');

var options = {
  // Initialization Options
};

var pgp = require('pg-promise')(options);
// var connectionString = 'postgres://localhost:5432/notez';
const config = {
  host: 'localhost',
  port: 5432,
  database: 'notez'
};
var db = pgp(config);

/*******************************************************************************
 * Check Login
 * -----------------------------------------------------------------------------
 * Params: None (cookie)
 * Body: None
 * Success: 200 {email, id}
 * Failure: 401 {loggedId: false}
 ******************************************************************************/
function checkLogin(req, res, next) {
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
 * Body: {email, password}
 * Success: 201 {email, id}
 * Failure: 401
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
    "hash": hash,
    "dateCreated": Date.now(),
    "lastUpdated": Date.now()
  };

  db.one('insert into public."user" (email, data) values($1, $2) RETURNING id;', [email, data])
    .then( (id) => {
      // set session/cookie info
      req.session.userId = id;
      req.session.email = email;
      res.status(201)
         .json({
           email: email,
           id: req.session.userId
      });
    })
    .catch( (err) => {
      res.status(401)
        .json({
          'error': `User with email: ${email} already registered`
        });
    });
}

/*******************************************************************************
 * Login User
 * -----------------------------------------------------------------------------
 * Params: None
 * Body: {email, password}
 * Success: 200 {email, id}
 * Failure: 401, 404
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
      res.status(404)
         .json({'error': 'User Does Not Exist'})
    });

}

/*******************************************************************************
 * Logout User
 * -----------------------------------------------------------------------------
 * Params: None (cookie)
 * Body: None
 * Success: 200
 * Failure: 404
 ******************************************************************************/
function logoutUser(req, res, next) {
  if (req.sessionID) {
    req.session.destroy( () => {
      res.status(200)
         .json({'session': 'logged out'});
    });
  }
  else {
    res.status(404).send("already logged out!");
  }

}

/*******************************************************************************
 * Update User
 * -----------------------------------------------------------------------------
 * Params: None (cookie)
 * Body: {password, ?newPassword, ?email}
 * Success: 200 {email}
 * Failure: 400, 401
 ******************************************************************************/
function updateUser(req, res, next) {
  let body = req.body;
  let userId = req.session.userId;

  let password
    = body.password && body.password.length > 0
    ? body.password
    : null;
  let newPassword
    = body.newPassword && body.newPassword.length > 0
    ? body.newPassword
    : null;
  let email
    = body.email && body.email.length > 0
    ? body.email
    : null;

  if (password === null || (newPassword === null && email === null)) {
    res.status(400)
       .json({'error': 'No data to update'});
    return;
  }

  let salt, hash;

  // get current user data
  db.one('SELECT email, data FROM public."user" WHERE id = $1;', [userId])
    .then( (result) => {
      // check password
      salt = result.data.salt;
      hash = result.data.hash;

      if (hash !== getHash(salt, password)) {
        res.status(401)
           .json({'error': 'Incorrect password'});
        return;
      }

      let data = {};
      data.dateCreated = result.data.dateCreated;
      data.lastUpdated = Date.now();
      data.salt = result.data.salt;
      data.hash = newPassword ? getHash(salt, newPassword) : result.data.hash;
      email = email ? email : req.session.email;

      if (data.hash === result.data.hash && email === result.email) {
        res.status(400)
           .json({'error': 'No data to update'});
        return;
      }

      return db.one('UPDATE public."user" SET email = $1, data = $2 WHERE id = $3 RETURNING email;', [email, data, userId])
    })
    .then ( result => {
      req.session.email = result.email;
      res.status(200)
         .json(result);
    })
    .catch( (err) => {
      res.status(400)
        .json({'error': `could not update user`});
    });
}

/*******************************************************************************
 * Delete User
 * -----------------------------------------------------------------------------
 * Params: None (cookie)
 * Body: None
 * Success: 200
 * Failure: 400?
 ******************************************************************************/
function deleteUser(req, res, next) {
  let userId = req.session.userId;

  db.none('DELETE FROM public."user" WHERE id=$1', [userId])
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Deleted user'
        });
    })
    .catch(function (err) {
      res.status(400)
      .json({'error': `Could not delete user`});
    });
}

/*******************************************************************************
 * Create Notebook
 * -----------------------------------------------------------------------------
 * Params: none (cookie)
 * Body: {title}
 * Success: 201 {id, data}
 * Failure: 400?
 ******************************************************************************/
function createNotebook(req, res, next) {
  let userId = req.session.userId;
  let body = req.body;

  // Create data object to be inserted into new notebook
  let data = {};
  data.title = !body.title || body.title.length == 0 ? 'New Notebook' : body.title;
  data.dateCreated = Date.now();
  data.lastUpdated = data.dateCreated;

  db.one('insert into public.notebook (userid, data) values($1, $2) RETURNING id, data;', [userId, data])
  .then( (result) => {
    res.status(201)
        .json({
          result
    });
  })
  .catch( (err) => {
    res.status(400)
      .json({
        'error': `could not create notebook`
      });
  });
}

/*******************************************************************************
 * Get All User Notebooks
 * -----------------------------------------------------------------------------
 * Params: none (cookie)
 * Body: none
 * Success: 200 [{notebook}...]
 * Failure: 400
 ******************************************************************************/
function getAllUserNotebooks(req, res, next) {
  let userId = req.session.userId;

  db.any('SELECT id, data FROM public.notebook WHERE userId=$1', [userId])
    .then(function (response) {
      res.status(200)
          .json(response);
    })
    .catch(function (err) {
      res.status(400)
         .json({'error': `could not get notebooks`});
     });
}

/*******************************************************************************
 * Update Notebook
 * -----------------------------------------------------------------------------
 * Params: notebookId
 * Body: {title}
 * Success: 200 {id, data}
 * Failure: 400
 ******************************************************************************/
function updateNotebook(req, res, next) {
  let userId = req.session.userId;
  let params = req.params;
  let notebookId = parseInt(params.notebookId);
  let body = req.body;
  
  // check to see if there is any data to edit
  if (!body.title || body.title.length == 0) {
    res.status(400)
        .json({"error":"missing new title to isert"});
    return;
  }
  
  // check to see if authorized to edit user data
  db.one('SELECT EXISTS(SELECT 1 FROM public.notebook WHERE id=$1 AND userid=$2);', [notebookId, userId])
    .then (result => {
      if (!result.exists) {
        // not authorized
        throw new Error();
      }
      else {
        // get current notebook data
        return db.one('SELECT data FROM public.notebook WHERE id = $1;', [notebookId]);
      }
    }).then(result => {
      if (result.data.title == body.title) {
        // title is the same, dont update
        throw new Error();
      }

      let data = {};
      data.title = body.title;
      data.dateCreated = result.data.dateCreated;
      data.lastUpdated = Date.now();

      return db.one('UPDATE public.notebook SET data = $1 WHERE id = $2 RETURNING id, data;', [data, notebookId])
    })
    .then ( result => {
      res.status(200)
         .json(result);
    })
    .catch( (err) => {
      res.status(400)
        .json({'error': `could not update notebook`});
    });
}

/*******************************************************************************
 * Delete Notebook
 * -----------------------------------------------------------------------------
 * Params: notebookId
 * Body: none
 * Success: 200
 * Failure: 400
 ******************************************************************************/
function deleteNotebook(req, res, next) {
  let userId = req.session.userId;
  let params = req.params;
  let notebookId = parseInt(params.notebookId);

  db.one('SELECT EXISTS(SELECT 1 FROM public.notebook WHERE id=$1 AND userid=$2);', [notebookId, userId])
    .then ((result) => {
      if (!result.exists) {
        throw new Error();
      }
      else {
        return db.none('DELETE FROM public.notebook WHERE id=$1', [notebookId]);
      }
    })
    .then( () => {
      res.status(200)
        .json({
          status: 'success',
          message: 'Deleted notebook'
        });
    })
    .catch( (err) => {
      res.status(400)
        .json({'error': `Could not delete notebook`});
    });
}

module.exports = {
  checkLogin: checkLogin,
  registerUser: registerUser,
  loginUser: loginUser,
  logoutUser: logoutUser,
  updateUser: updateUser,
  deleteUser: deleteUser,
  createNotebook: createNotebook,
  getAllUserNotebooks: getAllUserNotebooks,
  updateNotebook: updateNotebook,
  deleteNotebook: deleteNotebook,
  // createNote: createNote,
  // getAllUserNotes: getAllUserNotes,
  // getAllNotebookNotes: getAllNotebookNotes,
  // getsingelNote: getsingleNote,
  // updateNote: updateNote,
  // deleteNote: deleteNote,
};