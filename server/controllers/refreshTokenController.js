const User = require('../model/User');
const jwt = require('jsonwebtoken');
const esxpressAsyncHandler = require('express-async-handler')

const handleRefreshToken = esxpressAsyncHandler(async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });

    const foundUser = await User.findOne({ refreshToken }).exec();

    if (!foundUser) {
        jwt.verify(refreshToken, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) return res.sendStatus(401);
            // delete refresh tokens of hacked users
            const hackedUser = await User.findOne({ username: decoded.username }).exec();
            hackedUser.refreshToken = [];
            const result = await hackedUser.save();
        });
        return res.sendStatus(403);
    }
    const newRefreshTokenArray = foundUser.refreshToken.filter(rt => rt !== refreshToken);

    //evaluate jwt
    jwt.verify(refreshToken, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            //** two possibilities */

            //expired refresh token
            foundUser.refreshToken = [...newRefreshTokenArray];
            const result = await foundUser.save();
        }
        if (err || foundUser.username !== decoded.username) return res.sendStatus(403);

        //refresh token was still valid
        const roles = Object.values(foundUser.roles); //proceed to check roles
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": decoded.username,
                    "roles": roles
                }
            },
            process.env.JWT_SECRET, { expiresIn: '10s' }
        );

        const newRefreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.JWT_SECRET,
            { expiresIn: '15s' }
        );

        //saving refreshToken with current User
        foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
        const result = await foundUser.save();

        //create secure cookie with refresh token
        res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
        res.json({ accessToken });
    });

});


module.exports = { handleRefreshToken };
