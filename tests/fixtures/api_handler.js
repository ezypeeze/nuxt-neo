import axios from 'axios';

const API = axios.create({
    baseURL: `http://${process.env.HOST}:${process.env.PORT}/api`,
    timeout: 10000
});

export default (path, verb, {query, body}) => {
    return API.request({
        url: path,
        method: verb.toLowerCase(),
        data: body,
        params: query
    }).then(({data}) => data);
};
