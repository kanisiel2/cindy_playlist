import React, { useEffect, useState } from 'react';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import { setSession } from './redux/statusSlice';
// import Countdown from 'react-countdown-simple';
// import { Countdown } from "circular-countdown-react";
import GaugeComponent from 'react-gauge-component'
// import { SimpleGauge } from "react-gauges";
import ProgressBar from "@ramonak/react-progress-bar";
// import chroma from 'chroma-js';
import { IoRefreshCircleSharp, IoLogOut } from "react-icons/io5";
// import cookie from 'react-cookies';
import "./index.css";
import { useSelector, useDispatch } from 'react-redux';
axios.defaults.withCredentials = true;

const URLBody = process.env.REACT_APP_SERVERURL;
const userURL = URLBody+"getuser";
const logoutURL = URLBody+"logout";

// eslint-disable-next-line
String.prototype.string = function (len) { var s = '', i = 0; while (i++ < len) { s += this; } return s; };
// eslint-disable-next-line
String.prototype.zf = function (len) { return "0".string(len - length) + this; };
// eslint-disable-next-line
Number.prototype.zf = function (len) { return toString().zf(len); };
// eslint-disable-next-line
const fillzero = (data) => {
    return data < 10 ? "0" + data.toString() : data.toString();
}

function getKST(curr){
  // 2. UTC 시간 계산
  const utc = 
      curr.getTime() + 
      (curr.getTimezoneOffset() * 60 * 1000);

  // 3. UTC to KST (UTC + 9시간)
  const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
  const kr_curr = 
      new Date(utc + (KR_TIME_DIFF));

  return kr_curr;
}
const dateToString = (date) => {
  let datestrings = getKST(date).toLocaleString('ko-KR').substring(0,12).replace(". ", "-").replace(". ", "-").replace(".", "").split("-");     
  datestrings = datestrings.map((item)=> {
      if(item.length<2){
          return "0"+item;
      } else {
          return item;
      }
  })
  return datestrings.join("-");
}

export default function Profile() {

  // constructor(props){
  //   super(props);
  //   this.state = {
  //       user_id: null,
  //       photo: null,
  //       name: null,
  //       refToken: null,
  //   }
  // }
  const session = useSelector((state) => state.statuses.session)
  const dispatch = useDispatch();
  const [sessions, setSessions] = useState(session);
  const [percent, setPercent] = useState(0);
  const [remain, setRemain] = useState(null);
  const [intervals, setIntervals] = useState(null);
  const [bgcolor, setBgcolor] = useState("#32CD32");

  // eslint-disable-next-line
  useEffect(() => {
    // const cookies = document.cookie;
    // console.log(cookies);
    // let state = this.state;
    // if(cookie.load('koa.sess')){

    //   state.loginComponents = <Nav.Link href={loginURL}>구글 로그인</Nav.Link>;
    //   this.setState(state, ()=> {
    //     console.log(this.state);
    //   })
    // } else {
    //   state.loginComponents = <Nav.Link href={loginURL}>구글 로그인</Nav.Link>;
    //   this.setState(state, ()=> {
    //     console.log(this.state);
    //   })
    // }
    axios.get(userURL, {
        withCredentials: true,               
      })
      .then((Response)=>{
        // console.log(Response.data);
        // if(Response.data.user){
          let state = Response.data.user;
          // console.log(state);
          // console.log(state);
          setSessions(state);
          dispatch(setSession(state));
          // console.log((sessions.expires - Date.now())/1000);
        // } else {    
        //   console.log("else");      
        //   document.cookie = 'koa.sess=; path=/; domain=cindyhelper.duckdns.org; expires=' + new Date(0).toUTCString();
        //   document.cookie = 'koa.sess.sig=; path=/; domain=cindyhelper.duckdns.org; expires=' + new Date(0).toUTCString();
        //   // document.cookie = 'koa.sess=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        //   // document.cookie = 'koa.sess.sig=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        //   // cookie.remove('koa.sess', {path : '/'},1000)
        //   // cookie.remove('koa.sess.sig', {path : '/'},1000)
        // }        
      })
      .catch((Error)=>{console.log(Error)});
  }, []);
  // useEffect(() => { 

  // }, [remain])
  useEffect(() => {
    // console.log(session);
    clearInterval(intervals);
    setIntervals(setInterval(function () {
      let timediff = (sessions.expires-Date.now());
      // let minutes = Math.floor(timediff/60);
      // let seconds = Math.floor(timediff%60);
      // let value = Math.floor(timediff/60)>0?Math.floor(timediff/60)+"분":Math.floor(timediff%60)+"초";
      setPercent(Math.floor((timediff/36000)));
      setRemain(Math.floor(timediff/1000));
      // console.log(dateToString(new Date()));
      if(timediff/1000<5){
        toRefresh();
      }
    }, 1000));
  }, [sessions])
//cindyhelper.duckdns.org
  const toLogout = () => {
    document.cookie = 'koa.sess=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'koa.sess.sig=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    // cookie.remove('koa.sess', {path : '/'},1000)
    // cookie.remove('koa.sess.sig', {path : '/'},1000)
    window.location.replace(logoutURL);
  };

  // const setTimer = () => {

  // }

  // const colorChange = () => {
  //   if( percents > 70 ){
  //     setBgcolor("#32CD32");
  //   } else if( percents > 50 ){
  //     setBgcolor("#808000");
  //   } else if( percents > 30 ){
  //     setBgcolor("#FFA500");
  //   } else if( percents > 15){
  //     setBgcolor("#FF4500");
  //   } else if( percents > 10){
  //     setBgcolor("#FF0000");
  //   } else if( percents > 5){
  //     setBgcolor("#8B0000");
  //   } else if( percents === 0 ){
  //     setBgcolor("#696969");
  //   }
  // }


  const toRefresh = () => {
    // window.location.replace(URLBody+"refresh_login");
    axios.get(URLBody+"refresh_login", {
      // withCredentials: true,               
    })
    .then((Response)=>{      
      let state = Response.data.user;
      console.log(state);
      // console.log(Response.data);
      setSessions(state);
      dispatch(setSession(state))
      // console.log(new Date(Response.data.tokens.params.expire));

      // // if(Response.data.user){
      //   let state = Response.data.user;
      //   state.refToken = JSON.parse(state.refToken);
      //   console.log(state.refToken);
      //   console.log(state);
      //   // console.log(state);
      //   dispatch(setSession(state))
      // // } else {    
      // //   console.log("else");      
      // //   document.cookie = 'koa.sess=; path=/; domain=cindyhelper.duckdns.org; expires=' + new Date(0).toUTCString();
      // //   document.cookie = 'koa.sess.sig=; path=/; domain=cindyhelper.duckdns.org; expires=' + new Date(0).toUTCString();
      // //   // document.cookie = 'koa.sess=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      // //   // document.cookie = 'koa.sess.sig=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      // //   // cookie.remove('koa.sess', {path : '/'},1000)
      // //   // cookie.remove('koa.sess.sig', {path : '/'},1000)
      // // }        
    })
    .catch((Error)=>{console.log(Error)});
  };

  const remainDisplay = (value) => {
    if ( value < 60 ) {
      return value+"초";
    } else {
      return Math.floor(value/60)+"분";
    }    
  }

  
  // <td>
  // <Gauge
  //   value={25}
  //   minValue={0}
  //   maxValue={100}
  //   renderBottomLabel="km/h"
  //   arcColor={({ normValue }) => chroma.scale(['green', 'red'])(normValue).css()}
  // />
  // </td>

  // <Countdown
  //                   targetDate={sessions.expires}
  //                   renderer={({ minutes, seconds }) => {
  //                       // setRemain(minutes*60+seconds);
  //                       // console.log((minutes*60+seconds)/36);
  //                       // setPercents(Math.floor(((sessions.expires-Date.now())/36000)));
  //                       // colorChange();
  //                       return (
  //                         <div>
  //                           {minutes}:{seconds}
  //                         </div>
  //                       )
  //                     }
  //                   }
  //                 />


  // render(){
    return (
        <>
          <Table striped={false} borderless={true} className='align-items-md-center noMargin' responsive="md">
            <tbody>
              <tr>
                <td><Image width={40} src={sessions?sessions.photo:""} roundedCircle /></td>
                <td>{sessions?sessions.name:""}</td>
                <td>
                  
                </td>
                <td>
                  <Table>
                    <tbody>
                      <tr>
                        <td><Button variant="outline-success" onClick={toRefresh}><IoRefreshCircleSharp /></Button></td>
                      </tr>
                      <tr>                      
                        <td><Button variant="outline-info" onClick={toLogout}><IoLogOut /></Button></td>
                      </tr>
                    </tbody>
                  </Table>
                </td>
              </tr>
              <tr>
                <td colSpan={4}>
                  <ProgressBar
                    completed={percent}
                    // isLabelVisible={false}
                    customLabel={remainDisplay(remain)}
                    height={"15px"}
                    bgColor={bgcolor}
                    baseBgColor={"#F8F8FF"}
                  />
                </td>
              </tr>
            </tbody>
          </Table>
        </>
    )
  }
// }

// <Container>
//             <Row>
//                 <Col md={3}><Image width={40} src={this.state.photo} roundedCircle /></Col>
//                 <Col><p>{this.state.name}</p></Col>
//                 <Col md={3}>
//                     <Button variant="outline-info" onClick={this.toLogout}>로그아웃</Button>
//                 </Col>
//             </Row>
//         </Container>


{/* <GaugeComponent
                    type="semicircle"
                    id="gauge-component4"
                    arc={{
                      gradient: true,
                      width: 0.15,
                      padding: 0,
                      subArcs: [
                        {
                          limit: 20,
                          color: '#EA4228',
                        },
                        {
                          limit: 40,
                          color: '#F58B19',
                        },
                        {
                          limit: 60,
                          color: '#F5CD19',
                        },
                        {
                          limit: 100,
                          color: '#5BE12C',
                        },
                      ]
                    }}
                    labels={{
                      valueLabel: {
                        fontSize: 20,
                        formatTextValue: remainDisplay
                      }                      
                    }}                    
                    value={remain}
                    maxValue={3600}
                    pointer={{type: "blob", animationDelay: 0 }}
                    
                  />  */}