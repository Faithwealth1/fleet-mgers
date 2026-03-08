import React, { useState } from 'react';
import '../../stylings/styles.css'; // Import your SCSS file
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles
import { useNavigate, Link } from 'react-router-dom';
import Loader from './tools/loader';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const getAuthErrorMessage = (code) => {
    switch (code) {
      case 'invalid-credential':
        return 'Please enter valid email and password.';
      case 'too-many-requests':
        return 'Too many attempts. Try again later.';
      case 'network-request-failed':
        return 'Network error. Check your internet connection.';
      case 'email-not-verified':
        return 'Email not verified. Please verify your email before login.';
      default:
        return 'Error during form submission.';
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Frontend-only validation (no backend)
      if (!email || !password) {
        const error = new Error('Please fill in all fields');
        error.code = 'invalid-credential';
        throw error;
      }

      // Show success message for demo (no actual authentication)
      setErrorMessage('');
      setSuccessMessage('Form submitted successfully!');
      toast.success('Form submitted!', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light',
      });

      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      console.error(error);
      const message = getAuthErrorMessage(error.code);
      setErrorMessage(message);
      setSuccessMessage('');
      toast.error(message, {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light',
      });
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <>
      <ToastContainer />
      {loading ? (
            <Loader/>
          ) : (
            <div>
              {/* Add any additional content you want to show when data is loaded */}
            </div>
          )}
      <div className="login-container">
        <div className="inner">
          <h2>Admin Login</h2>
          {errorMessage && <div className="error">{errorMessage}</div>}
          {successMessage && <div className="success">{successMessage}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email:</label>
              <input 
                type="email" 
                name="email" 
                value={email} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input 
                type="password" 
                name="password" 
                value={password} 
                onChange={handleChange} 
                required 
              />
            </div>
            <button type="submit">Log In</button>
          </form>
          <span><Link to="/signup">Signup</Link> for an account</span>
        </div>
      </div>
    </>
  );
};

export default Login;
