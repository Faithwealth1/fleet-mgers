import React, { useState } from 'react';
import '../../stylings/styles.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, deleteUser, sendEmailVerification } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
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
      case 'auth/email-already-in-use':
        return 'That email is already in use.';
      case 'auth/invalid-email':
        return 'Enter a valid email address.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/operation-not-allowed':
        return 'Email/Password sign-in is not enabled in Firebase Authentication.';
      case 'auth/invalid-api-key':
      case 'auth/api-key-not-valid':
        return 'Firebase API key is invalid. Check your .env values and restart dev server.';
      case 'auth/app-not-authorized':
        return 'This domain is not authorized for Firebase Auth. Add localhost to authorized domains.';
      case 'auth/network-request-failed':
        return 'Network error. Check your internet connection.';
      case 'permission-denied':
        return 'Firestore denied write to admins. Update Firestore rules for authenticated users.';
      case 'failed-precondition':
        return 'Firestore is not initialized yet. Create Firestore Database in Firebase console.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Wait a moment and try again.';
      default:
        return 'Error during signup. Check console for details.';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const { uid } = credential.user;
      await credential.user.getIdToken(true);

      try {
        await setDoc(doc(db, 'admins', uid), {
          username: username.trim(),
          email: email.trim().toLowerCase(),
          phoneNumber: phoneNumber.trim(),
          verified: false,
          role: 'admin',
          created_at: serverTimestamp(),
        });
      } catch (firestoreError) {
        try {
          await deleteUser(credential.user);
        } catch (rollbackError) {
          console.error('Rollback user deletion failed:', rollbackError);
        }
        throw firestoreError;
      }

      try {
        await sendEmailVerification(credential.user);
        const sentEmail = credential.user.email || email.trim().toLowerCase();
        setSuccessMessage(`Check your spam folder for email verification. Email sent to ${sentEmail}.`);
        toast.success(`Email sent to ${sentEmail}. Check your spam folder for email verification.`, {
          position: 'top-right',
          autoClose: 1800,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'light',
        });
      } catch (emailError) {
        console.error('Email verification send failed:', emailError);
        setSuccessMessage('Signup successful. Could not send email now. Use "Resend Verification Email" on next page.');
      }

      setErrorMessage('');

      setTimeout(() => {
        navigate('/verification');
      }, 1000);
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
      console.error('Firebase signup error code:', error?.code, 'message:', error?.message);
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
