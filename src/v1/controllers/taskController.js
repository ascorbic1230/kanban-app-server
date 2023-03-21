const router = require('express').Router({ mergeParams: true });
const { param, body } = require('express-validator');

const taskService = require('../services/taskService');

const { responseHelper } = require('../helpers');
const { validate, isObjectId } = require('../middlewares/validation');
const { verifyToken } = require('../middlewares/verifyToken');

// Create
router.post(
	'/',
	param('boardId').custom((value) => {
		if (!isObjectId(value)) {
			return Promise.reject('Invalid board id');
		}
		return Promise.resolve();
	}),
	body('sectionId').custom((value) => {
		if (!isObjectId(value)) {
			return Promise.reject('Invalid section id');
		}
		return Promise.resolve();
	}),
	validate,
	verifyToken,
	(req, res) => {
		const { sectionId } = req.body;

		taskService.createTask(sectionId)
			.then(({ task }) => {
				res.status(201).json(responseHelper({ task }, 'Create task successfully'));
			})
			.catch((error) => res.status(500).json(responseHelper(null, error.message, false)))
	}
)

// Update
router.put(
	'/update-position',
	param('boardId').custom((value) => {
		if (!isObjectId(value)) {
			return Promise.reject('Invalid board id');
		}
		return Promise.resolve();
	}),
	validate,
	verifyToken,
	(req, res) => {
		const { resourceList, resourceSectionId, destinationList, destinationSectionId } = req.body;

		taskService.updateTaskPosition(resourceList, resourceSectionId, destinationList, destinationSectionId)
			.then(() => {
				res.status(200).json(responseHelper(null, 'Update task position successfully'));
			})
			.catch((error) => res.status(500).json(responseHelper(null, error.message, false)))
	}
)

// Update
router.put(
	'/:taskId',
	param('boardId').custom((value) => {
		if (!isObjectId(value)) {
			return Promise.reject('Invalid board id');
		}
		return Promise.resolve();
	}),
	param('taskId').custom((value) => {
		if (!isObjectId(value)) {
			return Promise.reject('Invalid task id');
		}
		return Promise.resolve();
	}),
	validate,
	verifyToken,
	(req, res) => {
		const { taskId } = req.params;
		const { title, content } = req.body;

		taskService.updateTask(taskId, { title, content })
			.then(({ task }) => {
				res.status(200).json(responseHelper({ task }, 'Update task successfully'));
			})
			.catch((error) => res.status(500).json(responseHelper(null, error.message, false)))
	}
)

// Delete
router.delete(
	'/:taskId',
	param('boardId').custom((value) => {
		if (!isObjectId(value)) {
			return Promise.reject('Invalid board id');
		}
		return Promise.resolve();
	}),
	param('taskId').custom((value) => {
		if (!isObjectId(value)) {
			return Promise.reject('Invalid task id');
		}
		return Promise.resolve();
	}),
	validate,
	verifyToken,
	(req, res) => {
		const { taskId } = req.params;

		taskService.deleteTask(taskId)
			.then(({ task }) => {
				res.status(200).json(responseHelper({ task }, 'Delete task successfully'));
			})
			.catch((error) => res.status(500).json(responseHelper(null, error.message, false)))
	}
)

module.exports = router;