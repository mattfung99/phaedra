import { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { UserContext } from '../hooks/UserContext';

const AdminRoute = ({ component: Component, ...rest }) => {
  const userContext = useContext(UserContext);
  console.log(userContext.isAuthenticated);
  return (
    <Route
      {...rest}
      render={(props) => {
        if (userContext.isAuthenticated) {
          return <Component {...props}></Component>;
        }
        return <Redirect to={{ pathname: '/', state: { from: props.location } }} />;
      }}
    />
  );
};

export default AdminRoute;
