var express = require('express');
var router = express.Router();

var db = require('../queries');

router.get('/user/check-login', db.checkLogin);
router.post('/user/login', db.loginUser);
router.post('/user/register', db.registerUser);
router.post('/user/logout', db.logoutUser);
// router.patch('/user/:userId', db.updateUser);
router.delete('/user/:userId', db.deleteUser);

// router.get('/notebook/:userId', db.getAllUserNotebooks);
// router.post('/notebook/:userId', db.createNotebook);
// router.patch('/notebook/:notebookId', db.updateNotebook);
// router.delete('/notebook/:notebookId', db.deleteNotebook);

// router.get('/note/:userId', db.getAllUserNotes);
// router.get('/note/:notebookId', db.getAllNotebookNotes);
// router.get('/note/:noteId', db.getSingleNote);
// router.post('/note/:notebookId', db.createNote);
// router.patch('/note/:noteId', db.updateNote);
// router.delete('/note/:noteId', db.deleteNote);

module.exports = router;