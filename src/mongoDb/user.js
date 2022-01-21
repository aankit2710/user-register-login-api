const User = require('../model/user');

const addNewUser = async (userBody) => {
    const user = new User(userBody);
    return Promise.resolve(await user.save());
}

const getUserByUserId = async (req, res, next) => {
    const userDetails = await User.findById(req);
    return Promise.resolve(userDetails);
};

const findUserByUsername = async (username) => {
    const userDetails = await User.find({ userName: username });
    return Promise.resolve(userDetails);
};

const findUserByEmail = async (email) => {
    const userDetails = await User.find({ email: email });
    return Promise.resolve(userDetails);
};

module.exports = { getUserByUserId, findUserByUsername, findUserByEmail, addNewUser };