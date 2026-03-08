import React, { useEffect, useState } from 'react';
import '../../stylings/styles.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Verification = () => {
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Frontend-only verification (no backend)
    setUserEmail('user@example.com');
    
    // Auto-verify after 3 seconds for demo
    setTimeout(() => {
      completeVerification('mock-user-id');
    }, 3000);
  }, [navigate]);

  const completeVerification = async (uid) => {
    if (!uid) return;
    setLoading(true);
    try {
      // Mock verification completion
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
    setLoading(true);
    try {
      // Mock email resend
      const sentEmail = userEmail || 'your email';
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
      const message = error?.code === 'too-many-requests'
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
    setLoading(true);
    try {
      // Mock verification check
      const isVerified = true; // Simulate verified user
      if (!isVerified) {
        throw new Error('Email is not verified yet. Open your email and click the verification link first.');
      }

      await completeVerification('mock-admin-id');
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
