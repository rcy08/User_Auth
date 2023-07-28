import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

const AccountDetails = () => {

    const [error, setError] = useState('');
    const [user, setUser] = useState({});
    const navigate = useNavigate();

    useEffect(() => {

      const fetchPrivateData = async () => {

        const token = localStorage.getItem('userToken');

        if(token.startsWith('Bearer')){

          setError('');
          setUser('');

          const response = await fetch('https://user-auth-fyxk.onrender.com/account-details', {
            method: 'GET',
            headers: {
              'Content-Type' : 'application/json',
              Authorization: `Bearer ${localStorage.getItem('userToken')}`
            }
          });

          const data = await response.json();

          if (data.error) {
            // setError(data.error);
          }
  
          if (data.success) {
            setUser(data.user);
          }

        }
        
        else{
          const auth = token.split(' ')[1];
          setUser(jwt_decode(auth));

        }



      };


      fetchPrivateData();

    }, []);


    const handleDelete = async () => {

      const response  = await fetch('https://user-auth-fyxk.onrender.com/account-details', {
        method: 'DELETE',
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify({ email: user.email })
      });

      const data = await response.json();

      if (data.error) {
        setError('Account not deleted');
      }
      else {
        localStorage.removeItem('userToken');
        navigate('/');
      }
    }

    const handleLogout = async () => {
      
      localStorage.removeItem('userToken');
      navigate('/');
      
    }

    const getLogs = async () => {
    }

    return (
      <div>
        
          
          {user && (
            <div className="Acc_info">
              <h1> Hello, {user.name} </h1>
              <h2> Your email: {user.email} </h2>
              <img src={user.picture} alt="Your Profile Picture" height='50px' width='50px'  />
              { user.logs.forEach(element => {
                <h2> element </h2>
              }) }
              <button onClick={handleLogout} className="btn-logout"> Logout </button>
              <button onClick={handleDelete} className='btn-delete'> Delete Account </button>
            </div>
          )}

          {user.role === 'Admin' && {getLogs} 
            // <button onClick={getLogs}> User Logs </button>
          }

          {error && <h2> {error} </h2>}

       
      </div>
    );
}
 
export default AccountDetails;