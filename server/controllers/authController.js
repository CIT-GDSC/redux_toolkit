const User = require('../model/User');
const expressAsyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


//login Handler
const loginHandler = expressAsyncHandler(async (req, res) => {
    try {
        const cookies = req.cookies;
        const { user, pwd } = req.body;
        if (!user || !pwd) return res.status(400).json({ "message": "Empty Fields detected, cannot proceed" });
        const foundUser = await user.findOne({ username: user }).exec();
        if (!foundUser) return res.sendStatus(401) // unauthorized
        //password integrity
        const match = await bcrypt.compare(pwd, foundUser.password);
        if (match) {
            const roles = Object.values(foundUser.roles).filter(Boolean);
            //create jwts
            const accessToken = jwt.sign({
                "userInfo": {
                    "username": foundUser.usename,
                    "roles": roles
                }
            }, process.env.JWT_SECRET, { expiresIn: '10s' });
            const newRefreshToken = jwt.sign(
                { "username": foundUser.usename },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '10s' }
            );

            let newRefreshTokenArray = !cookies?.jwt ? foundUser.refreshToken : foundUser.refreshToken.filter(rt => rt !== cookies.jwt);
            if (cookies?.jwt) {
                /**
                 * Applicaple scenarios:
                 * 1. User logs in but never uses the refresh Token and also does not log out
                 * 2. RefreshToken is stolen
                 * 3. If !1 && 2, reuse  detection is needed to clear all RTs(refresh tokens) when user logs in
                 */
                const refreshToken = cookies.jwt;
                const foundToken = await User.findOne({ refreshToken }).exec();

                //detected refresh token reuse
                if (!foundToken) {
                    //clear out all previous refresh tokens
                    newRefreshTokenArray = [];
                }

                res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'None' });
            }

            //saving refresh token with current user
            foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
            const result = await foundUser.save();

            //create secure cookies with refresh token
            res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 100 });

            //send Authorization tokens to the user
            res.json({ accessToken });

        } else {
            res.sendStatus(401);
        }
    } catch (error) {
        throw new Error(error);
    }

});

module.exports = { loginHandler };
