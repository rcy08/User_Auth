import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const EmailVerification = () => {

    const { token } = useParams();
    const [status, setStatus] = useState('');
    const navigate = useNavigate();

    useEffect(() => {

        const Verify = async () => {

            const response = await fetch(`https://user-auth-1mjc.onrender.com/email-verification/${token}`, {
                method: 'GET'
            });

            const data = await response.json();

            if (data.error) {
                setStatus(data.error);
            }
            if (data.success) {
                setStatus(data.data);
                navigate('/login');
                alert('Email Verified');
            }

        }

        Verify();

    }, []);


    return (
        <div className="container">
            <div className="box">
                <div className={status[0]==='I' ? 'ver-email' : 'status_none'}>
                    <h1> {status} </h1>
                    {/* <h1 className = {status[0] === 'I' ? 'status_error' : ''} > {status} </h1> */}
                    <Link to='/login' class='ver-links'> Go to Homepage </Link>
                </div>
            </div>
        </div>
    );
}
 
export default EmailVerification;