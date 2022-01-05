import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Public/Home';
import About from './pages/Public/About';
import Blog from './pages/Public/Blog';
import Contact from './pages/Public/Contact';
import Login from './pages/Public/Login';
import Error404 from './pages/Public/Error404';
import Account from './pages/Admin/Account';
import ViewPosts from './pages/Admin/ViewPosts';
import PublicRoute from './hocs/PublicRoute';
import PrivateRoute from './hocs/PrivateRoute';

const App = () => {
  return (
    <div>
      <Router>
        <ToastContainer />
        <Switch>
          <PublicRoute exact path="/" component={Home} />
          <PublicRoute exact path="/about" component={About} />
          <PublicRoute exact path="/blog" component={Blog} />
          <PublicRoute exact path="/contact" component={Contact} />
          <PublicRoute exact path="/login" component={Login} />
          <PrivateRoute exact path="/admin/account" component={Account} />
          <PrivateRoute exact path="/posts" component={ViewPosts} />
          {/* <Route component={Error404} /> */}
        </Switch>
      </Router>
    </div>
  );
};

export default App;
