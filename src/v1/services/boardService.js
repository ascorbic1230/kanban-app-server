const Board = require('../models/board');
const Section = require('../models/section');
const Task = require('../models/task');

const addBoard = async (userId, params = {}) => {
	try {
		const boardsCount = await Board.find({ user: userId }).count();
		const board = await Board.create({
			user: userId,
			position: boardsCount > 0 ? boardsCount : 0,
		});

		return { board };
	} catch (error) {
		throw new Error(error);
	}
}

// get all boards of user
const getAllByUserId = async (userId) => {
	try {
		const boards = await Board.find({ user: userId }).sort('-position');

		return { boards };
	} catch (error) {
		throw new Error(error);
	}
}

const getBoardById = async (boardId, userId) => {
	try {
		const board = await Board.findOne({ user: userId, _id: boardId })
		if (!board) throw new Error('Board not found');
		const sections = await Section.find({ board: boardId })
		for (const section of sections) {
			const tasks = await Task.find({ section: section.id }).populate('section').sort('-position');
			section._doc.tasks = tasks;
		}
		board._doc.sections = sections;

		return { board };
	} catch (error) {
		throw new Error(error);
	}
}

const updatePosition = async (boards) => {
	try {
		const reversedBoard = boards.reverse();
		for (const key in reversedBoard) {
			const board = reversedBoard[key];
			await Board.findByIdAndUpdate(
				board.id,
				{ $set: { position: key } }
			);
		}
	} catch (error) {
		throw new Error(error);
	}
}

module.exports = {
	addBoard,
	getAllByUserId,
	getBoardById,
	updatePosition, getBoardById
}