import React, { forwardRef, useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import { useInterval } from './useInterval'

import { ReactComponent as Online } from './online.svg';
import { ReactComponent as Offline } from './offline.svg';
import axios from 'axios';
import { ko } from 'date-fns/esm/locale';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Profile from './Profile';

import { useSelector, useDispatch } from 'react-redux';
import { setCanvasStatus } from './redux/windowSlice';
import { setLive, setSession, setStatusIndicator, setUpdateButton, setLoginComponents } from './redux/statusSlice';

import {RxHamburgerMenu} from 'react-icons/rx';
import './index.css';
// import { ReactComponent as RequestIcon } from './RequestIcon.svg';
// import { ReactComponent as BGMIcon } from './BGMIcon.svg';

// import Card from 'react-bootstrap/Card';
import { 
    PiMicrophoneStageDuotone,
    PiMusicNotesDuotone,
    PiCaretRightBold,
    PiCheckBold,
    PiGiftDuotone,
    PiClipboardTextDuotone,
    PiBellLight,
    PiBellRingingFill
 } from 'react-icons/pi';
// import RequestIcon from "./request.png";
// import BGMIcon from "./BGM.png";
// import ReactionIcon from "./REACTION.png";
// import nowIcon from "./now.png";
// import firebase from "firebase";
// import { messaging } from "./firebase";
// import { getToken } from "firebase/messaging";
// import '@firebase/messaging';
// import '@firebase/me'

// const firebaseConfig = {
//     apiKey: "AIzaSyAd1D1upKIvbZr9TLU7nH9G4g3Mvgv96ug",
//     authDomain: "cindyhelper-a7b4b.firebaseapp.com",
//     projectId: "cindyhelper-a7b4b",
//     storageBucket: "cindyhelper-a7b4b.appspot.com",
//     messagingSenderId: "624352902528",
//     appId: "1:624352902528:web:20ea2f32ad6b713cbf5565"
//   };

// import { newSubscription } from "web-push-notification/client"

// // only works in safari if the user initiates this code. So a button "Subscribe now" is advised

// const stringifiedNewSubscription = await newSubscription("BP8OAIzF06k935BX7pRgWmpp5Fjp5NhczrleLk5FpXUwF2MHLO3UjhdLarD42tTSixxhxr4X2O3VDweByFTZJCw"); //created in step 1; return a stringified subscription (no need to stringify it again)
/*eslint no-extend-native: ["error", { "exceptions": ["Object", "Date","String","Number"] }]*/
 // eslint-disable-next-line
// Date.prototype
// function formats(date, f) {

//     if (!date.valueOf()) return " ";



//     var weekKorName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];

//     var weekKorShortName = ["일", "월", "화", "수", "목", "금", "토"];

//     var weekEngName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

//     var weekEngShortName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

//     var d = date;



//     return f.replace(/(yyyy|yy|MM|dd|KS|KL|ES|EL|HH|hh|mm|ss|a\/p)/gi, function ($1) {
//         let h;
//         switch ($1) {

//             case "yyyy": return d.getFullYear(); // 년 (4자리)

//             case "yy": return (d.getFullYear() % 1000).zf(2); // 년 (2자리)

//             case "MM": return (d.getMonth() + 1).zf(2); // 월 (2자리)

//             case "dd": return d.getDate().zf(2); // 일 (2자리)

//             case "KS": return weekKorShortName[d.getDay()]; // 요일 (짧은 한글)

//             case "KL": return weekKorName[d.getDay()]; // 요일 (긴 한글)

//             case "ES": return weekEngShortName[d.getDay()]; // 요일 (짧은 영어)

//             case "EL": return weekEngName[d.getDay()]; // 요일 (긴 영어)

//             case "HH": return d.getHours().zf(2); // 시간 (24시간 기준, 2자리)

//             // eslint-disable-next-line
//             case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2); // 시간 (12시간 기준, 2자리)

//             case "mm": return d.getMinutes().zf(2); // 분 (2자리)

//             case "ss": return d.getSeconds().zf(2); // 초 (2자리)

//             case "a/p": return d.getHours() < 12 ? "오전" : "오후"; // 오전/오후 구분

//             default: return $1;

//         }

//     });

// };
const fillzero = (data) => {
    return data < 10 ? "0" + data.toString() : data.toString();
}
function formatDate(date){
    return date.getFullYear()+"-"+fillzero(date.getMonth()+1)+"-"+fillzero(date.getDay()+1)
}
 // eslint-disable-next-line
String.prototype.string = function (len) { var s = '', i = 0; while (i++ < len) { s += this; } return s; };
 // eslint-disable-next-line
String.prototype.zf = function (len) { return "0".string(len - length) + this; };
 // eslint-disable-next-line
Number.prototype.zf = function (len) { return toString().zf(len); };

axios.defaults.withCredentials = true;

const serverURL = process.env.REACT_APP_SERVERURL;
const styleData = {
    icon: {
        color: {
            gift: "MediumOrchid",
            request: "OliveDrab",
            bgm: "Sienna",
            sing: "SteelBlue",
        }
    },
    complete :{
        backgroundColor: "#DDDDDD",
        border: "solid 1px",
        borderColor: "#FFFFFF",
        cursor:"pointer",
    },
    remain: {
        border: "solid 1px",
        borderColor:"#FFFFFF",
        cursor:"pointer" 
    },    
    now: {
        backgroundColor: "MistyRose",
        border: "solid 1px",
        borderColor:"#FFFFFF",
        cursor:"pointer" 
    }
}

function getNow(){
    // const TIME_ZONE = 9 * 60 * 60 * 1000; // 9시간
    // const d = new Date();

    // return new Date(d.getTime() + TIME_ZONE);
    

    // 1. 현재 시간(Locale)
    const curr = new Date();

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

function getDate(date){
    // const TIME_ZONE = 9 * 60 * 60 * 1000; // 9시간
    // const d = new Date();

    // return new Date(d.getTime() + TIME_ZONE);
    

    // 1. 현재 시간(Locale)
    const curr = new Date(date);

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
const filterBefore = (date) => {
    return (date > getDate("2023-10-18 00:00:00"))
}

var getTextLength = function(str) {
    var len = 0;
    for (var i = 0; i < str.length; i++) {
        if (escape(str.charAt(i)).length === 6) {
            len++;
        }
        len++;
    }
    return len;
}



function requestPermission() {
    console.log("권한 요청 중...");
    if (Notification.permission !== 'granted') {
        try {
          Notification.requestPermission().then((permission) => {
            if (permission !== 'granted') return false;
          });
        } catch (error) {
          if (error instanceof TypeError) {
            Notification.requestPermission((permission) => {
              if (permission !== 'granted') return false;
            });
          } else {
            console.error(error);
          }
        }
        return false;
    } else {      
        console.log("알림 권한이 허용됨");
        return true;
    }
    // Notification.requestPermission().then((permission) => {
    //   if (permission === "granted") {
    //     console.log("알림 권한이 허용됨");
  
    //     // FCM 메세지 처리
    //   } else {
    //     console.log("알림 권한 허용 안됨");
    //   }
    // });
  }


// function getDateTime() {
//     const TIME_ZONE = 9 * 60 * 60 * 1000; // 9시간
//     const d = new Date();

//     const date = new Date(d.getTime() + TIME_ZONE).format('yyyy-MM-dd');
//     const time = d.toTimeString().split(' ')[0];

    
//     // console.log(date + ' ' + time);
//     return (date + ' ' + time);
// }

export default function SongViewTest(){
        
    const dispatch = useDispatch()

    const modalShow = useSelector((state) => state.windows.modal);
    const [alarm, setAlarm] = useState('outline-danger');
    // const [subscription, setSubscription] = useState(null);
    const [subscribeComponents, setSubscribeComponents] = useState(<PiBellLight />);
    // const loginComponents = useSelector((state) => state.statuses.loginComponents);    
    const [canLink, setCanLink] = useState(true);
    const session = useSelector((state) => state.statuses.session);
    const [songs, setSongs] = useState([]);
    // const [songsList, setSongsList] = useState("아직 입력된 음악이 없습니다");
    // const [compList, setCompList] = useState("아직 입력된 음악이 없습니다");
    const [compList2, setCompList2] = useState("아직 입력된 음악이 없습니다");
    // const [remainSongs, setRemainSongs] = useState("아직 입력된 음악이 없습니다");
    // const [nowSong, setNowSong] = useState("아직 입력된 음악이 없습니다");
    // const [moderatorUI, setModeratorUI] = useState(null);
    // const updateButton = useSelector((state) => state.statuses.updateButton);
    const live = useSelector((state) => state.statuses.live);
    const statusIndicator = useSelector((state) => state.statuses.statusIndicator)
    const [selectedDate, setSelectedDate] = useState(getNow());
    const [delay, setDelay] = useState(10000);
    const [newSong, setNewSong] = useState({
        proc: -1,
        singer: '',
        title: '',
        requester: '',
        isReaction: false,
        isRequest: false,
        isToSing: false,
        isComplete: false,
        dates: dateToString(getNow()),
    });

    // var refreshs = null;

    const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
        <button className="example-custom-input" onClick={onClick} ref={ref}>
          {value}
        </button>
    ));

    // const handleClose = () => dispatch(setCanvasStatus(false));
    const handleShow = () => dispatch(setCanvasStatus(true));

    const setModalShow = (value)=> dispatch(setModalShow(value));

    const changeCanLink = async () => {
        let canLinks = canLink ? false : true;
        setCanLink(canLinks);
    }

    const updateDate = async (date) => {
        setSelectedDate(date);
        setNewSong({
            ...newSong, dates: dateToString(date)
        });
        // console.log(dateToString(date));/
        await axios.post(serverURL+"status", { date: dateToString(date), withCredentials: true })
        .then((Response)=>{
            // console.log(Response);            
            setContents(Response);
        })
        .catch((Error)=>{console.log(Error)});
    }

    // const removeSong = async (id) => {        
    //     // console.log(id);
    //     let capsule = {
    //         where: {
    //             id:id
    //         }
    //     }
       
    //     axios.post(serverURL+"delsong", { where:capsule, dates: dateToString(selectedDate), withCredentials: true })
    //     .then((Response)=>{
    //         // console.log(Response.data);
    //         setContents(Response);
    //     })
    //     .catch((Error)=>{console.log(Error)});

    // }

    // const changeSong = (id, target, event) => {
    //     // console.log(id);
    //     // console.log(target);
    //     // console.log(event);
    //     let capsule = {
    //         data: {},
    //         where: {
    //             where: {
    //                 id: id,
    //             }
    //         }
    //     };
    //     switch(target){           
    //         case "singer":
    //             capsule.data.singer = event.target.value;
    //             break;
    //         case "title":
    //             capsule.data.title = event.target.value;
    //             break;
    //         case "requester":
    //             capsule.data.requester = event.target.value;
    //             break;
    //         case "isReaction":
    //             capsule.data.isReaction = event.target.checked;
    //             break;
    //         case "isRequest":
    //             capsule.data.isRequest = event.target.checked;
    //             break;
    //         case "isToSing":
    //             capsule.data.isToSing = event.target.checked
    //             break;            
    //         case "isComplete":
    //             capsule.data.isComplete = event.target.checked
    //             break;
    //         default:
    //             break;
    //     }        
    //     // setState(state);
    //     // console.log(capsule);
    //     // let data = [capsule];
    //     // console.log(data);
        
        
    //     axios.post(serverURL+"modifysong", { isArray: false, datas:capsule, dates: dateToString(selectedDate), withCredentials: true })
    //     .then((Response)=>{
    //         // console.log(Response.data);
    //         setContents(Response);
    //     })
    //     .catch((Error)=>{console.log(Error)});
    // }

    // const procChange = (id, action) => {
    //     let state = state;
    //     let buffer;
    //     // console.log(id);
    //     // console.log(action);
    //     switch(action){
    //         case "up":
    //             buffer = songs[id].proc;
    //             songs[id].proc = songs[id-1].proc;
    //             songs[id-1].proc = buffer;
    //             break;
    //         case "down":                                
    //             buffer = songs[id].proc;
    //             songs[id].proc = songs[id+1].proc;
    //             songs[id+1].proc = buffer;
    //             break;
    //         default:
    //             break;
    //     }
    //     // console.log(songs);
    //     let capsule = songs.map((item, index) => {
    //         return {
    //             where:{
    //                 where: {
    //                     id: item.id,
    //                 },
    //             },
    //             data: {                
    //                 proc: item.proc
    //             }                
    //         }
    //     });
    //     axios.post(serverURL+"modifysong", { isArray: true, datas:capsule, dates: selectedDate.format('yyyy-MM-dd'), withCredentials: true })
    //     .then((Response)=>{
    //         // console.log(Response.data);
    //         setContents(Response);
    //     })
    //     .catch((Error)=>{console.log(Error)});
    // }

    // const saveRequestSong = () => {        
        
    //     axios.post(serverURL+"addsong", { data:newSong , withCredentials: true })
    //     .then((Response)=>{
    //         // console.log(Response.data);
    //         setContents(Response);
    //     })
    //     .catch((Error)=>{console.log(Error)});

    // }

    const subscribe = async () => {
        let isSub = requestPermission();
        // const stringifiedNewSubscription = await newSubscription("BP8OAIzF06k935BX7pRgWmpp5Fjp5NhczrleLk5FpXUwF2MHLO3UjhdLarD42tTSixxhxr4X2O3VDweByFTZJCw"); //created in step 1; return a stringified subscription (no need to stringify it again)
        // await fetch(serverURL+'subscribe', {body: stringifiedNewSubscription})
        if(isSub){
            setSubscribeComponents(<PiBellRingingFill/>);
            setAlarm('outline-success');
            // setState((state) => {
            //     return {...state, subscribeComponents:<PiBellRingingFill/>, alarm: 'outline-success', }
            // })
        }
    }


    const onPopup = (url) => {
        if(canLink){
            window.open(url, "_blank", "noopener, noreferrer");
        }
    }

    const setContents = (Response) => {
        dispatch(setLive(Response.data.status.live? true : false));
        dispatch(setSession(Response.data.session.passport ? Response.data.session.passport.user : null));
        // dispatch(setUpdateButton(
        //     Response.data.session.passport ? (
        //         <Button key={Math.random()+selectedDate.toISOString()} variant='outline-primary' onClick={()=>updateStat()}>
        //             방송상태 업데이트
        //         </Button>
        //     ) : null
        // ))
        dispatch(setStatusIndicator(
            Response.data.status.live?true:false
        ))
        let now = true;
        setCompList2(
            Response.data.songs.length > 0 ? Response.data.songs.map((item, index, parent) => {    
           
                let isComplete = item.isComplete ? <PiCheckBold width={30} height={30}></PiCheckBold> : null;
                
                let isReaction = item.isReaction ? <PiGiftDuotone color={styleData.icon.color.gift}/> : null ;
                
                let isRequest = item.isRequest ? <PiClipboardTextDuotone color={styleData.icon.color.request} /> : null;
                let isToSing = item.isToSing ? <PiMicrophoneStageDuotone color={styleData.icon.color.sing} width={30} height={30} /> : <PiMusicNotesDuotone color={styleData.icon.color.bgm} width={30} height={30} />;
                let nowPlaying = null ;
                let nowplayingid = "songs";
                let endBG = isComplete ? styleData.complete : styleData.remain;
                let titleShow = getTextLength(item.title) > 21 ? <marquee // eslint-disable-line jsx-a11y/no-distracting-elements
                >{ item.title }</marquee> : item.title;
                if(!item.isComplete && now){
                    now = false;
                    nowPlaying = <PiCaretRightBold color='red'></PiCaretRightBold>;
                    nowplayingid = "nowPlaying";
                    endBG = styleData.now;
                }
                
                // let songData = item.singer +" - "+ item.title;
                let size = 50;
                let thumbnail = item.thumbnail1.length > 0 ? item.thumbnail1 + size + item.thumbnail2 : item.thumbnail2;           

                                        
                return (
                    <ListGroup.Item as="li" key={Math.random()+selectedDate.toISOString()} style={endBG} onClick={() => onPopup(item.video)}>
                        <Container tabIndex={0} id={nowplayingid} style={{padding: "0px"}}>
                            <Row>                            
                                <Col aria-rowspan={2} xs={2} className='playlistCell center'>
                                    <img src ={thumbnail} width={size} height={size} alt='thumbnail'/>
                                </Col>
                                <Col aria-rowspan={2} xs={3} className='playlistCell center'>
                                { nowPlaying }{ isReaction }{ isRequest }{ isToSing } { isComplete }
                                </Col>
                                <Col xs={7} className='playlistCell'>
                                    <Container style={{margin: "0"}}>
                                        <Row>
                                            <Col className='playlistCell' align="left">
                                                { titleShow }
                                            </Col>
                                        </Row>                                    
                                        <Row>
                                            <Col xs={6} className='playlistCell singer' align="left">
                                                { item.singer }
                                            </Col>
                                            <Col xs={6} className='playlistCell request' align="center">
                                            <b> {item.requester} </b>
                                            </Col>
                                        </Row>
                                    </Container>
                                </Col>
                            </Row>
                        </Container>
                    </ListGroup.Item>
                );
            }) : <h6 className="center" style={{color: "#888888"}}>남은 노래가 없어요~ <span style={{color:"orange"}}>신청곡</span> 많이 많이 부탁드려요♡</h6>
        );

        setSongs(Response.data.songs.length > 0 ? Response.data.songs : []);
        // newSong = {
        //     proc: songs.length+1,
        //     singer: '',
        //     title: '',
        //     requester: '',
        //     isReaction: false,
        //     isRequest: false,
        //     isToSing: false,
        //     isComplete: false,
        //     dates: selectedDate.format('yyyy-MM-dd'),
        // }
        if(document.getElementById("nowPlaying")) document.getElementById("nowPlaying").scrollIntoView();
        // setState(state, () => {
        //     // console.log(state);            
        //     // console.log();
        //     if(document.getElementById("nowPlaying")) document.getElementById("nowPlaying").scrollIntoView();
        // });
    } 

    const updateStat = () => {
        
        axios.post(serverURL+"updateStat", { 
            date: formatDate(getNow()),
            withCredentials: true,
        })
        .then((Response)=>{
            // console.log(Response.data);            
            setContents(Response);
        })
        .catch((Error)=>{console.log(Error)});
    }

    // const updateState = (target, event) => {
    //     // console.log(event.target.value);        
    //     let check = false;
    //     switch(target){
    //         case "date":                
    //             setSelectedDate(event.target.value);
    //             setNewSong({...newSong, dates: event.target.value.toISOString().split('T')[0]});
    //             break;
    //         case "singer":
    //             setNewSong({...newSong, singer: event.target.value});                
    //             break;
    //         case "title":
    //             setNewSong({...newSong, singer: event.target.value});
    //             break;
    //         case "requester":
    //             setNewSong({...newSong, singer: event.target.value});
    //             break;
    //         case "isReaction":
    //             check = newSong.isReaction? false : true;
    //             setNewSong({...newSong, isReaction: check});
    //             break;
    //         case "isRequest":
    //             check = newSong.isRequest? false : true;
    //             setNewSong({...newSong, isRequest: check});
    //             break;
    //         case "isToSing":
    //             check = newSong.isToSing? false : true;
    //             setNewSong({...newSong, isToSing: check});
    //             break;            
    //         case "isComplete":
    //             check = newSong.isComplete? false : true;
    //             setNewSong({...newSong, isComplete: check});
    //             break;
    //         default:
    //             break;
    //     }        
    //     // setState(state);
    // }
    const urlBase64ToUint8Array = (base64String) => {
        const padding = "=".repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
          .replace(/-/g, "+")
          .replace(/_/g, "/");
    
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
    
        for (let i = 0; i < rawData.length; ++i) {
          outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
      }

    
    useEffect( () => {
        async function init() {
            // console.log(Notification.permission !== 'granted')
            if(Notification.permission === 'granted'){
                // Register a Service Worker.
                navigator.serviceWorker.register('sw.js');

                navigator.serviceWorker.ready
                .then((registration) => {
                    // Use the PushManager to get the user's subscription to the push service.
                    return registration.pushManager.getSubscription()
                    .then(async (subscription) => {
                        // If a subscription was found, return it.
                        if (subscription) {
                            return subscription;
                        }

                        // Get the server's public key
                        const vapidKeys = {
                            // "publicKey":"BJmhOhNdNjrMn4DDoVoYUqnETkU76M0ceBn0WBN5r_ex1fCHJ_rDoCcOiwNcnxaOoT1xYQUJwWCMyYMGCQqP1Ro",
                            // "privateKey":"yOWYs0w1PH0qx5vFeN4ssFj1UF6px3NcoT3qMyG_bKc",
                            "publickey":"BP8OAIzF06k935BX7pRgWmpp5Fjp5NhczrleLk5FpXUwF2MHLO3UjhdLarD42tTSixxhxr4X2O3VDweByFTZJCw",
                            "privatekey":"O9O6fFRrX16X0WMz1n5nIeyeyb63M0pRyhfmWpbhj1U"    
                        }
                        // const response = await fetch('./vapidPublicKey');
                        // const vapidPublicKey = await response.text();
                        // Chrome doesn't accept the base64-encoded (string) vapidPublicKey yet
                        // urlBase64ToUint8Array() is defined in /tools.js
                        const convertedVapidKey = urlBase64ToUint8Array(vapidKeys.publickey);

                        // Otherwise, subscribe the user (userVisibleOnly allows to specify that we don't plan to
                        // send notifications that don't have a visible effect for the user).
                        return registration.pushManager.subscribe({
                            userVisibleOnly: true,
                            applicationServerKey: convertedVapidKey
                        });
                    });
                }).then(async (subscription) => {
                // Send the subscription details to the server using the Fetch API.
                    // fetch('./register', {
                    //     method: 'post',
                    //     headers: {
                    //         'Content-type': 'application/json'
                    //     },
                    //     body: JSON.stringify({
                    //         subscription: subscription
                    //     }),
                    // });
                    await axios.post(
                        serverURL+"register", { data: subscription, withCredentials:true }
                    ).then(()=>{
                    
                    })
                    .catch((Error)=>{console.log(Error)});
                    // setSubscription(subscription)
                    subscribe()//.then(()=>subscribe());
                    // setState((state) => {
                    //     return { ...state, subscription:subscription}
                    // }, () => {
                    //     // console.log(subscription);
                    //     subscribe();
                    // })           
                });
            }       
            await axios.post(serverURL+"status", { date: getNow().toISOString().split('T')[0] })
            .then((Response)=>{
                // console.log(Response.data.session.passport);
                // Response.data.            
                setContents(Response);
                requestPermission();
            })
            .catch((Error)=>{console.log(Error)});
        }
        init();
    }, []);

    useEffect(()=>{
        if(!session){
            dispatch(setLoginComponents(false))
            
        } else {
            dispatch(setLoginComponents(true));
            // setState((state)=> {
            //     return { ...state, loginComponents: <Profile></Profile> }
            // })
            // console.log(JSON.parse(session.refToken));           
        }
    },[session]);

    useEffect(()=>{
        
        // console.log(dateToString(selectedDate));
        // console.log(dateToString(getKST(getNow())));
        // console.log(dateToString(selectedDate) == dateToString(getKST(getNow())));
        if(dateToString(selectedDate) === dateToString(getKST(getNow()))){            
            console.log("Refresh required!");
            setDelay(10000);
        } else {
            console.log("Clear refresh.");
            setDelay(null);
        }
        
    },[selectedDate]);

    useInterval(async () => {
        // console.log(dateToString(selectedDate));
        await axios.post(serverURL+"status", { date: dateToString(selectedDate), withCredentials: true })
        .then((Response)=>{
            // console.log(Response.data);
            // console.log(state);   
            if((Object.entries(Response.data.status.live).toString() !== Object.entries(live).toString())
            ||
            (Object.entries(Response.data.songs).toString() !== Object.entries(songs).toString())
            ){
            console.log("update!");  
            }
            setContents(Response);
        })
        .catch((Error)=>{console.log(Error)});
    }, delay);

    const sizes = "30";
    // render(){    
        return (
            <>
                <Container className='bodyContainer'>
                    <Row>
                        <Col xs={3} className="center" style={{ 
                            backgroundColor: 'WhiteSmoke', 
                        }}>
                            { statusIndicator?<Online width={sizes} height={sizes}></Online> : <Offline width={sizes} height={sizes}></Offline> }
                            <Button variant={alarm} onClick={()=>{subscribe()}}>{ subscribeComponents } </Button>
                        </Col>
                        <Col xs={6} style={{ 
                            backgroundColor: 'WhiteSmoke', 
                        }}>
                            <DatePicker
                                selected={selectedDate}
                                onChange={date => updateDate(date)} 
                                locale={ko}
                                startDate={getDate("2023-10-19 00:00:00")}
                                filterDate={filterBefore}
                                dateFormat="yyyy년 MM월 dd일"
                                customInput={<ExampleCustomInput />}
                            />
                        </Col>
                        <Col xs={3} className="center" style={{ 
                            backgroundColor: 'WhiteSmoke', 
                        }}>
                            <Button variant="primary" onClick={handleShow}>
                                <RxHamburgerMenu></RxHamburgerMenu>
                            </Button>                            
                        </Col>                        
                    </Row>
                </Container>
                <Container style={{ 
                                backgroundColor: 'WhiteSmoke', 
                            }}>
                    
                    <Row className="justify-content-md-center">
                        <Col>
                            <Container>                                
                                <Row>
                                    <Col style={{ 
                                        backgroundColor: 'WhiteSmoke', 
                                    }}>
                                        <h3>Playlist</h3>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="justify-content-end" style={{ 
                                        backgroundColor: 'WhiteSmoke', 
                                    }}>
                                        <PiGiftDuotone color={styleData.icon.color.gift} /> : 리액션 / <PiClipboardTextDuotone color={styleData.icon.color.request} /> : 신청곡 <br />
                                        <PiMusicNotesDuotone color={styleData.icon.color.bgm} /> : 틀어주는 노래 / <PiMicrophoneStageDuotone color={styleData.icon.color.sing} /> : 불러주는 노래 <br />
                                        (리액션이 우선이므로 순서는 조정될 수 있습니다)
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="justify-content-end" style={{ 
                                        backgroundColor: 'WhiteSmoke', 
                                    }}>
                                        <Form.Check // prettier-ignore
                                        type="switch"
                                        id="canLink"
                                        checked={canLink}                                        
                                        onChange={()=>{changeCanLink()}}
                                        label="클릭하여 노래재생"
                                        aria-label="클릭하여 노래재생"
                                        className='center'
                                    />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col width="100%" style={{height: (window.innerHeight*0.65), overflow: "auto"}}>
                                        <ListGroup as="ul" className='d-flex'>
                                            { compList2 }
                                        </ListGroup>
                                    </Col>
                                </Row>
                            </Container>                         
                            
                        </Col>
                    </Row>
                </Container>
                <Modal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                        알림은 설정 하셨나요?
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Footer>
                        <Link to="/guide"><Button variant="primary">알림 설정법 보러가기</Button></Link>
                    </Modal.Footer>
                </Modal>            
            </>
        );
    // }
}

// // 숫자를 넘겨받아 서수형 문자열 반환
// function convertOrdinalNumber(n)
// {
//     n = parseInt(n, 10);
//     const suffix = ['th', 'st', 'nd', 'rd'];
//     const mod100 = n % 100;

//     return n+(suffix[(mod100-20)%10] || suffix[mod100] || suffix[0]);
// }

// function urlBase64ToUint8Array (base64String) {
//     const padding = "=".repeat((4 - base64String.length % 4) % 4);
//     const base64 = (base64String + padding)
//       .replace(/-/g, "+")
//       .replace(/_/g, "/");

//     const rawData = window.atob(base64);
//     const outputArray = new Uint8Array(rawData.length);

//     for (let i = 0; i < rawData.length; ++i) {
//       outputArray[i] = rawData.charCodeAt(i);
//     }
//     return outputArray;
//   }

