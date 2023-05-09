import axios from 'axios';
import { URLAPIGENERAL } from '../../config';

const session = JSON.parse(window.localStorage.getItem('usuario'));
const token = session === null ? '' : session.token  
const axiosBirobid = axios.create({
  baseURL: URLAPIGENERAL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

axiosBirobid.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      window.location = '/401';
    }
    return Promise.reject(error);
  }
);

export default axiosBirobid;
