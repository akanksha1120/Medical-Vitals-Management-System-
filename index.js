const express = require('express');
const mongoose = require('mongoose');
const Request = require('./helpers/request');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 5000;
const DB_URI = process.env.DB_URI;
const DB_NAME = process.env.DB_NAME || 'test';

app.use(express.json());

app.post('/', (req, res) => {
	const queries = [];
	try {
		for(let request of req.body) {
			queries.push(new Request(request).executeQuery());
		}
	}
	catch(err){
		return res.status(400).json({status: 'failure', message: err.message});
	}
	const quriesPoll = setInterval(() => {
		console.log('queries', queries);
	}, 1000);
	Promise.all(queries)
	.then(result => {
		clearInterval(quriesPoll);
		return res.status(200).json(result);
	})
	.catch(err => {
		clearInterval(quriesPoll);
		return res.status(400).json(err);
	})
})

mongoose.connect(DB_URI, {
	dbName: DB_NAME,
})
	.then(() => console.log('MongoDB connected'))
	.catch(err => console.log(err));

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});