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
		throw new Error(error.message);
	}
}

// get all boards of user
const getAllByUserId = async (userId) => {
	try {
		const boards = await Board.find({ user: userId }).sort('-position');

		return { boards };
	} catch (error) {
		throw new Error(error.message);
	}
}

// get all favourite boards of user
const getAllFavouriteByUserId = async (userId) => {
	try {
		const boards = await Board.find({ user: userId, favourite: true }).sort('-favouritePosition');

		return { boards };
	} catch (error) {
		throw new Error(error.message);
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
		throw new Error(error.message);
	}
}

const updatePosition = async (boards, userId) => {
	try {
		const reversedBoard = boards.reverse();

		const updateQueries = [];

		for (const key in reversedBoard) {
			const board = reversedBoard[key];
			updateQueries.push({
				updateOne: {
					filter: { _id: board.id },
					update: { position: key },
				},
			});
		}

		await Board.bulkWrite(updateQueries);

		const res = await Board.find({ user: userId }).sort('-position');

		return { boards: res };
	} catch (error) {
		throw new Error(error.message);
	}
}

const updateFavouritePosition = async (boards, userId) => {
	try {
		const reversedBoard = boards.reverse();

		const updateQueries = [];

		for (const key in reversedBoard) {
			const board = reversedBoard[key];
			updateQueries.push({
				updateOne: {
					filter: { _id: board.id },
					update: { favouritePosition: key },
				},
			});
		}

		await Board.bulkWrite(updateQueries);

		const res = await Board.find({ user: userId, favourite: true }).sort('-favouritePosition');

		return { boards: res };
	} catch (error) {
		throw new Error(error.message);
	}
}

const updateBoard = async ({ boardId, title, description, favourite, icon }, userId) => {
	try {
		const currentBoard = await Board.findById(boardId);
		if (!currentBoard) throw new Error('Board not found');

		const data = {};
		if (title) data.title = title;
		if (description) data.description = description;
		if (favourite !== undefined) data.favourite = favourite;
		if (icon) data.icon = icon;

		if (favourite !== undefined && currentBoard.favourite !== favourite) {
			const favourites = await Board.find({
				user: userId,
				favourite: true,
				_id: { $ne: boardId },
			}).sort('favouritePosition');

			if (favourite) {
				data.favouritePosition = favourites.length > 0 ? favourites.length : 0;
			} else {
				const updateQueries = [];
				for (const key in favourites) {
					const element = favourites[key];
					updateQueries.push({
						updateOne: {
							filter: { _id: element._id },
							update: { favouritePosition: key }
						}
					})
					await Board.bulkWrite(updateQueries);
				}
			}
		}

		const board = await Board.findByIdAndUpdate(
			boardId,
			{ $set: data }
		)

		return { board };
	} catch (error) {
		throw new Error(error.message);
	}
}

const deleteBoard = async (boardId, userId) => {
	try {
		const sections = await Section.find({ board: boardId });
		for (const section of sections) {
			await Task.deleteMany({ section: section.id });
		}
		await Section.deleteMany({ board: boardId });

		const currentBoard = await Board.findById(boardId);

		if (currentBoard.favourite) {
			const favourites = await Board.find({
				user: userId,
				favourite: true,
				_id: { $ne: boardId },
			}).sort('favouritePosition');

			const updateQueries = [];
			for (const key in favourites) {
				const element = favourites[key];
				updateQueries.push({
					updateOne: {
						filter: { _id: element._id },
						update: { favouritePosition: key }
					}
				})
				await Board.bulkWrite(updateQueries);
			}
		}

		await Board.deleteOne({ _id: boardId });

		const boards = await Board.find({ user: userId }).sort('position');

		const updateQueries = [];
		for (const key in boards) {
			const board = boards[key];
			updateQueries.push({
				updateOne: {
					filter: { _id: board.id },
					update: { position: key },
				},
			});
		}

		await Board.bulkWrite(updateQueries);
	} catch (error) {
		throw new Error(error.message);
	}
}

module.exports = {
	addBoard,
	getAllByUserId,
	getAllFavouriteByUserId,
	getBoardById,
	updatePosition,
	updateFavouritePosition,
	updateBoard,
	deleteBoard,
}