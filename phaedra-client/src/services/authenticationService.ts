import { UserCredentials } from '../models/user';
import httpService from './httpService';

const authenticationService = {
  login: async (user: UserCredentials): Promise<any> => {
    try {
      const res = await httpService.post('/api/v1/auth/login', user);
      return res.data;
    } catch (error: any) {
      if (error.response) {
        return error.response.data;
      }
    }
  },

  logout: async (): Promise<any> => {
    const res = await httpService.get('/api/v1/auth/logout');
    return res.data;
  },

  isAuthenticated: async (): Promise<any> => {
    try {
      const res = await httpService.get('/api/v1/auth/authenticate');
      return res.data;
    } catch (error) {
      return { isAuthenticated: false, user: null };
    }
  }
};

export default authenticationService;
