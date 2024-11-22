const express = require('express');
const router = express.Router();
const controllers = require('../controllers/usersController');
const upload = require("../multerConfig/storageConfig");


//routes for Post data
router.post('/user/register',upload.single("user_profile"),controllers.userpost);

//Route for Get All darta
router.get('/user/details',controllers.userget);

//Route for Single user
router.get('/user/:id',controllers.getsingleuser);

//Route for Single user
router.put('/user/edit/:id',upload.single("user_profile"),controllers.useredit);

//Delete user 
router.delete('/user/delete/:id',controllers.userdelete);

//Update status instantly
router.put('/user/status/:id',controllers.userstatus);

//Export User Data
router.get('/userexport/',controllers.userExport);

module.exports = router;