import { UserCredentials } from '../models/user';
import httpService from './httpService';

const authenticationService = {
  login: (user: UserCredentials): Promise<any> => {
    return httpService
      .post('/api/v1/auth/login', user)
      .then((res) => res.data)
      .catch((error) => {
        if (error.response) {
          return error.response.data;
        }
      });
  },

  logout: (): Promise<any> => {
    return httpService.get('/api/v1/auth/logout').then((res) => res.data);
  },

  isAuthenticated: (): Promise<any> => {
    return httpService
      .get('/api/v1/auth/authenticate')
      .then((res) => res.data)
      .catch((error) => {
        return { isAuthenticated: false, user: null };
      });
  }
};

export default authenticationService;
