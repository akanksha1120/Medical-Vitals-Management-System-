const userController = require('../controllers/user');
const vitalsController = require('../controllers/vitals');

class Request {
    static models = require('./models');

    constructor(request) {
        this.query=this.__validate(request);
        this.command = request.command;
    }
    __validate(request) {
        if(!request.command) {
            throw new Error('Invalid request body');
        }
        if(!Request.models[request.command]) {
            throw new Error('Invalid request command');
        }
        const model = Request.models[request.command];
        const query = {}
        for(let key in model) {
            if(!request[key]) {
                throw new Error(`expected ${key} in request body`);
            }
            if(typeof request[key] !== model[key]) {
                throw new Error(`expected ${model[key]} for ${key} but got ${typeof request[key]}`);
            }
            query[key] = request[key];
        }

        return query;
    }

    executeQuery() {
        switch(this.command) {
            case 'create_user':
                return this.__createUser();
            case 'insert_vital':
                return this.__insertVital();
            case 'get_vitals':
                return this.__getVitals();
            case 'delete_vitals':
                return this.__deleteVitals();
            case 'aggregate':
                return this.__aggregate();
            case 'population_insight':
                return this.__populationInsight();
        }
    }

    __createUser() {
        return new Promise((resolve, reject) => {
            userController.createUser(this.query)
            .then((data) => {
                resolve(this.__successResponse(`User ${data.username} created successfully`))
            })
            .catch(err => {
                if(err.code === 11000) {
                    resolve(this.__failureResponse('Username already exists'));
                }
            })
        })
    }
    __insertVital() {
        return new Promise((resolve, reject) => {
            vitalsController.insertVital(this.query)
            .then((data) => {
                resolve(this.__successResponse(`Vitals inserted successfully for ${data.username}`))
            })
            .catch(err => {
                resolve(this.__failureResponse('Username does not exist'));
            })
        })
    }
    __getVitals() {
        return new Promise((resolve, reject) => {
            vitalsController.getVitalsInTimeRange(this.query.username, this.query.period)
            .then((data) => {
                resolve(this.__successResponse(`Vitals fetched successfully for ${this.query.username}`, data))
            })
            .catch(err => {
                resolve(this.__failureResponse('Username does not exist'));
            })
        })
    }
    __deleteVitals() {
        return new Promise((resolve, reject) => {
            vitalsController.deleteVitalsInTimeRange(this.query.username, this.query.timestamp)
            .then((data) => {
                resolve(this.__successResponse(`Vitals deleted successfully for ${this.query.username}`))
            })
            .catch(err => {
                resolve(this.__failureResponse('Username does not exist'));
            })
        })
    }
    __aggregate() {
        return new Promise((resolve, reject) => {
            vitalsController.aggregate(this.query.username, this.query.vital_ids, this.query.start_timestamp, this.query.end_timestamp)
            .then((data) => {
                resolve(this.__successResponse(`Aggregate fetched successfully`, data))
            })
            .catch(err => {
                resolve(this.__failureResponse('Username does not exist'));
            })
        })
    }
    __populationInsight() {
        return new Promise((resolve, reject) => {
            vitalsController.findRank(this.query.username, this.query.vital_id, this.query.start_timestamp, this.query.end_timestamp)
            .then((data) => {
                resolve(this.__successResponse(`Population insight fetched successfully`, data))
            })
            .catch(err => {
                resolve(this.__failureResponse('Username does not exist'));
            })
        })
    }

    __successResponse(message, data) {
        //non data queries
        const nonDataQueries = ['create_user', 'insert_vital', 'delete_vitals'];
        //data queries
        const dataQueries = ['get_vitals', 'aggregate', 'population_insight'];
        
        if(nonDataQueries.includes(this.command)) {
            return {
                status: 'success',
                message: message
            }
        }
        if(dataQueries.includes(this.command)) {
            return {
                status: 'success',
                message: message,
                data: data
            }
        }
        return {
            status: 'failure',
            message: `${this.command} is not a valid command`,
        }
    }
    __failureResponse(message) {
        return {
            status: 'failure',
            command: this.command,
            message: message,
        }
    }
}

module.exports = Request;