import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from 'react-icons-kit';
import { eyeBlocked } from 'react-icons-kit/icomoon/eyeBlocked';
import { eye } from 'react-icons-kit/icomoon/eye';
import jwt_decode from 'jwt-decode';

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.errors) {
          setErrors(data.errors);
        }
        if (data.user) {
          setEmail('');
          setPassword('');
          setErrors({});
          console.log(data.user);

          localStorage.setItem(`userToken`, `Bearer ${data.token}`);
          navigate('/');
        }
    }

  const [type, setType] = useState('password');
  const [icon, setIcon] = useState(eye);
  const handleEye = (e) => {
    if(icon === eye){
        setType('text');
        setIcon(eyeBlocked);
    }
    else{
        setType('password');
        setIcon(eye);
    }
  }
  
  const handleCallbackResponse = async (response) => {
    
    /* global google */

    // console.log(response);

    // console.log('Encoded JWT ID token: ' + response.credential);

    var userObject = jwt_decode(response.credential);

    console.log(userObject);

    console.log(userObject.email);

    const email = userObject.email;
    const name = userObject.name;
    const picture = userObject.picture;

    await fetch('/google-accounts', {
      method: 'POST',
      headers: { 'Content-Type' : 'application/json' },
      body: JSON.stringify({ email, name, picture })
    });

    localStorage.setItem('userToken', `Google ${response.credential}`);
    navigate('/');
  }
  
  useEffect(() => {
    google.accounts.id.initialize({
      client_id: '1062958522980-6k1ecibvfgtbgn783auu4qoton5htg51.apps.googleusercontent.com',
      callback: handleCallbackResponse
    });

    google.accounts.id.renderButton(
      document.getElementById('signInDiv'),
      { theme: 'outline', size: 'large', shape: 'rectangular'}
    );
  }, []);


    return (

      <div className="container">
        <div className="login-box">
          <h1 className="h-primary"> Sign In Form </h1>
          <form onSubmit={handleSubmit}>

            <label className="label"> Email: </label>
            <div className="input-field">
            <input type="email" name="email" id="email" placeholder="Email"
              value = {email}
              onChange={(e) => setEmail(e.target.value)}
            />
            </div>
            <div className="email-error"> {errors.email} </div>
            

            <label className="label"> Password: </label>
            <div className="input-field">
              <input type={type} name="password" id="password" placeholder="Password" 
                value = {password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span><Icon icon={icon} size={22} onClick={handleEye}/></span>
            </div>
            <div className="password-error"> {errors.password} </div>


            <Link to="/forgot-password" className='links'> Forgot Password? </Link>

            <button className="btn-login"> Sign In </button>

          </form>

          <div id="signInDiv">
            
          </div>

          <h4 className="text"> Don't have an account? <Link to='/signup' className='links'> Sign Up </Link> </h4>
          <h4> <Link to='/' className='links'> Home </Link> </h4>
        </div>
      </div>
    );
}

export default Login;