var express = require('express');
var router = express.Router();

var db = require('../queries');

router.use( (req, res, next) => {
  // TODO: I would like to check to see if user is logged in, if not, end response
  console.log('Time: ', Date.now());
  if (true) {//logged in
    next();
  } else {
    res.end();
  }
});



router.get('/user/session', db.checkLogin);
router.post('/user/session', db.loginUser);
router.delete('/user/session', db.logoutUser);
router.post('/user', db.registerUser);
router.patch('/user', db.updateUser);
router.delete('/user', db.deleteUser);

router.get('/notebook', db.getAllUserNotebooks);
router.post('/notebook', db.createNotebook);
router.patch('/notebook/:notebookId', db.updateNotebook);
router.delete('/notebook/:notebookId', db.deleteNotebook);

router.get('/note', db.getAllUserNotes);
router.get('/note/notebook/:notebookId', db.getAllNotebookNotes);
router.get('/note/:noteId', db.getSingleNote);
router.post('/note/:notebookId', db.createNote);
router.patch('/note/:noteId', db.updateNote);
router.delete('/note/:noteId', db.deleteNote);

module.exports = router;