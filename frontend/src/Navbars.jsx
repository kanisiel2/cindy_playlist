import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Profile from './Profile';

import {RxHamburgerMenu} from 'react-icons/rx';
// import GoogleLoginButton from './googleLoginButton';
// import { Link } from 'react-router-dom';
// import { ReactComponent as Logo2 } from './logo2.svg'
// import cookie from 'react-cookies';

const serverURL = process.env.REACT_APP_SERVERURL;
const loginURL = serverURL+"google";
const userURL = serverURL+"getuser";

export default class Navbars extends React.Component {

  constructor(props){
    super(props);
    this.state = {
        loginComponents: null,
        showCanvas: false,
    }
  }

  componentDidMount() {
    let state = this.state;
    axios.get(userURL, {
      withCredentials: true,               
    })
    .then((Response)=>{
      // console.log(Response.data);
      if(Response.data.user){
        state.loginComponents = <Profile></Profile>;
        this.setState(state, ()=> {
          // console.log(this.state);
        })
      } else {    
        // console.log("else");      
        state.loginComponents = <Nav.Link href={loginURL}>구글 로그인</Nav.Link>;
        this.setState(state, ()=> {
          // console.log(this.state);
        })
      }        
    })
    .catch((Error)=>{console.log(Error)});   
    
  }

  handleClose = () => this.setState((state) => {
    return { ...state, showCanvas: false };
  });
  handleShow = () => this.setState((state) => {
    return { ...state, showCanvas: true };
  });

  // <Logo2 width="150"></Logo2>
  render(){
    return (
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="/"></Navbar.Brand>
            <Nav className="me-auto">
              
            </Nav>
            <Nav>
                        
            </Nav>
            <Nav>
            <Button variant="primary" onClick={this.handleShow}>
              <RxHamburgerMenu></RxHamburgerMenu>
            </Button>
            </Nav>
          <Offcanvas placement={"end"} show={this.state.showCanvas} onHide={this.handleClose}>
            <Offcanvas.Header closeButton>
              <Offcanvas.Title><img className="thumbnail" src="./logo2.png" width="120" alt="logo"/></Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
             {this.state.loginComponents}  
            </Offcanvas.Body>
          </Offcanvas>
        </Container>
      </Navbar>
    )
  }
}
//<GoogleLoginButton></GoogleLoginButton>
