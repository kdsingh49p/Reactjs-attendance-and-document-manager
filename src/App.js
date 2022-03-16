import logo from './logo.svg';
import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import {NotificationContainer} from 'react-notifications';
import AdminLayout from "./Layout/AdminLayout";
import AdminLogin from './components/common/AdminLogin';
import SignupPage from './components/common/SignupPage';
import SignupConfirmation from './components/common/SignupConfirmation';


import { Provider } from 'react-redux';
import { store } from '../src/helpers/store';
import { PrivateRoute } from './components/common/PrivateRoute/PrivateRoute';
import Loader from './components/Loader';
import NotFound from './components/NotFound/index';
import VerifyEmail from './components/common/VerifyEmail';
import DocumentLayout from './Layout/DocumentLayout';
import ShareablePage from './components/documents/ShareablePage/ShareablePage';

 function App() {
  return (
      <Router>
        <Provider store={store}>
        <div>
        <Loader></Loader>
          <Switch>
            
            <PrivateRoute path="/common">
              <AdminLayout />
            </PrivateRoute>
            <Route path="/shareable/:id">
              <ShareablePage />
            </Route>
            <PrivateRoute path="/documents">
              <DocumentLayout />
            </PrivateRoute>
            <Route path="/admin-login">
              <AdminLogin />
            </Route>
            <Route path="/signup">
              <SignupPage />
            </Route>
            <Route path="/signup-confirmation">
              <SignupConfirmation />
            </Route>
            <Route path="/verify_email/:id">
              <VerifyEmail />
          </Route>
            

            <Route path="/" exact>
              <AdminLogin />
            </Route>
            <Route>
              <NotFound />
            </Route>
          </Switch>
        </div>
        <NotificationContainer />
        </Provider>
      </Router>
  );
}

export default App;
