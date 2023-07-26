import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import PrivateRoute from './utils/PrivateRoute';
import AccountDetails from './pages/AccountDetails';
import EmailVerification from './pages/EmailVerification';
import Error from './pages/Error';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  return (
    <div className="App">
      
      <GoogleOAuthProvider clientId='1062958522980-6k1ecibvfgtbgn783auu4qoton5htg51.apps.googleusercontent.com'>

        <BrowserRouter>
          <Routes>
            
            <Route element={<PrivateRoute />} > 
              <Route path='/account-details' element={<AccountDetails />} />
            </Route>
            
            <Route 
              path='/'
              element={<Home />}
            />
            <Route 
              path='/signup'
              element={<Signup />}
            />
            <Route 
              path='/login'
              element={<Login />}
            />
            <Route
              path='/forgot-password'
              element={<ForgotPassword />}
            />
            <Route
              path='/reset-password/:resetToken'
              element={<ResetPassword />}
            />
            <Route
              path='/email-verification/:token'
              element={<EmailVerification />}
            />
            <Route 
              path='*'
              element={<Error />}
            />
          </Routes>
        </BrowserRouter>

      </GoogleOAuthProvider>

    </div>
  );
}

export default App;
