const express = require('express');
const mongoose = require('mongoose');
const app = express();
const queryHandler = require('./helpers/queryHandler');
require('dotenv').config();

const PORT = process.env.PORT || 5000;
const DB_URI = process.env.DB_URI;
const DB_NAME = process.env.DB_NAME || 'test';

app.use(express.json());


app.post('/', (req, res) => {
	queryHandler(req.body).then(queries => {
		return res.status(200).json(queries);
	}).catch(err => {	
		return res.status(500).json({error: err.message});
	});
});

mongoose.connect(DB_URI, {
	dbName: DB_NAME,
})
	.then(() => console.log('MongoDB connected'))
	.catch(err => console.log(err));

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});