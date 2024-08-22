import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Offcanvas from 'react-bootstrap/Offcanvas';
axios.defaults.withCredentials = true;
const serverURL = process.env.REACT_APP_SERVERURL;

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



export default class Push extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            title: "",
            body: "",
        }
                
        
      }

    handleClose = () => this.setState((state) => {
        return { ...state, showCanvas: false };
    });
    handleShow = () => this.setState((state) => {
        return { ...state, showCanvas: true };
    });

    
    sendPush = () => {
        axios.post(serverURL+"push", { data:{title:this.state.title, body:this.state.body} , withCredentials: true })
        .then((Response)=>{
            // console.log(Response.data);            
        })
        .catch((Error)=>{console.log(Error)});
    }    

    sendPushDefault = () => {
        axios.post(serverURL+"push", { withCredentials: true })
        .then((Response)=>{
            // console.log(Response.data);            
        })
        .catch((Error)=>{console.log(Error)});
    }

    changeTitle = (event) => {
        this.setState((state) => {
            return { ...state, title: event.target.value }
        });        
    }

    changeBody = (event) => {
        this.setState((state) => {
            return { ...state, body: event.target.value }
        });
    }
    
    async componentDidMount() {
        
    }

    

    
    render(){    
        return (
            <>
                <Container style={{ 
                                backgroundColor: 'WhiteSmoke', 
                            }}>
                    <Row className="justify-content-md-center" style={{
                        height:"20px"
                    }}>
                        <Col style={{ 
                            backgroundColor: 'WhiteSmoke',
                        }}
                        width="100%" 
                        >                               
                            
                        </Col>
                    </Row>
                    <Row className="justify-content-md-center">
                        <Col xs={3} style={{ 
                            backgroundColor: 'DarkGray',
                        }}>
                            푸시 제목
                        </Col>
                        <Col xs={9} style={{ 
                            backgroundColor: 'WhiteSmoke',
                        }}>
                            <Form.Control
                            placeholder="푸시 제목"
                            aria-label="푸시 제목"
                            aria-describedby="title"
                            value={this.state.title}
                            onChange={event => this.changeTitle(event)}
                            // style={{width:140}}
                        />
                        </Col>
                    </Row>
                    <Row className="justify-content-md-center">
                        <Col xs={3} style={{ 
                            backgroundColor: 'DarkGray',
                        }}>
                            푸시 내용
                        </Col>
                        <Col xs={9} style={{ 
                            backgroundColor: 'WhiteSmoke',
                        }}>
                            <Form.Control
                                placeholder="푸시 내용"
                                aria-label="푸시 내용"
                                aria-describedby="body"
                                value={this.state.body}
                                onChange={event => this.changeBody(event)}
                                // style={{width:140}}
                            />
                        </Col>
                    </Row>                        
                    <Row>
                        <Col style={{ 
                            backgroundColor: 'WhiteSmoke',
                        }}>
                            <Button variant="outline-primary" onClick={() => this.sendPush()}>푸시 전송</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{ 
                            backgroundColor: 'WhiteSmoke',
                        }}>
                            <Button variant="outline-success" onClick={() => this.sendPushDefault()}>기본 푸시 전송</Button>
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