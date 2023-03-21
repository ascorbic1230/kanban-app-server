const router = require('express').Router({ mergeParams: true });
const { param } = require('express-validator');

const sectionService = require('../services/sectionService');

const { responseHelper } = require('../helpers');
const { validate, isObjectId } = require('../middlewares/validation');
const { verifyToken } = require('../middlewares/verifyToken');

// Create
router.post(
	'/',
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

		sectionService.createSection(boardId)
			.then(({ section }) => {
				res.status(201).json(responseHelper({ section }, 'Create section successfully'));
			})
			.catch((error) => res.status(500).json(responseHelper(null, error.message, false)))
	}
)

// Update
router.put(
	'/:sectionId',
	param('boardId').custom((value) => {
		if (!isObjectId(value)) {
			return Promise.reject('Invalid board id');
		}
		return Promise.resolve();
	}),
	param('sectionId').custom((value) => {
		if (!isObjectId(value)) {
			return Promise.reject('Invalid section id');
		}
		return Promise.resolve();
	}),
	validate,
	verifyToken,
	(req, res) => {
		const { sectionId } = req.params;
		const { title } = req.body;

		sectionService.updateSection(sectionId, { title })
			.then(({ section }) => {
				res.status(200).json(responseHelper({ section }, 'Update section successfully'));
			})
			.catch((error) => res.status(500).json(responseHelper(null, error.message, false)))
	}
)

// Delete
router.delete(
	'/:sectionId',
	param('boardId').custom((value) => {
		if (!isObjectId(value)) {
			return Promise.reject('Invalid board id');
		}
		return Promise.resolve();
	}),
	param('sectionId').custom((value) => {
		if (!isObjectId(value)) {
			return Promise.reject('Invalid section id');
		}
		return Promise.resolve();
	}),
	validate,
	verifyToken,
	(req, res) => {
		const { sectionId } = req.params;

		sectionService.deleteSection(sectionId)
			.then(({ section }) => {
				res.status(200).json(responseHelper({ section }, 'Delete section successfully'));
			})
			.catch((error) => res.status(500).json(responseHelper(null, error.message, false)))
	}
)

module.exports = router;
