const googleUser = require('../models/googleUser');
const User = require('../models/User');

const googleaccounts = async (req, res) => {
    const { email, name, picture } = req.body;

    const user = await googleUser.findOne({ email }); // email: email
    
    var dateWithTime = new Date().toLocaleString().replace(",", "");

    if(!user){
        await googleUser.create({ email, name, picture, logs: [dateWithTime] });
    }
    else{
        user.name = name;
        user.picture = picture;
        user.logs.push(dateWithTime);

        await user.save();
    }
    
    res.status(201).json({message: 'Success'});  
};

module.exports = { googleaccounts };