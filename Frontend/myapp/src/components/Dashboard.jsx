import React, { Component } from 'react'
import "../css/Dashboard.css"
import { BASEURL, callApi, getSession, setSession } from '../api';
import Menubar from './Menubar';
import JobPosting from './JobPosting';
import JobSearch from './JobSearch';
import Profile from './Profile';

export default class Dashboard extends Component {
  constructor(props)
  {
    super(props);
    this.state = {fullname: ",activeComponent: "};
    this.showFullname = this.showFullname.bind(this);
    this.loadComponent = this.loadComponent.bind(this);

    
  }
  componentDidMount()
  {
    let csr = getSession("csrid");
    if(csr==="")
      this.logout();
    let data =JSON.stringify({csrid:csr});
    callApi("POST",BASEURL+"users/getfullname",data,this.showFullname);
  }
  showFullname(response)
  {
    this.setState({fullname: response});
  }
  logout(){
    setSession("csrid","",-1);
    window.location.replace("/")
  }
 
loadComponent(mid){
    let components={
        "1":<JobPosting/>,
        "2":<JobSearch/>,
        "3":<Profile/>,

    }
    this.setState({ activeComponent: components[mid] });

}

  render() {
    const{fullname,activeComponent}=this.state;
    return (
      <div className='dashboard'>
                <div className='header'>
                <img className='logo' src='./images/logo.png' alt='no' />
                <img className='logout' onClick={()=>this.logout()} src='./images/logout.png' alt='no' />
                <label>{fullname}</label>
                </div>
                <div className='menu'>
                <Menubar onMenuClick={this.loadComponent} />  
                </div>
                
                <div className='outlet'>{activeComponent}</div>

          </div>
    )
  }
}