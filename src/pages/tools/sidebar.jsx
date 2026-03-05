import React, { Component } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import '../../../stylings/styles.css'; // Import the CSS file
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';

class Sidebar extends Component {
  render() {
    const { visible, navigate } = this.props; // Destructure the visible prop

    if (!visible) {
      return null; // Don't render anything if visible is false
    }

    const handleLogout = async () => {
      try {
        await signOut(auth);
      } catch (error) {
        console.error('Error during logout:', error);
      } finally {
        navigate('/login');
      }
    };

    return (
      <div className='sideBar'>
         <div className="header-logo">
          <Link to="/dashboard">
            <img src="/LOGO.png" alt="G-OBD Logo" /> {/* Replace with your logo */}
          </Link>
        </div>
           <ul>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/individuals">Individuals</Link></li>
            <li><Link to="/individualsRequest">Requests</Link></li>
            <li><Link to="/car_diagnoses">Car Diagnoses</Link></li>
            <li><Link to="/settings">Settings</Link></li>
            <li><Link to="/support">Support</Link></li>
          </ul>
          <div className="logout" onClick={handleLogout}>Logout</div>
      </div>
    )
  }
}

// Create a wrapper component to use hooks
export default function SidebarWrapper(props) {
  const navigate = useNavigate();
  return <Sidebar {...props} navigate={navigate} />;
}
