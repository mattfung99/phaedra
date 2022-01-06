import { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { UserContext } from '../hooks/UserContext';

const PublicRoute = ({ component: Component, ...rest }) => {
  const userContext = useContext(UserContext);
  return (
    <Route
      {...rest}
      render={(props) => {
        if (!userContext.isAuthenticated) {
          return <Component {...props}></Component>;
        }
        return <Redirect to={{ pathname: '/admin', state: { from: props.location } }} />;
      }}
    />
  );
};

export default PublicRoute;
