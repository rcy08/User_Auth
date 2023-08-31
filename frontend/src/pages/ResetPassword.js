import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {

    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState('');
    const navigate = useNavigate();
    const token = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setStatus('');

        if (password === confirmpassword) {

            const response = await fetch(`https://blueknova-server.cyclic.app/reset-password/${token.resetToken}`, {
                method: 'PUT',
                headers: { 'Content-Type' : 'application/json' },
                body: JSON.stringify({ password })
            });

            const data = await response.json();

            if (data.error) {
                setStatus(data.error);
            }
            if (data.success) {
                setStatus(data.data);
                navigate('/');
                alert('Password Reset Success');
            }
        }

        else {
            setStatus(`Passwords don't match`);
        }
    }

    return (
        
        <div className="container">
            <div className="reset-password">
                <h3>Reset Password</h3>
                <form onSubmit={handleSubmit}>

                   <div class="enter"> <label className="label"> Enter  Password :</label>
                    <input 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    /><br></br>
                    </div>
                    <div class="confirm">
                    <label className="label"> Confirm Password: </label>
                    <input 
                        type="password"
                        value={confirmpassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    </div>
                    <button class="btn-login"> Submit </button>

                </form>

                <h2> {status} </h2>
            </div>
        </div>
    );
}
 
export default ResetPassword;