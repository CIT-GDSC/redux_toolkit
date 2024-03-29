const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });

    } catch (error) {
        console.log(error);
    }
}


module.exports = connectDB
