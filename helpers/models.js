const models = {
    create_user: {
        username: 'string',
        age: 'number',
        gender: 'string'
    },
    insert_vital: {
        username: 'string',
        vitalID: 'string',
        value: 'number',
        timestamp: 'string'
    },
    get_vitals: {
        username: 'string',
        period: 'object'
    },
    delete_vitals: {
        username: 'string',
        vitalID: 'string',
        timestamp: 'string'
    },
    aggregate: {
        username: 'string',
        vital_ids: 'object',
        start_timestamp: 'string',
        end_timestamp: 'string'
    },
    population_insight: {
        username: 'string',
        vital_id: 'string',
        start_timestamp: 'string',
        end_timestamp: 'string'
    }
}

module.exports = models;