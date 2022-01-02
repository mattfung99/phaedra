import { User } from 'db/models/user.model';

const isAuthenticated = (isAuthenticated: boolean, message: string) => {
  return { isAuthenticated: isAuthenticated, message: message };
};

const returnLoginAuthenticationStatus = (isAuthenticated: boolean, user: User, message: string) => {
  return { isAuthenticated: isAuthenticated, user: user, message: message };
};

const returnAuthenticationStatus = (isAuthenticated: boolean, user: any, message: string) => {
  return { isAuthenticated: isAuthenticated, user: user, message: message };
};

const authErrorMessage = (message: string, field: string) => {
  return { errors: [{ msg: message, param: field }] };
};

const authUserNotFound = isAuthenticated(false, 'User not found');
const authInvalidCredentials = isAuthenticated(false, 'Entered incorrect username or password');
const authServerError = isAuthenticated(false, 'Server error from login');
const authUserExists = authErrorMessage('This username is already being used', 'username');

export { authUserNotFound, authInvalidCredentials, authServerError, returnLoginAuthenticationStatus, returnAuthenticationStatus, authUserExists };
