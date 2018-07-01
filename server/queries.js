require('dotenv').config();
const {isEmailValid, getSalt, getHash} = require('./util');

var options = {/* Initialization Options*/};

var pgp = require('pg-promise')(options);
var db = pgp(process.env.DATABASE_URL);

/*******************************************************************************
 * Check Login
 * -----------------------------------------------------------------------------
 * Params: None (cookie)
 * Body: None
 * Success: 200 { loggedIn: true, email, id }
 * Failure: 401 { loggedIn: false }
 ******************************************************************************/
function checkLogin(req, res, next) {
  if (req.session.userId) {
    res.status(200)
       .json({
         'loggedIn': true,
         'email': req.session.email});
  } else {
    res.status(401)
       .json({ 'loggedIn': false })
  }
}

/*******************************************************************************
 * Register User
 * -----------------------------------------------------------------------------
 * Params: None
 * Body: { email, password }
 * Success: 201 { success: 'new user created', email, id }
 * Failure: 400 { error: 'User with email: {email} already registered' }
 *          500 { error: 'Could not register user' }
 ******************************************************************************/
function registerUser(req, res, next) {
  let email = req.body.email;
  let password = req.body.password;

  // Validate Email
  if (!isEmailValid(email)) {
    res.status(400)
       .json({ 'error': 'Invalid email address' });
    return;
  }
  
  // TODO: Validate password???

  // Prepare data
  let salt = getSalt();
  let hash = getHash(salt, password);
  let data = {
    'salt': salt,
    'hash': hash,
    'dateCreated': Date.now(),
    'lastUpdated': Date.now()
  };

  db.one('INSERT INTO public."user" (email, data) VALUES ($1, $2) RETURNING id',[email, data])
    .then((result) => {

      // set session/cookie info
      req.session.userId = result.id;
      req.session.email = email;

      res.status(201)
         .json({
           'success': 'New user created',
           'email': email,
           'id': req.session.userId
      });
    }).catch((err) => {
      if (err.code == 23505) {
        res.status(400)
          .json({ 'error': `User with email: ${email} already registered` });
      } else {
        res.status(500)
           .json({ 'error': 'Could not register user' });
      }
    });
}

/*******************************************************************************
 * Login User
 * -----------------------------------------------------------------------------
 * Params: None
 * Body: {email, password}
 * Success: 200 {email, id}
 * Failure: 401 {'error': 'Incorrect password'}
 *          404 {'error': 'User does not exist'}
 ******************************************************************************/
function loginUser(req, res, next) {
  let email = req.body.email;
  let password = req.body.password;
  let salt, id, hash;

  db.one('SELECT id, data FROM public."user" WHERE email = $1', [email])
    .then((result) => {
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
             'email': email,
             'id': req.session.userId });
      } else {
        res.status(401)
           .json({ 'error': 'Incorrect password' })
      }
    }).catch((err) => {
      res.status(404)
         .json({ 'error': 'User does not exist' })
    });
}

/*******************************************************************************
 * Logout User
 * -----------------------------------------------------------------------------
 * Params: None (cookie)
 * Body: None
 * Success: 200 { success: 'User logged out' }
 * Failure: 404 { error: 'User already logged out' }
 ******************************************************************************/
function logoutUser(req, res, next) {
  if (req.sessionID) {
    req.session.destroy( () => {
      res.status(200)
         .json({ 'success': 'logged out' });
    });
  } else {
    res.status(404)
       .json({ 'error': 'User already logged out' });
  }
}

/*******************************************************************************
 * Update User
 * -----------------------------------------------------------------------------
 * Params: None (cookie)
 * Body: {password, ?newPassword, ?email}
 * Success: 200 { success: 'Updated one user',
                  data: { email } }
 * Failure: 400 { error: 'No data to update' }
 *          400 { error: 'Could not update user' }
 *          401 { error: 'Incorrect password' }
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
       .json({ 'error': 'No data to update' });
    return;
  }

  let salt, hash;

  // get current user data
  db.one('SELECT email, data FROM public."user" WHERE id = $1;', [userId])
    .then((result) => {
      // check password
      salt = result.data.salt;
      hash = result.data.hash;
      if (hash !== getHash(salt, password)) {
        res.status(401)
           .json({ 'error': 'Incorrect password' });
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
           .json({ 'error': 'No data to update' });
        return;
      }

      return db.one('UPDATE public."user" SET email = $1, data = $2 WHERE id = $3 RETURNING email;',[email, data, userId]);
    }).then((result) => {

      // set session/cookie info
      req.session.email = result.email;

      res.status(200)
         .json({ 'success': 'Updated one user',
                 'data': result });
    }).catch((err) => {
      res.status(400)
         .json({ 'error': 'Could not update user' });
    });
}

/*******************************************************************************
 * Delete User
 * -----------------------------------------------------------------------------
 * Params: None (cookie)
 * Body: None
 * Success: 200 { success : 'Deleted user' }
 * Failure: 400 { error: 'Could not delete user' }
 ******************************************************************************/
function deleteUser(req, res, next) {
  let userId = req.session.userId;

  db.none('DELETE FROM public."user" WHERE id=$1', [userId])
    .then(() => {
      res.status(200)
         .json({ 'success': 'Deleted user' });
    }).catch((err) => {
      res.status(400)
         .json({ 'error': 'Could not delete user' });
    });
}

/*******************************************************************************
 * Get All User Notebooks
 * -----------------------------------------------------------------------------
 * Params: none (cookie)
 * Body: none
 * Success: 200 { success: 'Retrieved {count} notebooks',
 *                data: [{notebook}...] }
 * Failure: 400 { error: 'Could not get notebooks' }
 ******************************************************************************/
function getAllUserNotebooks(req, res, next) {
  let userId = req.session.userId;

  db.any('SELECT id, data FROM public.notebook WHERE userId=$1', [userId])
    .then((result) => {
      res.status(200)
          .json({
            'success': `Retrieved ${result.length} notebooks`,
            'data': result });
    }).catch((err) => {
      res.status(400)
         .json({'error': 'Could not get notebooks'});
    });
}

/*******************************************************************************
 * Create Notebook
 * -----------------------------------------------------------------------------
 * Params: none (cookie)
 * Body: {title}
 * Success: 201 { success: 'Created notebook',
 *                data: { id, data } }
 * Failure: 400 { error: 'Could not create notebook' }
 ******************************************************************************/
function createNotebook(req, res, next) {
  let userId = req.session.userId;
  let body = req.body;

  // Create data object to be inserted into new notebook
  let data = {};
  data.title = !body.title || body.title.length == 0 ? 'New Notebook' : body.title;
  data.dateCreated = Date.now();
  data.lastUpdated = data.dateCreated;

  db.one('INSERT INTO public.notebook (userid, data) VALUES ($1, $2) RETURNING id, data;', [userId, data])
    .then((result) => {
      res.status(201)
         .json({
           'success': 'Created notebook',
           'data': result });
    }).catch((err) => {
      res.status(400)
         .json({ 'error': 'Could not create notebook' });
    });
}

/*******************************************************************************
 * Update Notebook
 * -----------------------------------------------------------------------------
 * Params: notebookId
 * Body: {title}
 * Success: 200 { success: 'Updated notebook',
 *                data: {id, data}
 * Failure: 400 { error: 'Missing data to insert' }
 *          400 { error: 'Data is the same, did not insert' }
 *          400 { error: 'Could not update notebook' }
 ******************************************************************************/
function updateNotebook(req, res, next) {
  let userId = req.session.userId;
  let params = req.params;
  let notebookId = parseInt(params.notebookId);
  let body = req.body;
  
  // check to see if there is any data to edit
  if (!body.title || body.title.length == 0) {
    res.status(400)
        .json({ 'error':'Missing data to insert' });
    return;
  }

db.one('SELECT data FROM public.notebook WHERE id = $1 AND userid = $2;', [notebookId, userId])
  .then((result) => {
    if (result.data.title == body.title) {
      res.status(400)
         .json({ 'error': 'Data is the same, did not insert' });
      return;
    }

    let data = {};
    data.title = body.title;
    data.dateCreated = result.data.dateCreated;
    data.lastUpdated = Date.now();

    return db.one('UPDATE public.notebook SET data = $1 WHERE id = $2 RETURNING id, data;', [data, notebookId]);
  }).then ((result) => {
    res.status(200)
       .json({
         'success': 'Updated notebook',
         'data': result });
  }).catch((err) => {
    res.status(400)
       .json({ 'error': 'Could not update notebook' });
  });
}

/*******************************************************************************
 * Delete Notebook
 * -----------------------------------------------------------------------------
 * Params: notebookId
 * Body: none
 * Success: 200 { success: 'Deleted notebook' }
 * Failure: 400 { error: 'Could not delete notebook' }
 ******************************************************************************/
function deleteNotebook(req, res, next) {
  let userId = req.session.userId;
  let params = req.params;
  let notebookId = parseInt(params.notebookId);

db.one('DELETE FROM public.notebook WHERE id=$1 AND userid=$2 RETURNING id', [notebookId, userId])
  .then((result) => {
    res.status(200)
       .json({ 'success': 'Deleted notebook' });
  }).catch((err) => {
    res.status(400)
       .json({ 'error': 'Could not delete notebook' });
  });
}

/*******************************************************************************
 * Get All User Notes
 * -----------------------------------------------------------------------------
 * Params: None (cookie)
 * Body: None
 * Success: 200 { success: 'Retrieved {count} notes',
 *                data: [{note}...]
 * Failure: 400 { error: 'Could not get notes' }
 ******************************************************************************/
function getAllUserNotes(req, res, next) {
  let userId = req.session.userId;

  db.any('SELECT id, data, notebookid FROM public.note WHERE userid = $1;', [userId])
    .then((result) => {
      res.status(200)
         .json({
           'success': `Retrieved ${result.length} notes`,
           'data': result})
    }).catch((err) => {
      res.status(400)
         .json({ 'error': 'Could not get notes' });
    });
}

/*******************************************************************************
 * Get All Notebook Notes
 * -----------------------------------------------------------------------------
 * Params: notebookId
 * Body: None
 * Success: 200 { success: 'Retrieved {count} notes',
 *                data: [{note}...]
 * Failure: 400 { error: 'Could not get notes' }
 ******************************************************************************/
function getAllNotebookNotes(req, res, next) {
  let userId = req.session.userId;
  let params = req.params;
  let notebookId = parseInt(params.notebookId);

db.any('SELECT id, data, notebookid FROM public.note WHERE userid = $1 AND notebookid = $2;', [userId, notebookId])
  .then((result) => {
    if (result.length == 0) {
      res.status(404)
         .json({ 'error': 'Notebook does not exist' });
      return;
    }
    res.status(200)
       .json({
         'success': `Retrieved ${result.length} notes`,
         'data': result})
  }).catch((err) => {
    res.status(400)
        .json({ 'error': 'Could not get notes' });
  });
}

/*******************************************************************************
 * Get Single Note
 * -----------------------------------------------------------------------------
 * Params: noteId
 * Body: None
 * Success: 200 { success: 'Retrieved one note',
 *                data: {note}
 * Failure: 400 { error: 'Could not get note' }
 ******************************************************************************/
function getSingleNote(req, res, next) {
  let userId = req.session.userId;
  let params = req.params;
  let noteId = parseInt(params.noteId);

  db.one('SELECT id, data, notebookid FROM public.note WHERE userid = $1 AND id = $2;', [userId, noteId])
  .then((result) => {
    res.status(200)
       .json({
         'success': 'Retrieved one note',
         'data': result})
  }).catch((err) => {
    res.status(400)
      .json({ 'error': 'Could not get note' });
  });
}

/*******************************************************************************
 * Create Note
 * -----------------------------------------------------------------------------
 * Params: None (cookie)
 * Body: None
 * Success: 201 { success: 'Created note',
 *                data: {note}
 * Failure: 400 { error: 'Could not create note' }
 ******************************************************************************/
function createNote(req, res, next) {
  let userId = req.session.userId;
  let params = req.params;
  let notebookId = parseInt(params.notebookId);
  let body = req.body;
  let data = {};
  data.dateCreated = Date.now();
  data.lastUpdated = data.dateCreated;
  data.title = body.title;
  data.content = '';

  db.one('INSERT INTO public.note (data, notebookid, userid) VALUES ($1, $2, $3) RETURNING id, data, notebookId;', [data, notebookId, userId])
    .then((result) => {
      res.status(201)
      .json({
        'success': 'Created note',
        'data': result });
    }).catch( (err) => {
      res.status(400)
         .json({ 'error': 'Could not create note' });
    });
}

/*******************************************************************************
 * Update Note
 * -----------------------------------------------------------------------------
 * Params: noteId
 * Body: {title, content}
 * Success: 200 { success: 'Note updated',
 *                data: {note}
 * Failure: 400 { error: 'Could not update note' }
 ******************************************************************************/
function updateNote(req, res, next) {
  let userId = req.session.userId;
  let params = req.params;
  let noteId = parseInt(params.noteId);
  let body = req.body;
  console.log(body)

  let notebookId;

  db.any('SELECT notebookid, id FROM public.note WHERE userid = $1', [userId])
    .then((result) => {
      let notebookArray = result.map(item => item.notebookid);
      notebookId = result.find(item => item.id == noteId)["notebookid"];
      notebookId = !body.notebookId
                 ? notebookId
                 : notebookArray.includes(body.notebookId)
                   ? body.notebookId
                   : null;
      if (!notebookId) throw new Error();

      let data = {};
      data.dateCreated = Date.now();
      data.lastUpdated = data.dateCreated;
      data.title = body.title;
      data.content = body.content;
      console.log(data)

      return db.one('UPDATE public.note SET data = $1, notebookid = $2 WHERE id = $3 AND userid = $4 RETURNING id, data, notebookid;', [data, notebookId, noteId, userId]);
    }).then((result) => {
      res.status(200)
         .json({ 'success': 'Note uptdated',
                 'data': result });
    }).catch((err) => {
      res.status(400)
         .json({ 'error': 'Could not update note' });
      return;
    });
}

/*******************************************************************************
 * Delete Note
 * -----------------------------------------------------------------------------
 * Params: noteId
 * Body: None
 * Success: 200 { success: 'Note deleted' }
 * Failure: 400 { error: 'Could not delete note' }
 ******************************************************************************/
function deleteNote(req, res, next) {
  let userId = req.session.userId;
  let params = req.params;
  let noteId = parseInt(params.noteId);

  db.one('DELETE FROM public.note WHERE id = $1 AND userid = $2 RETURNING id', [noteId, userId])
    .then((result) => {
      res.status(200)
         .json({ 'success': 'Note deleted' });
    }).catch(err => {
      console.log(err)
      res.status(400)
         .json({ 'error': 'Could not delete note' });
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

  getAllUserNotes: getAllUserNotes,
  getAllNotebookNotes: getAllNotebookNotes,
  getSingleNote: getSingleNote,
  createNote: createNote,
  updateNote: updateNote,
  deleteNote: deleteNote,
};