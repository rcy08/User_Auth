const User = require('../models/User');
const googleUser = require('../models/googleUser');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

const handleError = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '' };

    if(err.message === 'Please verify your email first') {
        errors.password = err.message;
        return errors;
    }

    if(err.message === 'Please fill all fields') {
        errors.password = err.message;
        return errors;
    }

    if(err.message === 'Email not registered') {
        errors.email = err.message;
        return errors;
    }
    if(err.message === 'You are registered with us but not this way. Try another way of signing in.') {
        errors.password = err.message;
        return errors;
    }

    if(err.message === 'Incorrect Password') {
        errors.password = err.message;
        return errors;
    }
    
    if(err.code === 11000) {
        errors.email = 'Email/Username already registered';
        return errors;
    }

    if(err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }
    return errors;
}

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE});
}

const signup = async (req, res) => {
    const { name, email, password, recaptchaResponse } = req.body;

    try {

        const usernameAlreadyExists = await User.findOne({ name });

        if(usernameAlreadyExists) {
            return res.status(500).json({ errors: {
                username: 'Username already exists'
            }});
        }

        const secretKey = process.env.RECAPTCHA_SECRET_KEY;

        const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
          method: 'POST',
          headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
          body: `secret=${secretKey}&response=${recaptchaResponse}`,
        });

        const captchaData = await response.json();

        if(!captchaData.success){
            return res.status(500).json({ errors: {
                captcha: 'captcha verification failed'
            } });
        }

        const user = await User.create({ name, email, password });

        const verificationToken = user.getEmailVerificationToken();

        await user.save();

        const verificationUrl = `https://user-auth-csv.netlify.app/email-verification/${verificationToken}`;

        const message = `
           <h1> Please go to this link to verify your Email </h1>
           <a href=${verificationUrl} clicktracking=off> ${verificationUrl} </a>
        `

        try {
            sendEmail({
                to: user.email,
                subject: 'Email Verification',
                text: message
            });

            res.status(201).json({ user: user._id });
        }
        catch (err) {
            console.log(err);

            user.emailVerificationToken = undefined;
            user.emailVerificationExpire = undefined;

            await user.save();

            res.status(500).json({ error: 'Email could not be sent' });
        }

    }
    catch (err) {
        const errors = handleError(err);
        res.status(400).json({ errors });
    }
}

const emailverification = async (req, res) => {
    
    const emailVerificationToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    try {
        const user = await User.findOne({
          emailVerificationToken,
          emailVerificationExpire: { $gt: Date.now() }
        });

        if (!user) {
          res.status(400).json({ error: 'Invalid email verification token' });
        }

        user.isVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpire = undefined;

        await user.save();

        res.status(201).json({
          success: true,
          data: 'Email Verification Successful',
        });

    } catch (error) {
        console.log(error);
    }

}

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);

        user.setUserTokenExpire();

        var dateWithTime = new Date().toLocaleString().replace(",", "");
        user.logs.push(dateWithTime);
        console.log(dateWithTime);  

        await user.save();

        res.status(201).json({ user: user._id, token });
    }
    catch (err) {
        const errors = handleError(err);
        res.status(400).json({ errors });
    }
}

const forgotpassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if(!user) {
            return res.status(400).json({ error: 'User does not exist' });
        }

        const resetToken = user.getResetPasswordToken();

        await user.save();

        const resetUrl = `https://user-auth-csv.netlify.app/reset-password/${resetToken}`;

        const message = `
          <h1> Hello, ${email} </h1>
          <h2> You requested a password reset </h2>
          <p> Please click on this link to reset your password: </p>
          <a href=${resetUrl} clicktracking=off> ${resetUrl} </a>
          <p> If you didn't request a password reset, please ignore this email. </p>
        `
        try {
            sendEmail({
                to: user.email,
                subject: 'Password Reset Request',
                text: message
            });

            res.status(200).json({ success: true, data: 'Email Sent'  });

        } catch (error) {
            console.log(error);

            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save();

            return res.status(500).json({ error : 'Email could not be sent' });
        }
    }
    catch (error) {

    }
}

const resetpassword = async (req, res) => {

    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');

    try {

        const user = await User.findOne({
          resetPasswordToken,
          resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
          return res.status(400).json({ error: 'Invalid reset token' });
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(201).json({
          success: true,
          data: 'Password Reset Success',
          token: createToken(user._id)
        });

    } catch (error) {
        console.log(error);
    }
}

const getuserdetails = async (req, res) => {
    
    const user = req.user;

    res.status(200).json({
        success: true,
        email: user.email,
        id: user._id,
        role: user.role
    });
}

const deleteaccount = async (req, res) => {

    const { email } = req.body;

    try {

        await User.findOneAndDelete({ email });

        await googleUser.findOneAndDelete({ email });

        res.status(200).json({ success: true });

    } catch (error) {

        res.status(404).json({ error: 'User not found' });
        
    }
}


module.exports = {
    signup,
    login,
    forgotpassword,
    resetpassword,
    getuserdetails,
    deleteaccount,
    emailverification
}