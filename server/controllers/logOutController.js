const User = require('../model/User');
const expressAsyncHandler = require('express-async-handler');

const handleLogout = expressAsyncHandler(async (req, res) => {
    // On client, also delete the accesToken

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //no return value
    const refreshToken = cookies.jwt;

    //is refreshToken in the database?
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204);
    }


    //delete refreshToken in the database
    foundUser.refreshToken = foundUser.refreshToken.filter(rt => rt !== refreshToken);
    const result = await foundUser.save();

    console.log(result);

    res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: "None" });
    res.sendStatus(204);
});


module.exports = { handleLogout };
