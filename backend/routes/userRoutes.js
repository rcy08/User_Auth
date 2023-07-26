const express = require('express');
const {
    signup,
    login,
    forgotpassword,
    resetpassword,
    getuserdetails,
    deleteaccount,
    emailverification
} = require('../controllers/userController');

const { googleaccounts } = require('../controllers/googleUserController');

const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/signup', signup);

router.get('/email-verification/:token', emailverification);

router.post('/login', login);

router.post('/forgot-password', forgotpassword);

router.put('/reset-password/:resetToken', resetpassword);

router.get('/account-details', auth, getuserdetails);

router.delete('/account-details', deleteaccount);

router.post('/google-accounts', googleaccounts);

module.exports = router;

