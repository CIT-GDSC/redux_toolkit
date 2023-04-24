const expressAsyncHandler = require('express-async-handler');
const User = require('../model/User');
const asyncHandler = require('express-async-handler');



const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find();
    if (!users) return res.status(204).json({ 'message': 'No users found' });
    res.json(users);
});


const deleteUser = asyncHandler(async (req, res) => {
    if (!req?.body?.id) return res.status(401).json({ "message": "User ID required" });
    const user = await User.findOne({ _id: req.body.id }).exec();

    if (!user) {
        return res.status(204).json({ "message": `User with ID ${req.body.id} returned no value` });
    }
    const result = await user.deleteOne({ _id: req.body.id });
    res.json(result);
});

const getUser = expressAsyncHandler(async (req, res) => {
    if (!req?.params?.id) return res.status(400).json(({ "message": "Parameters lack user ID" }));
    const user = await User.findOne({ _id: req.params.id }).exec();
    if (!user) {
        return res.status(204).json({ "message": `User with ID ${req.body.id} returned no value` });
    }

    res.json(user);
});


module.exports = { getAllUsers, deleteUser, getUser };
