import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from 'react-icons-kit'
import { eyeBlocked } from 'react-icons-kit/icomoon/eyeBlocked'
import { eye } from 'react-icons-kit/icomoon/eye'
import ReCAPTCHA from "react-google-recaptcha";


const Signup = () => {

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmpassword, setConfirmpassword] = useState('');
	const [errors, setErrors] = useState({});
	const navigate = useNavigate();
    const [recaptchaResponse, setRecaptchaResponse] = useState('');
	

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		if (password === confirmpassword && password !== '') {
			const response = await fetch('/signup', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ 
                    email, 
                    password,
                    recaptchaResponse,
                }),
			});

			const data = await response.json();
            
			if (data.errors) {
				setErrors(data.errors);
			}
			if (data.user) {
				setEmail('');
				setPassword('');
				setConfirmpassword('');
				setErrors({});
				console.log(data.user);

				navigate('/');
				alert('Please verify your email id through the link sent on your email');
			}

		}
		else {
			if (password.length < 6) {
				setErrors({
					password: 'Minimum length of password is 6 characters',
					confirmpassword: `Passwords don't match`,
				});
			}
			else {
				setErrors({
					confirmpassword: `Passwords don't match`,
				});
			}
		}
	}

	const [type, setType] = useState('password');
	const [icon, setIcon] = useState(eye);
	const handleEye = (e) => {
		if (icon === eye) {
			setType('text');
			setIcon(eyeBlocked);
		}
		else {
			setType('password');
			setIcon(eye);
		}
	}

	return (
		<div className="container">
			<div className="signup-box">
				<h1 className="h-primary"> Signup Form </h1>

				<form onSubmit={handleSubmit}>

					<label className="label"> Email: </label>
					<div className="input-field">
						<input type="email" name="email" id="email" placeholder="Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					{/* <p> {email} </p> */}

					<div className="email-error"> {errors.email} </div>


					<label className="label"> Password: </label>
					<div className="input-field">
						<input type={type} name="password" id="password" placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<span><Icon icon={icon} size={22} onClick={handleEye} /></span>
					</div>
					<div className="password-error"> {errors.password} </div>


					<label className="label"> Confirm Password: </label>
					<div className="input-field">
						<input type={type} name="confirmpassword" id="confirmpassword" placeholder="Confirm Password"
							value={confirmpassword}
							onChange={(e) => setConfirmpassword(e.target.value)}
						/>
						<span><Icon icon={icon} size={22} onClick={handleEye} /></span>
					</div>
					<div className="confirmpassword-error"> {errors.confirmpassword} </div>

					<div>
						<ReCAPTCHA
							sitekey="6LeW2FInAAAAAE-Ea463WbLM_vIssAWkd_zBeQI1"
							onChange={(response) => setRecaptchaResponse(response)}
						/>
					</div>
					<div className="password-error"> {errors.captcha} </div>

					<button className="btn-signup"> Signup </button>

				</form>

				<h4 className="text"> Already have an account? <Link to='/login' className='links'> Login </Link> </h4>
				<h4> <Link to='/' className='links'> Home </Link> </h4>

			</div>
		</div>
	);

};

export default Signup;