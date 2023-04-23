const allowedOrigins = require('./allowedOrigins');


const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback( new Error ("Access denied by cors"))
        }
    },
    optionsSuccessStatus: 200
}

module.exports = corsOptions;
