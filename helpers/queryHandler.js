const Request = require('./request');

const queryHandler = async (data) => {
	const queries = [];
	for(let request of data) {
		const query = new Request(request);
		queries.push(await query.executeQuery());
	}

	return queries;
}

module.exports = queryHandler;