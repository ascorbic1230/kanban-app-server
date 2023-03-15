const router = require('express').Router();
const cryptoJS = require('crypto-js');
const jsonwebtoken = require('jsonwebtoken');
const { body } = require('express-validator');

const userService = require('../services/userService');
const { responseHelper } = require('../helpers');
const { validate } = require('../middlewares/validation');
const { verifyToken } = require('../middlewares/verifyToken');

router.post(
	'/signup',
	body('username').isLength({ min: 8 }).withMessage(
		'Username must be at least 8 characters'
	),
	body('password').isLength({ min: 8 }).withMessage(
		'Password must be at least 8 characters'
	),
	body('confirmPassword').isLength({ min: 8 }).withMessage(
		'Confirm password must be at least 8 characters'
	),
	body('confirmPassword').custom((value, { req }) => {
		if (value !== req.body.password) {
			throw new Error('Password confirmation does not match password');
		}
		return true;
	}),
	body('username').custom((value) => {
		userService.findUserByUsername(value)
			.then(({ user }) => {
				if (user) {
					return Promise.reject('Username already in use');
				}
			});
		return true;
	}),
	validate,
	(req, res) => {
		const { username, password } = req.body;

		userService.addUser(username, password)
			.then(data => {
				const { user } = data;

				const token = jsonwebtoken.sign(
					{ id: user._id },
					process.env.TOKEN_SECRET_KEY,
					{ expiresIn: '24h' },
				);

				res.status(201).json(responseHelper({ user, token }, 'Sign up successfully'));
			})
			.catch(error => res.status(500).json(error));
	}
);

router.post(
	'/signin',
	body('username').isLength({ min: 8 }).withMessage(
		'Username must be at least 8 characters'
	),
	body('password').isLength({ min: 8 }).withMessage(
		'Password must be at least 8 characters'
	),
	(req, res) => {
		const { username, password } = req.body;

		userService.findUserByUsername(username)
			.then(data => {
				const { user } = data;
				if (!user) {
					return res.status(401).json(responseHelper(null, 'Invalid username or password', false));
				}

				const decryptedPassword = cryptoJS.AES.decrypt(
					user.password,
					process.env.PASSWORD_SECRET_KEY
				).toString(cryptoJS.enc.Utf8);

				if (decryptedPassword !== password) {
					return res.status(401).json(responseHelper(null, 'Wrong password', false));
				}

				const token = jsonwebtoken.sign(
					{ id: user._id },
					process.env.TOKEN_SECRET_KEY,
					{ expiresIn: '24h' },
				);

				res.status(200).json(responseHelper({ token }, 'Sign in successfully'))
			})
			.catch(error => res.status(500).json(error));
	}
);

router.post(
	'verify-token',
	verifyToken,
	(req, res) => {
		userService.findUserById(req.userId)
			.then(({ user }) => {
				return res.status(200).json(responseHelper({ user }, 'Verify user successfully'));
			})
			.catch((error) => res.status(401).json(responseHelper(null, 'Unauthorized', false)));
	}
)

module.exports = router;