const Section = require('../models/section');
const Task = require('../models/task');

const getSectionsByBoardId = async (boardId) => {
	try {
		const sections = await Section.find({ board: boardId });
		for (const section of sections) {
			const tasks = await Task.find({ section: section.id });
			section._doc.tasks = tasks;
		}

		return { sections };
	} catch (error) {
		throw new Error(error.message);
	}
}

const createSection = async (boardId) => {
	try {
		const section = await Section.create({ board: boardId });
		section._doc.tasks = [];

		return { section }
	} catch (error) {
		throw new Error(error.message);
	}
}

const updateSection = async (sectionId, { title }) => {
	try {
		const section = await Section.findByIdAndUpdate(
			sectionId,
			{ $set: { title } }
		)
		const tasks = await Task.find({ section: sectionId });
		section._doc.tasks = tasks;

		return { section }
	} catch (error) {
		throw new Error(error.message);
	}
}

const deleteSection = async (sectionId) => {
	try {
		await Task.deleteMany({ section: sectionId });
		const section = await Section.findByIdAndDelete(sectionId);

		return { section }
	} catch (error) {
		throw new Error(error.message);
	}
}

module.exports = {
	getSectionsByBoardId,
	createSection,
	updateSection,
	deleteSection,
}