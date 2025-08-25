import React, { Component } from 'react';
import '../css/projecthomepage.css';
import { BASEURL, callApi, setSession } from '../api';

export class Projecthomepage extends Component {
  constructor() {
    super();
    this.userRegistration = this.userRegistration.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
    this.forgotPasswordResponse = this.forgotPasswordResponse.bind(this);
    this.signin = this.signin.bind(this);
    this.signinResponse = this.signinResponse.bind(this);
    this.getResponse = this.getResponse.bind(this);
  }

  showSignin() {
    let popup = document.getElementById('popup');
    let signin = document.getElementById('signin-form');
    let signup = document.getElementById('Signup');
    let popupHeader = document.getElementById('popupHeader');
    popupHeader.innerHTML = 'Login';
    signin.style.display = 'block';
    signup.style.display = 'none';
    popup.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling

    let username = document.getElementById('usernameInput');
    let password = document.getElementById('passwordInput');
    let responseDiv = document.getElementById('responseDiv');
    username.value = "";
    password.value = "";
    responseDiv.innerHTML = "";
  }

  showSignup() {
    let popup = document.getElementById('popup');
    let signin = document.getElementById('signin-form');
    let signup = document.getElementById('Signup');
    let popupHeader = document.getElementById('popupHeader');
    popupHeader.innerHTML = 'Signup';
    signin.style.display = 'none';
    signup.style.display = 'block';
    popup.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  closeSignin(event) {
    // Only close when clicking directly on the popup background, not on its children
    if (event.target.id === 'popup') {
      this.closePopup();
    }
  }

  closePopup() {
    let popup = document.getElementById('popup');
    popup.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling
  }

  userRegistration() {
    let fullname = document.getElementById("fullname");
    let email = document.getElementById("email");
    let role = document.getElementById("role");
    let signuppassword = document.getElementById("signuppassword");
    let confirmpassword = document.getElementById("confirmpassword");

    // Reset borders
    fullname.style.border = "";
    email.style.border = "";
    role.style.border = "";
    signuppassword.style.border = "";
    confirmpassword.style.border = "";
    
    // Form validation
    if(fullname.value === "") {
      fullname.style.border = "1px solid red";
      fullname.focus();
      return;
    }
    if(email.value === "") {
      email.style.border = "1px solid red";
      email.focus();
      return;
    }
    if(role.value === "") {
      role.style.border = "1px solid red";
      role.focus();
      return;
    }
    if(signuppassword.value === "") {
      signuppassword.style.border = "1px solid red";
      signuppassword.focus();
      return;
    }
    if(confirmpassword.value === "") {
      confirmpassword.style.border = "1px solid red";
      confirmpassword.focus();
      return;
    }
    if(signuppassword.value !== confirmpassword.value) {
      signuppassword.style.border = "1px solid red";
      confirmpassword.style.border = "1px solid red";
      signuppassword.focus();
      return;
    }

    var data = JSON.stringify({
      fullname: fullname.value,
      email: email.value,
      role: role.value,
      password: signuppassword.value
    });
    callApi("POST", "http://localhost:2031/users/signup", data, this.getResponse);
  }

  getResponse(res) {
    console.log("Signup response:", res);
    let resp = res.split('::');
    alert(resp[1]);
    if (resp[0] === "200") {
      let signin = document.getElementById("signin-form");
      let signup = document.getElementById("Signup");
      signin.style.display = "block";
      signup.style.display = "none";
    }
  }

  forgotPassword() {
    let username = document.getElementById('usernameInput');
    
    username.style.border = "";
    if(username.value === "") {
      username.style.border = "1px solid red";
      username.focus();
      return;
    }
    
    let url = "http://localhost:2031/users/forgotpassword/" + username.value;
    callApi("GET", url, "", this.forgotPasswordResponse);
  }

  forgotPasswordResponse(res) {
    console.log("Forgot password response:", res);
    let responseDiv = document.getElementById('responseDiv');
    
    let data = res.split('::');
    if(data[0] === "200") {
      responseDiv.innerHTML = `<br/><br/><label style='color:green'>${data[1]}</label>`;
    } else {
      responseDiv.innerHTML = `<br/><br/><label style='color:red'>${data[1]}</label>`;
    }
  }

  signin() {
    let username = document.getElementById('usernameInput');
    let password = document.getElementById('passwordInput');
    let responseDiv = document.getElementById('responseDiv');
    
    username.style.border = "";
    password.style.border = "";
    responseDiv.innerHTML = "";
    
    if(username.value === "") {
      username.style.border = "1px solid red";
      username.focus();
      return;
    }
    if(password.value === "") {
      password.style.border = "1px solid red";
      password.focus();
      return;
    }
    
    // Try with email field as well as username (common issue)
    var data = JSON.stringify({
      username: username.value,
      email: username.value, // Include both in case backend expects email
      password: password.value
    });
    
    console.log("Sending signin request with data:", data);
    callApi("POST", "http://localhost:2031/users/signin", data, this.signinResponse);
  }
  
  signinResponse(res) {
    console.log("Full signin response:", res);
    let responseDiv = document.getElementById('responseDiv');
    
    try {
      const jsonData = JSON.parse(res);
      console.log("Parsed as JSON:", jsonData);
      
      if (jsonData.status === "success" || jsonData.code === 200) {
        setSession("csrid", jsonData.id || jsonData.userId || jsonData._id, 1);
        window.location.replace('/dashboard');
      } else {
        responseDiv.innerHTML = `<br/><br/><label style='color:red'>${jsonData.message || "Authentication failed"}</label>`;
      }
    } catch (e) {
      console.log("Not JSON, trying string split");
      let rdata = res.split('::');
      console.log("Split response:", rdata);
      
      if(rdata.length > 1 && rdata[0] === "200") {
        setSession("csrid", rdata[1], 1);
        window.location.replace('/dashboard');
      }
      else {
        if (rdata.length > 1) {
          responseDiv.innerHTML = `<br/><br/><label style='color:red'>${rdata[1]}</label>`;
        } else {
          responseDiv.innerHTML = `<br/><br/><label style='color:red'>Authentication failed. Please check your credentials.</label>`;
        }
      }
    }
  }

  render() {
    return (
      <div className='page-container'>
        {/* Enhanced Popup */}
        <div id='popup' onClick={this.closeSignin.bind(this)}>
          <div className='popupwindow'>
            <div id='popupHeader' className='popupHeader'>
              Login
              <span 
                className="close-btn" 
                onClick={this.closePopup.bind(this)}
                style={{
                  position: 'absolute',
                  right: '15px',
                  top: '10px',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                ×
              </span>
            </div>
            <div id='signin-form' className='Signin'>
              <div className="input-group">
                <label className='usernameLabel'>Username:</label>
                <input type='text' id='usernameInput' className='form-input' placeholder='Enter your username' />
              </div>
              <div className="input-group">
                <label className='passwordLabel'>Password:</label>
                <input type='password' id='passwordInput' className='form-input' placeholder='Enter your password' />
              </div>
              <div className='forgotPassword'><label onClick={this.forgotPassword.bind(this)}>Forgot Password</label></div>
              <button className='signinButton' onClick={this.signin}>Sign In</button>

              <div className='separator'>
                <div className='div1' id='responseDiv'></div>
                <span>or</span>
                <div className='div2'></div>
              </div>

              <div className='signup-prompt'>
                Don't have an account?
                <div id='signup' onClick={this.showSignup.bind(this)}>Sign Up</div>
              </div>
            </div>
            <div id='Signup'>
              <div className="input-group">
                <label>Full Name:</label>
                <input type='text' id='fullname' className='form-input' placeholder='Enter your full name' />
              </div>
              <div className="input-group">
                <label>Email:</label>
                <input type='email' id='email' className='form-input' placeholder='Enter your email address' />
              </div>
              <div className="input-group">
                <label>Role:</label>
                <select id='role' className='form-select'>
                  <option value='' disabled selected>Select your role</option>
                  <option value='1'>Admin</option>
                  <option value='2'>Employer</option>
                  <option value='3'>Job Seeker</option>
                </select>
              </div>
              <div className="input-group">
                <label>Password:</label>
                <input type='password' id='signuppassword' className='form-input' placeholder='Enter your password' />
              </div>
              <div className="input-group">
                <label>Confirm password:</label>
                <input type='password' id='confirmpassword' className='form-input' placeholder='Confirm your password' />
              </div>
              <button className='registerButton' onClick={this.userRegistration}>Register Now</button>

              <div className='signin-prompt'>
                Already have an account? 
                <span onClick={this.showSignin.bind(this)} className='signin-link'>SIGN IN</span>
              </div>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="header">
          <div id='logo1'>
            <img id='image1' src="/images/logo.png" alt="Logo" />
          </div>
          <div id='title'>
            <h2>KL JOB PORTAL</h2>
          </div>
          <div id='signin-button' onClick={this.showSignin.bind(this)}>
            <img id='image3' src="/images/user.png" alt="Logo" />
            <h4 id='signin1'>Sign In</h4>
          </div>
          <div id='Register' onClick={this.showSignup.bind(this)}>
            <img id='image3' src="/images/user.png" alt="Logo" />
            <h4 id='Register1'>Register</h4>
          </div>
        </div>

        {/* Search */}
        <div className="search-container">
          <div className="searchbar">
            <div className="search-input-group">
              <input type="text" placeholder="Search for jobs" id='search' className='search-input' />
              <input type="text" placeholder="Location" id='location' className='location-input' />
              <button className="search-button">Search</button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className='Content'>
          <div className='hero-section'>
            <div className='text1'>Get started with us by now the best career guidance to all</div>
            <div className='text2'>Make your dream success</div>
            <div className='text3'>Good career</div>
          </div>
        </div>

        {/* Footer */}
        <div className="footer">
          <div className="footer-content">
            <div className="footer-text">
              <p>Created by Harsh 2300032995</p>
              <p className='copyrightText'>Copyright ©️ - KL University. All rights reserved</p>
            </div>
            <div className="social-icons">
              <img className='socialmedialIcon' src='./images/facebook.png' alt="Facebook" />
              <img className='socialmedialIcon' src='./images/linkedin.png' alt="LinkedIn" />
              <img className='socialmedialIcon' src='./images/twitter.png' alt="Twitter" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Projecthomepage;