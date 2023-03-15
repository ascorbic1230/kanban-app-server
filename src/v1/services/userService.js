const User = require('../models/user');
const cryptoJS = require('crypto-js');

const addUser = async (username, password) => {
	try {
		const cryptedPassword = cryptoJS.AES.encrypt(password, process.env.PASSWORD_SECRET_KEY);

		const user = await User.create(username, cryptedPassword);

		return { user };
	} catch (error) {
		throw new Error(error);
	}
};

const findUserById = async (id) => {
	try {
		const user = await User.findOne({ _id: id });

		return { user };
	} catch (error) {
		throw new Error(error);
	}
}

const findUserByUsername = async (username) => {
	try {
		const user = await User.findOne({ username }).select('username password');

		return { user };
	} catch (error) {
		throw new Error(error);
	}
}

module.exports = {
	addUser,
	findUserByUsername,
	findUserById,
};
