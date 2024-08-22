import React from 'react';
import { Navigate, Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import axios from 'axios';
import Offcanvas from 'react-bootstrap/Offcanvas';
axios.defaults.withCredentials = true;
// const serverURL = "https://song.cindy.team:3002/";

// function getNow(){
//     // const TIME_ZONE = 9 * 60 * 60 * 1000; // 9시간
//     // const d = new Date();

//     // return new Date(d.getTime() + TIME_ZONE);
    

//     // 1. 현재 시간(Locale)
//     const curr = new Date();

//     // 2. UTC 시간 계산
//     const utc = 
//         curr.getTime() + 
//         (curr.getTimezoneOffset() * 60 * 1000);

//     // 3. UTC to KST (UTC + 9시간)
//     const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
//     const kr_curr = 
//         new Date(utc + (KR_TIME_DIFF));

//     return kr_curr;
// }



export default class Guide extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            showCanvas: false,
            // title: "",
            // body: "",
        }
                
        
      }

    handleClose = () => this.setState((state) => {
        return { ...state, showCanvas: false };
    });
    handleShow = () => this.setState((state) => {
        return { ...state, showCanvas: true };
    });
    goMain = () => {
        Navigate('/');
    }
    
    async componentDidMount() {
        
    }

    

    
    render(){    
        return (
            <>
                <Container style={{ 
                                backgroundColor: 'WhiteSmoke', 
                            }}>
                    <Row className="justify-content-md-center" style={{ height: "20px"}}>
                        <Col style={{ 
                            backgroundColor: 'WhiteSmoke',
                        }}
                        width="100%" 
                        >  
                        </Col>
                    </Row>  
                    <Row className="justify-content-md-center">
                        <Col style={{ 
                            backgroundColor: 'WhiteSmoke',
                        }}
                        width="100%" 
                        >                               
                           <img src="./guide.png" width="100%" height="100%" alt="Guide"/> 
                        </Col>
                    </Row>   
                    <Row className="justify-content-md-center">
                        <Col style={{ 
                            backgroundColor: 'WhiteSmoke',
                        }}
                        width="100%" 
                        >                               
                            <Link to="/"><Button variant="outline-primary">설정완료</Button></Link>
                        </Col>
                    </Row>                    
                </Container>
                <Offcanvas placement={"end"} show={this.state.showCanvas} onHide={this.handleClose}>
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title><img className="thumbnail" src="./logo2.png" width="120" alt="logo"/></Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        {this.state.loginComponents}
                        { this.state.updateButton }    
                    </Offcanvas.Body>
                </Offcanvas>                    
            </>
        );
    }    
}