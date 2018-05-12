const axios   = require('axios');

const UserAPI = axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com/users'
});

module.exports = class {

    fetchAll() {
        return UserAPI.get('/').then(({data}) => data);
    }

};
