module.exports = {
	responseHelper: (data, message = '', success = true) => {
		return { success, data, message };
	}
}