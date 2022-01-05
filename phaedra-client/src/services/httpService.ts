import axios from 'axios';
axios.defaults.withCredentials = true;

const baseApiUrl = 'http://localhost:8080';

const get = (url: string, config: object = {}) => {
  return axios.get(baseApiUrl + url, config);
};

const post = (url: string, obj: any, config: object = {}) => {
  return axios.post(baseApiUrl + url, obj, config);
};

const put = (url: string, obj: any, config: object = {}) => {
  return axios.put(baseApiUrl + url, obj, config);
};

const patch = (url: string, obj: any, config: object = {}) => {
  return axios.patch(baseApiUrl + url, obj, config);
};

const del = (url: string, config: object = {}) => {
  return axios.delete(baseApiUrl + url, config);
};

export default { get, post, put, patch, del };
