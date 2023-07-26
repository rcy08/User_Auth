import { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {

    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json' },
            body: JSON.stringify({ email })
        });

        const data = await response.json();
        if (data.error) {
            setStatus(data.error);
        }
        if (data.success) {
            setStatus(data.data);
        }
    }

    return (
      <div className="container">
        <div className="forgot-password box">
          <form onSubmit={handleSubmit}> 
            <label className="label"> Enter your Email: </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className='btn-login'> Submit </button>
          </form>
          <h2> {status} </h2>
          <h2> <Link to='/' className='links'> Home </Link> </h2>
        </div>
      </div>
    );
}
 
export default ForgotPassword;