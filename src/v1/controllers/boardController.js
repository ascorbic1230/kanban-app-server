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
			.catch((error) => res.status(500).json(responseHelper(null, error.message, false)))
	}
)

router.get(
	'/',
	verifyToken,
	(req, res) => {
		boardService.getAllByUserId(req.userId)
			.then(({ boards }) => {
				res.status(200).json(responseHelper({ boards }, 'Get all boards successfully'));
			})
			.catch((error) => res.status(500).json(responseHelper(null, error.message, false)))
	}
)

router.get(
	'/favourites',
	verifyToken,
	(req, res) => {
		boardService.getAllFavouriteByUserId(req.userId)
			.then(({ boards }) => {
				res.status(200).json(responseHelper({ boards }, 'Get all favourite boards successfully'));
			})
			.catch((error) => res.status(500).json(responseHelper(null, error.message, false)))
	}
)

router.put(
	'/',
	verifyToken,
	(req, res) => {
		boardService.updatePosition(req.body.boards, req.userId)
			.then(({ boards }) => {
				res.status(200).json(responseHelper({ boards }, 'Update boards position successfully'));
			})
			.catch((error) => res.status(500).json(responseHelper(null, error.message, false)))
	}
)

router.put(
	'/favourites',
	verifyToken,
	(req, res) => {
		boardService.updateFavouritePosition(req.body.boards, req.userId)
			.then(({ boards }) => {
				res.status(200).json(responseHelper({ boards }, 'Update favourite boards position successfully'));
			})
			.catch((error) => res.status(500).json(responseHelper(null, error.message, false)))
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
			.catch((error) => res.status(500).json(responseHelper(null, error.message, false)));
	}
)

router.put(
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
		const { title, description, favourite, icon } = req.body;
		boardService.updateBoard({ boardId, title, description, favourite, icon }, req.userId)
			.then(({ board }) => {
				return res.status(200).json(responseHelper({ board }, 'Update board successfully'));
			})
			.catch((error) => res.status(500).json(responseHelper(null, error.message, false)));
	}
)

router.delete(
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
		boardService.deleteBoard(boardId, req.userId)
			.then(() => {
				return res.status(200).json(responseHelper(null, 'Delete board successfully'));
			})
			.catch((error) => res.status(500).json(responseHelper(null, error.message, false)));
	}
)

module.exports = router;