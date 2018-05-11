import axios from 'axios';

export default (path, verb, {query, body}, {prefix}) => {
    return axios({
        baseURL: `http://${process.env.HOST}:${process.env.PORT}${prefix || ''}`,
        timeout: 10000,
        url: path,
        method: verb.toLowerCase(),
        data: body,
        params: query
    }).then(({data}) => data);
};
