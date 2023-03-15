const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const { responseHelper } = require('../helpers');

exports.validate = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json(responseHelper({ errors: errors.array() }, '', false));
	}
	next();
}

exports.isObjectId = (value) => mongoose.Types.ObjectId.isValid(value);