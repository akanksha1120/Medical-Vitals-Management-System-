const userModel = require('../models/user');

exports.createUser = (user) => {
    return new Promise((resolve, reject) => {
        new userModel(user)
        .save()
        .then(data => {
            resolve(data)
        })
        .catch(err => {
            reject(err);
        })
    })
}