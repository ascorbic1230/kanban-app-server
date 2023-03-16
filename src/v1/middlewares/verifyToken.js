const jsonwebtoken = require('jsonwebtoken');
const { responseHelper } = require('../helpers');

const decodeToken = (bearerHeader) => {
	if (bearerHeader) {
		const bearer = bearerHeader.split(' ')[1];
		try {
			const decodedToken = jsonwebtoken.verify(
				bearer,
				process.env.TOKEN_SECRET_KEY,
			)

			return decodedToken;
		} catch {
			return false;
		}
	} else {
		return false;
	}
}

exports.verifyToken = (req, res, next) => {
	const decodedToken = decodeToken(req.headers.authorization);
	if (decodedToken) {
		req.userId = decodedToken.id;
		next();
	} else {
		res.status(401).json(responseHelper(null, 'Unauthorized', false));
	}
}