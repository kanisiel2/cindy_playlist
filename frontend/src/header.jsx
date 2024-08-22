import React, { useEffect, useState } from 'react';
import { BrowserView, MobileView } from 'react-device-detect';
import axios from 'axios';
import Image from 'react-bootstrap/Image';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { setCanvasStatus } from './redux/windowSlice';
import { setSession } from './redux/statusSlice';
import { useSelector, useDispatch } from 'react-redux';
// import { Gauge } from 'react-circular-gauge';
// import chroma from 'chroma-js';
// import Countdown from 'react-countdown-simple';
import { IoRefreshCircleSharp, IoLogOut } from "react-icons/io5";
import Table from 'react-bootstrap/Table';
import Profile from './Profile';
import {RxHamburgerMenu} from 'react-icons/rx';
import ProgressBar from "@ramonak/react-progress-bar";
import "./index.css";

// import GoogleLoginButton from './googleLoginButton';
// import { Link } from 'react-router-dom';
// import { ReactComponent as Logo2 } from './logo2.svg'
// import cookie from 'react-cookies';

// const loginURL = "https://song.cindy.team:3002/google";
// const userURL = "https://song.cindy.team:3002/getuser";
const URLBody = process.env.REACT_APP_SERVERURL;
const userURL = URLBody+"getuser";
const logoutURL = URLBody+"logout";
const serverURL = process.env.REACT_APP_SERVERURL;

// eslint-disable-next-line
String.prototype.string = function (len) { var s = '', i = 0; while (i++ < len) { s += this; } return s; };
 // eslint-disable-next-line
String.prototype.zf = function (len) { return "0".string(len - length) + this; };
 // eslint-disable-next-line
Number.prototype.zf = function (len) { return toString().zf(len); };
// const fillzero = (data) => {
//     return data < 10 ? "0" + data.toString() : data.toString();
// }

export default function Header () {

    const showCanvas = useSelector((state) => state.windows.canvas)
    const loginComponents = useSelector((state) => state.statuses.loginComponents)
    const updateButton = useSelector((state) => state.statuses.updateButton)
    const session = useSelector((state) => state.statuses.session)
    
    const dispatch = useDispatch()    
  
    const [sessions, setSessions] = useState(session);
    // eslint-disable-next-line
    const [percent, setPercent] = useState(0);
    const [remain, setRemain] = useState(null);
    const [intervals, setIntervals] = useState(null);
    const [bgcolor, setBgcolor] = useState("#32CD32");

    const handleClose = () => {
        dispatch(setCanvasStatus(false));
    }
    const handleOpen = () => {
        dispatch(setCanvasStatus(true));
    }

    const colorChange = () => {
        if( percent > 70 ){
          setBgcolor("#32CD32");
        } else if( percent > 50 ){
          setBgcolor("#808000");
        } else if( percent > 30 ){
          setBgcolor("#FFA500");
        } else if( percent > 15){
          setBgcolor("#FF4500");
        } else if( percent > 10){
          setBgcolor("#FF0000");
        } else if( percent > 5){
          setBgcolor("#8B0000");
        } else if( percent === 0 ){
          setBgcolor("#696969");
        }
      }

    const toRefresh = () => {
        axios.get(URLBody+"refresh_login", {
          // withCredentials: true,               
        })
        .then((Response)=>{      
          let state = Response.data.user;
          console.log("session refreshed");
          setSessions(state);
          dispatch(setSession(state))
        })
        .catch((Error)=>{console.log(Error)});
    };

    const toLogout = () => {
        document.cookie = 'koa.sess=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = 'koa.sess.sig=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        window.location.replace(logoutURL);
    };

    // eslint-disable-next-line
    useEffect(() => {
        axios.get(userURL, {
            withCredentials: true,               
          })
          .then((Response)=>{
                let state = Response.data.user;
                setSessions(state);             
                // console.log(sessions);
                dispatch(setSession(state))
                // dispatch(setUpdateButton(
                //     Response.data.session.passport ? (
                //         <Button key={Math.random()+Date.now().toISOString()} variant='outline-primary' onClick={()=>updateStat()}>
                //             방송상태 업데이트
                //         </Button>
                //     ) : null
                // ))
                if(sessions){
                    let timediff = (sessions.expires-Date.now());
                    setPercent(Math.floor((timediff/36000)));
                    setRemain(Math.floor(timediff/1000));                    
                }
          })
          .catch((Error)=>{console.log(Error)});
      }, []);

      useEffect(() => {
        // console.log(session);
        // clearInterval(intervals);
        if(sessions){
            let timediff = (sessions.expires-Date.now());
            setPercent(Math.floor((timediff/36000)));
            setRemain(Math.floor(timediff/1000));                    
        }
      }, [sessions])

      useEffect(() => {
        // console.log(remain);        
        clearInterval(intervals);
        if(remain<5&&remain>0){
            // setIntervals(null);
            toRefresh();
        }
        if(sessions){
            setIntervals(setInterval(function () {
                let timediff = (sessions.expires-Date.now());
                // let minutes = Math.floor(timediff/60);
                // let seconds = Math.floor(timediff%60);
                // let value = Math.floor(timediff/60)>0?Math.floor(timediff/60)+"분":Math.floor(timediff%60)+"초";
                setPercent(Math.floor((timediff/36000)));
                setRemain(Math.floor(timediff/1000));
                // console.log(remain);
                // console.log(Math.floor(timediff/1000));
                // console.log(dateToString(new Date()));            
            }, 1000));
        }
      }, [remain])

      
    const remainDisplay = (value) => {
        if ( value < 60 ) {
            return value+"초";
        } else {
            return Math.floor(value/60)+"분"+Math.floor(value%60)+"초";
        }    
    }
  
//  <Button variant="primary" onClick={handleShow}>
//                             <RxHamburgerMenu></RxHamburgerMenu>
//                         </Button>                             
  
  // <Logo2 width="150"></Logo2>
    return (
    <>
        <BrowserView>
            <Navbar fixed="top"  align="center" className='center'
            style={
                {backgroundColor: 'WhiteSmoke', margin:"0", padding:"0"}
            }>
                <Container className='center'
                    style={{width:window.innerWidth*0.9}
                }>
                    <Row style={{width:"100%"}}>
                        <Col xs={2} className="center" style={{ 
                            backgroundColor: 'WhiteSmoke', 
                            width:(1.5/12)*100+"%"
                        }}>
                            <Image src="./logo2.png" fluid />
                            {/* <img className="thumbnail" src="./logo2.png" width="80%" alt="logo"/> */}
                            {/* <Countdown
                                        targetDate={sessions.expires}
                                        renderer={
                                            ({ minutes, seconds }) => {
                                                setPercents(Math.floor(((sessions.expires-Date.now())/36000)));
                                                // colorChange();
                                                let value = null;
                                                if(minutes>0){ value = minutes.zf()+"분"}
                                                else { value = seconds.zf()+"초"}
                                                //{minutes}:{seconds}
                                                return (
                                                <div>
                                                    {value}
                                                </div>
                                                )
                                            }
                                        }
                                    /> */}
                        </Col>
                        <Col xs={6} className="center" style={{ 
                            backgroundColor: 'WhiteSmoke', 
                            width:(6.5/12)*100+"%"
                        }}></Col>
                        <Col xs={4} style={{ 
                            backgroundColor: 'WhiteSmoke',
                            width:(4/12)*100+"%"
                        }}>
                            <Table striped={false} borderless={true} className='align-items-md-center noMargin' responsive="md"
                            style={{ backgroundColor: 'WhiteSmoke', }}>
                                <tbody>
                                    <tr>
                                        <td style={{ backgroundColor: 'WhiteSmoke', }}><Image width={40} src={sessions?sessions.photo:""} roundedCircle /></td>
                                        <td style={{ backgroundColor: 'WhiteSmoke', }}>
                                            <Container>
                                                <Row>
                                                    <Col>
                                                        {sessions?sessions.name:""}
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        <font className="remainTime">{remainDisplay(remain)}</font>
                                                    </Col>
                                                </Row>
                                            </Container>                                            
                                        </td>
                                        <td style={{ backgroundColor: 'WhiteSmoke', align:"right" }}>
                                            <Button variant="outline-success" onClick={toRefresh}><IoRefreshCircleSharp /></Button>
                                            <Button variant="outline-info" onClick={toLogout}><IoLogOut /></Button>                                        
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ backgroundColor: 'WhiteSmoke', padding:0}} colSpan={4}>
                                        <ProgressBar
                                            completed={percent}
                                            isLabelVisible={false}
                                            // customLabel={}
                                            height={"15px"}
                                            bgColor={bgcolor}
                                            baseBgColor={"WhiteSmoke"}
                                        />
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                            
                        </Col>
                        {/* <Col xs={2} className="center" style={{ 
                            backgroundColor: 'WhiteSmoke', 
                        }}>
                            <Button variant="outline-success" onClick={toRefresh}><IoRefreshCircleSharp /></Button>
                            <Button variant="outline-info" onClick={toLogout}><IoLogOut /></Button>
                        </Col>                         */}
                    </Row>
                </Container>
            </Navbar>
        </BrowserView>
        <MobileView>
            <Navbar fixed="top"  align="center" className='center'
            style={
                {
                    backgroundColor: 'WhiteSmoke',
                    margin:"0",
                    padding:"0",
                    height:(window.innerHeight*0.086)
                }
            }>
                <Container className='center'
                    style={{width:window.innerWidth*0.9}
                }>
                    <Row>
                        <Col xs={3} className="center" style={{ 
                            backgroundColor: 'WhiteSmoke', 
                        }}>
                            <Image src="./logo2.png" fluid />
                        </Col>
                        <Col xs={8} style={{ 
                            backgroundColor: 'WhiteSmoke', 
                        }}> 
                        </Col>
                        <Col xs={1} className="center" style={{ 
                            backgroundColor: 'WhiteSmoke', 
                        }}>
                        <Button variant="primary" onClick={handleOpen}>
                                <RxHamburgerMenu></RxHamburgerMenu>
                            </Button> 
                        </Col>                        
                    </Row>
                </Container>
            </Navbar>
        </MobileView>
        <Offcanvas placement={"end"} show={showCanvas} onHide={handleClose}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title><img className="thumbnail" src="./logo2.png" width="120" alt="logo"/></Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                { loginComponents?<Profile></Profile>:<a href={serverURL+"google"}>구글 로그인</a> }
                { updateButton }
                { loginComponents?<a href='/admin'>노래 입력</a>:null }    
            </Offcanvas.Body>
        </Offcanvas>  
    </>
    )
  
}


