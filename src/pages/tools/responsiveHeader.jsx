import React, { Component } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Breadcrumb from './breadCrumb'; // Ensure you have the correct path for this import
import '../../../stylings/styles.css'; // Import your CSS file
import { useAppContext } from './AppContext';
import Cookies from "js-cookie";

class ResponsiveHeader extends Component {
  state = {
    sidebarVisible: true,
    openUp: false, // State for controlling the openUp class
    username: "",
    nameKey:"",
    messages:[],
    unseenMessages:0,
    siteUsers:[],
    gobdUsers:[],
    diagnoses:[],
  };

  componentDidMount() {
    this.fetchData();
    this.fetchMessages();
    this.fetchDiagnoses();
  }

  toggleSidebarClass = () => {
    this.setState((prevState) => ({ openUp: !prevState.openUp }));
  };

  fetchData = async () => {
    try {
      // Mock admin data for frontend only
      this.setState({ 
        username: "Admin User",
        nameKey: "AD",
        gobdUsers: []
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  logout = async() => {
    try {
      // Mock logout for frontend only
      // Use navigate instead of window.location.href for React Router
      // This will be handled in the wrapper component
      const event = new CustomEvent('logout');
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  fetchDiagnoses = async () => {
    try {
      // Mock diagnoses data for frontend only
      this.setState({
        diagnoses: []
      });
    } catch (error) {
      console.error('Error fetching diagnoses:', error);
    }
  };

  fetchMessages = async () => {
    try {
      // Mock messages data for frontend only
      this.setState({
        unseenMessages: 0,
        siteUsers: []
      });
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  fetchAllDiagnoses = async () => {
    try {
      // Return mock diagnoses data
      return [];
    } catch (error) {
      console.error('Error fetching diagnoses data:', error);
      return [];
    }
  };

  fetchAllUsersData = async () => {
    try {
      // Return mock users data
      return [];
    } catch (error) {
      console.error('Error fetching users data:', error);
      return [];
    }
  };

  formatName=(str)=>{
    var strArr = str.split("")
     return strArr[0]+ strArr[1]
  }

  render() {
    const breadcrumbPath = ['Home', 'RQ-001'];
    const activeIndex = 1;

    return (
      <header className="header">
        <div className="res">
          <div className="open" onClick={this.toggleSidebarClass}>
            <i className="bi bi-layout-text-sidebar"></i>
          </div>
          <div className="header-search">
            <input type="text" placeholder="Search..." />
          </div>
          <div className="header-right">
            <div className="notification-icon">
              <span role="img" aria-label="notifications"><i className="bi bi-bell"></i></span>
            </div>
            <div className="admin-data">
              <div className="left">{(this.state.nameKey.toUpperCase())}</div>
              <div className="right">
                <span className='name'>{this.state.username}</span>
                <span>Admin</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        {this.state.sidebarVisible && (
          <div className={`sideBar ${this.state.openUp ? 'openUp' : ''}`}>
            <div className="header-logo">
              <Link to="/dashboard">
                <img src="/LOGO.png" alt="G-OBD Logo" /> {/* Replace with your logo */}
              </Link>
            </div>
            <ul>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li className='messages'><Link to="/individuals">GOBD Users</Link>
              {this.state.gobdUsers.length !==0 || null? <span>{this.state.gobdUsers.length}</span>: ""}</li>
              <li className='messages'><Link to="/car_diagnoses">Car Diagnoses</Link>
             {this.state.diagnoses.length !==0 || null? <span>{this.state.diagnoses.length}</span>: ""}
             </li>
              
              {/* <li><Link to="/support">Support</Link></li> */}
            </ul>
            <div className="header-search">
              <input type="text" placeholder="Search..." />
            </div>
            <div className="logout" onClick={this.logout}><i className="bi bi-box-arrow-right"></i> Logout</div>
            <div className="close" onClick={this.toggleSidebarClass}><i className="bi bi-x-lg"></i></div>
          </div>
        )}
      </header>
    );
  } 
}

// Create a wrapper component to inject context and navigation
const DashboardWithContext = () => {
  const { fetchData, data, loginStatus } = useAppContext();
  const navigate = useNavigate();

  // Handle logout event
  React.useEffect(() => {
    const handleLogout = () => {
      navigate('/login');
    };

    window.addEventListener('logout', handleLogout);
    return () => window.removeEventListener('logout', handleLogout);
  }, [navigate]);

  return <ResponsiveHeader fetchData={fetchData} data={data} loginStatus={loginStatus} />;
};


function separateByMyId(arr) {
  const result = {};

  arr.forEach(item => {
    const { myId, otherId } = item;

    // Create a key that considers both myId and otherId
    const key = [myId, otherId].sort().join('-');

    // Initialize an array for this key if it doesn't exist
    if (!result[key]) {
      result[key] = [];
    }

    // Push the current item into the appropriate array
    result[key].push(item);
  });

  // Convert the result object into an array of arrays
  return Object.values(result);
}

export default DashboardWithContext;
