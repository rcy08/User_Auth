import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from 'react-icons-kit'
import { eyeBlocked } from 'react-icons-kit/icomoon/eyeBlocked'
import { eye } from 'react-icons-kit/icomoon/eye'
import ReCAPTCHA from "react-google-recaptcha";
const zxcvbn = require("zxcvbn")
// import * as  zxcvbn  from "zxcvbn";

const Signup = () => {

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmpassword, setConfirmpassword] = useState('');
	const [errors, setErrors] = useState({});
	const navigate = useNavigate();
    const [recaptchaResponse, setRecaptchaResponse] = useState('');

	const [score, setScore] = useState("null");

    const testStrengthPassword = () => {
        // we will get score property from zxcvbn
        if (password !== "") {
            let pass = zxcvbn(password)
            setScore(pass.score)
        } else {
            setScore("null")
        }
    }
	

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		if (password === confirmpassword && password.length >= 6 && name.length >= 4) {
			const response = await fetch('https://user-auth-fyxk.onrender.com/signup', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ 
					name,
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
			if (name.length < 4) {
				setErrors({
					username: 'Minimum length of Username is 4 characters',
				});
			}
			else if (password.length < 6) {
				setErrors({
					password: 'Minimum length of password is 6 characters',
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

	const p = document.querySelector('.strength-password');

    useEffect(() => {
        switch (score) {
            case 0:
                p.innerHTML = 'Very Weak';
				p.style.color = 'red';
				p.style.fontWeight = 'bold';
                break;
				
			case 1:
				p.innerHTML = 'Weak';
				p.style.color = 'red';
				p.style.fontWeight = 'bold';
				break;
					
			case 2:
				p.innerHTML = 'Moderate';
				p.style.color = 'yellow';
				p.style.fontWeight = 'bold';
                break;
				
			case 3:
				p.innerHTML = 'Strong';
				p.style.color = 'green';
				p.style.fontWeight = 'bold';
                break;
			
			case 4:
				p.innerHTML = 'Very Strong';
				p.style.color = 'green';
				p.style.fontWeight = 'bold';
            break;

            default:
                break;
        }
    }, [score]);

	return (
		
		<div className="container">
			<div className="signup-box">
				<h1 className="h-primary"> Signup Form </h1>

				<form onSubmit={handleSubmit}>


					<label className="label"> Username: </label>
					<div className="input-field">
						<input type="text" name="name" id="name" placeholder="Username"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</div>
					<div className="username-error"> {errors.username} </div>

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
                            onChange={(e) => {
                                setPassword(e.target.value)
                                { testStrengthPassword(e.target.value) };
                            }}
                        // onChange={testStrengthPassword}
                        />
                        <span><Icon icon={icon} size={22} onClick={handleEye} /></span>
                    </div>
                    <div className="password-error"> {errors.password} </div>
                    <p className='strength-password'></p>


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

				<h4 className="text"> Already have an account? <Link to='/login' className='links'> Sign In </Link> </h4>
				<h4> <Link to='/' className='links'> Home </Link> </h4>

			</div>
		</div>
	);

};

export default Signup;