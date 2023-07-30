import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {

    const [isLogin, setIsLogin] = useState(false);

    useEffect(() => {

      setIsLogin( localStorage.getItem('userToken') ? true : false);

    }, [])

    return (
      <div className="container">
        <div className="box">

          { isLogin &&  <h1 className="home"> <Link to='/account-details' className='links'> Your Account </Link> </h1> }

          { !isLogin && <div>
            <h1 className="home"> <Link to="/login" className='links'> SignIn </Link> </h1>
            <h1 className="home"> <Link to="/signup" className='links'> SignUp </Link> </h1>
          </div> }
          
        </div>
      </div>
    );
}
 
export default Home;