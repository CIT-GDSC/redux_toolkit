const User = require('../model/User');
const bcrypt = require('bcrypt');
const expressAsyncHandler = require('express-async-handler');


const handleNewUser = expressAsyncHandler(async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ "message": "Error, All fields are Required" });
    const duplicate = await User.findOne({ username: user }).exec();
    if (duplicate) return res.sendStatus(409);

    try {
        const hashedPassword = await bcrypt.hash(pwd, 10);
        const result = await User.create({
            "username": user,
            "password": hashedPassword
        });
        console.log(result);
        res.status(201).json({ "success": ` New user ${user} created succesfully` });
    } catch (error) {
        res.status(500).json({ "message": error.message });
    }
});


module.exports = { handleNewUser };
