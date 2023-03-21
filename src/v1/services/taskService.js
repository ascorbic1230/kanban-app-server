const Section = require('../models/section');
const Task = require('../models/task');

const getAllBySectionId = async (sectionId) => {
	try {
		const tasks = await Task.find({ section: sectionId }).sort('-position');

		return { tasks };
	} catch (error) {
		throw new Error(error.message);
	}
}

const createTask = async (sectionId) => {
	try {
		const section = await Section.findById(sectionId);
		const tasksCount = await Task.find({ section: sectionId }).count();

		const task = await Task.create({
			section: sectionId,
			position: tasksCount > 0 ? tasksCount : 0,
		});
		task._doc.section = section;

		return { task };
	} catch (error) {
		throw new Error(error.message);
	}
};

const updateTask = async (taskId, { title, content }) => {
	try {
		const data = {};
		if (title) data.title = title;
		if (content) data.content = content;

		const task = await Task.findByIdAndUpdate(
			taskId,
			{ $set: data },
		)

		return { task };
	} catch (error) {
		throw new Error(error.message);
	}
}

const updateTaskPosition = async (resourceList, resourceSectionId, destinationList, destinationSectionId) => {
	try {
		const reversedResourceList = resourceList.reverse();
		const reversedDestinationList = destinationList.reverse();

		const updateQueries = [];
		if (resourceSectionId !== destinationSectionId) {
			reversedResourceList.forEach((item, index) => {
				updateQueries.push({
					updateOne: {
						filter: { _id: item.id },
						update: {
							section: resourceSectionId,
							position: index
						},
					}
				})
			})
		}

		reversedDestinationList.forEach((item, index) => {
			updateQueries.push({
				updateOne: {
					filter: { _id: item.id },
					update: {
						section: destinationSectionId,
						position: index
					},
				}
			})
		})

		await Task.bulkWrite(updateQueries);
	} catch (error) {
		throw new Error(error.message);
	}
}

const deleteTask = async (taskId) => {
	try {
		const task = await Task.findByIdAndDelete(taskId);

		const tasks = await Task.find({ section: task.section }).sort('position');

		const updateQueries = tasks.map((task, index) => ({
			updateOne: {
				filter: { _id: task.id },
				update: { position: index }
			}
		}))

		await Task.bulkWrite(updateQueries);

		return { task };
	} catch (error) {
		throw new Error(error.message);
	}
}

module.exports = {
	getAllBySectionId,
	createTask,
	updateTask,
	updateTaskPosition,
	deleteTask,
}
