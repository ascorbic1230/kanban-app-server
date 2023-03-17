const router = require('express').Router();
const { param } = require('express-validator');

const boardService = require('../services/boardService');

const { responseHelper } = require('../helpers');
const { validate, isObjectId } = require('../middlewares/validation');
const { verifyToken } = require('../middlewares/verifyToken');

router.post(
	'/',
	verifyToken,
	(req, res) => {
		boardService.addBoard(req.userId)
			.then(({ board }) => {
				res.status(201).json(responseHelper({ board }, 'Create board successfully'));
			})
			.catch((error) => res.status(500).json(error))
	}
)

router.get(
	'/',
	verifyToken,
	(req, res) => {
		boardService.getAllByUserId(req.userId)
			.then(({ boards }) => {
				res.status(201).json(responseHelper({ boards }, 'Get all boards successfully'));
			})
			.catch((error) => res.status(500).json(error))
	}
)

router.put(
	'/',
	verifyToken,
	(req, res) => {
		boardService.updatePosition(req.body.boards)
			.then(() => {
				res.status(201).json(responseHelper(null, 'Update boards position successfully'));
			})
			.catch((error) => res.status(500).json(error))
	}
)

router.get(
	'/:boardId',
	param('boardId').custom((value) => {
		if (!isObjectId(value)) {
			return Promise.reject('Invalid id');
		}
		return Promise.resolve();
	}),
	validate,
	verifyToken,
	(req, res) => {
		const { boardId } = req.params;
		boardService.getBoardById(boardId, req.userId)
			.then(({ board }) => {
				return res.status(200).json(responseHelper({ board }, 'Get board successfully'));
			})
			.catch((error) => res.status(500).json(error));
	}
)

module.exports = router;