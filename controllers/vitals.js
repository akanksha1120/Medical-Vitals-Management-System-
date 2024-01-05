const vitalsModel = require('../models/vitals');

exports.insertVital = (vital) => {
    return new Promise((resolve, reject) => {
        new vitalsModel(vital)
        .save()
        .then(data => {
            resolve(data)
        })
        .catch(err => {
            reject(err);
        })
    })
}

exports.getVitalsInTimeRange = (username, period) => {
    return new Promise((resolve, reject) => {
        vitalsModel.find({
            username: username,
            timestamp: {
                $gte: period[0],
                $lte: period[1]
            }
        })
        .then(data => {
            data = data.map(vital => {
                return {
                    vitalID: vital.vitalID,
                    value: vital.value,
                    timestamp: vital.timestamp
                }
            })
            resolve(data);
        })
        .catch(err => {
            reject(err);
        })
    })
}

exports.deleteVitalsInTimeRange = (username, timestamp) => {
    return new Promise((resolve, reject) => {
        vitalsModel.deleteMany({
            username: username,
            timestamp: timestamp
        })
        .then(data => {
            resolve(data);
        })
        .catch(err => {
            reject(err);
        })
    })
}

exports.aggregate = (username, vital_ids, start, end) => {
    return new Promise((resolve, reject) => {
        vitalsModel.aggregate([
            {
                $match: {
                    username: username,
                    vitalID: {
                        $in: vital_ids
                    },
                    timestamp: {
                        $gte: new Date(start),
                        $lte: new Date(end)
                    }
                }
            },
            {
                $group: {
                    _id: '$vitalID',
                    avg: {
                        $avg: '$value'
                    }
                }
            }
        ])
        .then(data => {
            arr={}
            for(let vital of data) {
                arr[vital['_id']] = vital.avg;
            }
            data={
                username: username,
                aggregates: arr,
                start_timestamp: start,
                end_timestamp: end
            }
            resolve(data);
        })
        .catch(err => {
            reject(err);
        })
    })
}

exports.findRank = (username, vitalID, start, end) => {
    return new Promise((resolve, reject) => {
        vitalsModel.aggregate([
            {
                $match: {
                    vitalID: vitalID,
                    timestamp: {
                        $gte: new Date(start),
                        $lte: new Date(end)
                    }
                }
            },
            {
                $group: {
                    _id: '$username',
                    avg: {
                        $avg: '$value'
                    }
                }
            },
            {
                $setWindowFields: {
                    sortBy: {
                        avg: 1
                    },
                    output: {
                        rank: {
                            $rank: {}
                        }
                    }
                }
            }
        ])
        .then(data => {
            const count = data.length;
            const rank = data.findIndex((item) => item._id === username);
            const percentile = (rank/count)*100;
            resolve({
                username: username,
                vital_id: vitalID,
                insight: `Your ${vitalID} is in the ${percentile} percentile`,
                start_timestamp: start,
                end_timestamp: end
            });
        })
        .catch(err => {
            reject(err);
        })
    })
}