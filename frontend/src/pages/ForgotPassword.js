import { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {

    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('https://user-auth-fyxk.onrender.com/forgot-password', {
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
                <form id='forget-password' onSubmit={handleSubmit}>
                    <label className="label"> Enter your Email: </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button className='btn-login'> Submit </button>
                </form>
                <h4> {status} </h4>
                <h4> <Link to='/' className='links'> Home </Link> </h4>
            </div>
        </div>
    );
}

export default ForgotPassword;