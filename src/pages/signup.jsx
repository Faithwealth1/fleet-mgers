import React, { useState } from 'react';
import '../../stylings/styles.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Link } from 'react-router-dom';
import Loader from './tools/loader';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'username':
        setUsername(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'phoneNumber':
        setPhoneNumber(value);
        break;
      default:
        break;
    }
  };

  const getSignupErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'email-already-in-use':
        return 'That email is already in use.';
      case 'invalid-email':
        return 'Enter a valid email address.';
      case 'weak-password':
        return 'Password should be at least 6 characters.';
      case 'operation-not-allowed':
        return 'Email/Password sign-in is not enabled.';
      case 'invalid-api-key':
      case 'api-key-not-valid':
        return 'API key is invalid. Check your configuration.';
      case 'app-not-authorized':
        return 'This domain is not authorized. Add localhost to authorized domains.';
      case 'network-request-failed':
        return 'Network error. Check your internet connection.';
      case 'permission-denied':
        return 'Database denied write access. Update permissions.';
      case 'failed-precondition':
        return 'Database is not initialized yet. Create database in console.';
      case 'too-many-requests':
        return 'Too many attempts. Wait a moment and try again.';
      default:
        return 'Error during form submission. Check console for details.';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Frontend-only validation (no backend)
      if (!email || !password || !username) {
        const error = new Error('Please fill all required fields');
        error.code = 'invalid-email';
        throw error;
      }

      if (password.length < 6) {
        const error = new Error('Password should be at least 6 characters');
        error.code = 'weak-password';
        throw error;
      }

      // Show success message for demo (no actual signup)
      setSuccessMessage('Form submitted successfully!');
      toast.success('Form submitted!', {
        position: 'top-right',
        autoClose: 1800,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light',
      });

      setErrorMessage('');

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error(error);
      const message = getSignupErrorMessage(error.code);
      setErrorMessage(message);
      setSuccessMessage('');
      toast.error(message, {
        position: 'top-right',
        autoClose: 1700,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light',
      });
      console.error('Signup error code:', error?.code, 'message:', error?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      {loading ? (
        <Loader />
      ) : (
        <div>
          {/* Add any additional content you want to show when data is loaded */}
        </div>
      )}
      <div className="signup-container">
        <div className="inner">
          <h2>Admin Signup</h2>
          {errorMessage && <div className="error">{errorMessage}</div>}
          {successMessage && <div className="success">{successMessage}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username:</label>
              <input type="text" name="username" value={username} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input type="email" name="email" value={email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input type="password" name="password" value={password} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Phone Number:</label>
              <input type="tel" name="phoneNumber" value={phoneNumber} onChange={handleChange} required />
            </div>
            <button type="submit">Sign Up</button>
          </form>
          <span>
            <Link to="/login">login</Link> your account
          </span>
        </div>
      </div>
    </>
  );
};

export default Signup;
