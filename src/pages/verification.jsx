import React, { useEffect, useState } from 'react';
import '../../stylings/styles.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, reload, sendEmailVerification } from 'firebase/auth';
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const Verification = () => {
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/login');
        return;
      }

      setUserEmail(user.email || '');
      if (user.emailVerified) {
        completeVerification(user.uid);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const completeVerification = async (uid) => {
    if (!uid) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, 'admins', uid), {
        verified: true,
        verified_at: serverTimestamp(),
      });

      setErrorMessage('');
      setSuccessMessage('Email verified successfully. Redirecting...');
      toast.success('Email verified successfully!', {
        position: 'top-right',
        autoClose: 1200,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light',
      });

      setTimeout(() => {
        navigate('/dashboard');
      }, 900);
    } catch (error) {
      console.error(error);
      const message = error?.message || 'Could not update verification status.';
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

  const handleResend = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setErrorMessage('Please login again to resend verification email.');
      return;
    }

    setLoading(true);
    try {
      await sendEmailVerification(currentUser);
      const sentEmail = currentUser.email || userEmail || 'your email';
      setErrorMessage('');
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
    } catch (error) {
      console.error(error);
      const message = error?.code === 'auth/too-many-requests'
        ? 'Too many requests. Wait a bit before resending.'
        : 'Could not resend verification email.';
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

  const handleCheckVerified = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setErrorMessage('Please login again.');
      return;
    }

    setLoading(true);
    try {
      await reload(currentUser);
      const refreshedUser = auth.currentUser;
      if (!refreshedUser?.emailVerified) {
        throw new Error('Email is not verified yet. Open your email and click the verification link first.');
      }

      await completeVerification(refreshedUser.uid);
    } catch (error) {
      console.error(error);
      const message = error?.message || 'Verification check failed.';
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="login-container">
        <div className="inner">
          <h2>Email Verification</h2>
          {userEmail ? (
            <p className="verification-text">
              Check your spam folder for email verification.
              <span className="verification-email-line">
                Email sent to: <strong>{userEmail}</strong>
              </span>
            </p>
          ) : null}
          {errorMessage && <div className="error">{errorMessage}</div>}
          {successMessage && <div className="success">{successMessage}</div>}

          <div className="form-group">
            <button type="button" onClick={handleResend} disabled={loading}>
              {loading ? 'Please wait...' : 'Resend Verification Email'}
            </button>
          </div>
          <div className="form-group">
            <button type="button" onClick={handleCheckVerified} disabled={loading}>
              {loading ? 'Checking...' : 'I Have Verified My Email'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Verification;
