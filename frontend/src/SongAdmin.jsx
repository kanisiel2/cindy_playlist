import React, { forwardRef, useEffect, useState, useCallback } from 'react';
import { BrowserView, MobileView } from 'react-device-detect';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import { FaTrash } from 'react-icons/fa6'; //FaChevronUp, FaChevronDown,
import { ReactComponent as Online } from './online.svg';
import { ReactComponent as Offline } from './offline.svg';

import axios from 'axios';
import SortableList, { SortableItem, SortableKnob } from 'react-easy-sort'
// import arrayMove from 'array-move';
import { arrayMoveImmutable } from 'array-move';


import { ko } from 'date-fns/esm/locale';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
    PiArrowsOutCardinalBold,
    PiNotePencilDuotone 
 } from 'react-icons/pi';

import Profile from './Profile';

import { useSelector, useDispatch } from 'react-redux';
import { setCanvasStatus } from './redux/windowSlice';
import { setLive, setSession, setStatusIndicator, setUpdateButton, setLoginComponents } from './redux/statusSlice';

import {RxHamburgerMenu} from 'react-icons/rx';
// import RequestIcon from "./request.png";
// import BGMIcon from "./BGM.png";
// import ReactionIcon from "./REACTION.png";
// import nowIcon from "./now.png";

axios.defaults.withCredentials = true;
const serverURL = process.env.REACT_APP_SERVERURL;
// eslint-disable-next-line
Date.prototype.format = function (f) {

    if (!valueOf()) return " ";



    var weekKorName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];

    var weekKorShortName = ["일", "월", "화", "수", "목", "금", "토"];

    var weekEngName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    var weekEngShortName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    var d = this;



    return f.replace(/(yyyy|yy|MM|dd|KS|KL|ES|EL|HH|hh|mm|ss|a\/p)/gi, function ($1) {
        let h;
        switch ($1) {

            case "yyyy": return d.getFullYear(); // 년 (4자리)

            case "yy": return (d.getFullYear() % 1000).zf(2); // 년 (2자리)

            case "MM": return (d.getMonth() + 1).zf(2); // 월 (2자리)

            case "dd": return d.getDate().zf(2); // 일 (2자리)

            case "KS": return weekKorShortName[d.getDay()]; // 요일 (짧은 한글)

            case "KL": return weekKorName[d.getDay()]; // 요일 (긴 한글)

            case "ES": return weekEngShortName[d.getDay()]; // 요일 (짧은 영어)

            case "EL": return weekEngName[d.getDay()]; // 요일 (긴 영어)

            case "HH": return d.getHours().zf(2); // 시간 (24시간 기준, 2자리)

            // eslint-disable-next-line
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2); // 시간 (12시간 기준, 2자리)

            case "mm": return d.getMinutes().zf(2); // 분 (2자리)

            case "ss": return d.getSeconds().zf(2); // 초 (2자리)

            case "a/p": return d.getHours() < 12 ? "오전" : "오후"; // 오전/오후 구분

            default: return $1;

        }

    });

};
 // eslint-disable-next-line
String.prototype.string = function (len) { var s = '', i = 0; while (i++ < len) { s += this; } return s; };
 // eslint-disable-next-line
String.prototype.zf = function (len) { return "0".string(len - length) + this; };
 // eslint-disable-next-line
Number.prototype.zf = function (len) { return toString().zf(len); };
// const fillzero = (data) => {
//     return data < 10 ? "0" + data.toString() : data.toString();
// }
// function formatDate(date){
//     return date.getFullYear()+"-"+fillzero(date.getMonth()+1)+"-"+fillzero(date.getDay()+1)
// }
const styleData = {
    icon: {
        color: {
            gift: "MediumOrchid",
            request: "OliveDrab",
            bgm: "Sienna",
            sing: "SteelBlue",
        }
    },
    capsule :{
        backgroundColor: "HoneyDew",
        border: "solid 1px",
        borderColor: "DarkOliveGreen",
        cursor:"pointer",
        margin: "3 3 0",
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

// function getDate(date){
//     // const TIME_ZONE = 9 * 60 * 60 * 1000; // 9시간
//     // const d = new Date();

//     // return new Date(d.getTime() + TIME_ZONE);
    

//     // 1. 현재 시간(Locale)
//     const curr = new Date(date);

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
// const filterBefore = (date) => {
//     return (date > getDate("2023-10-18 00:00:00"))
// }

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

//     const date = new Date(d.getTime() + TIME_ZONE).toISOString().split('T')[0];
//     const time = d.toTimeString().split(' ')[0];

    
//     // console.log(date + ' ' + time);
//     return (date + ' ' + time);
// }

export default function SongAdmin () {

    const dispatch = useDispatch()

    // const modalShow = useSelector((state) => state.windows.modal);
    const [modifyShow, setModifyShow] = useState(false);
    const [modifyTarget, setModifyTarget] = useState({});
    // const [alarm, setAlarm] = useState('outline-danger');
    // const [subscription, setSubscription] = useState(null);
    // const [subscribeComponents, setSubscribeComponents] = useState(<PiBellLight />);
    // const loginComponents = useSelector((state) => state.statuses.loginComponents);    
    // eslint-disable-next-line
    const [canLink, setCanLink] = useState(true);
    const session = useSelector((state) => state.statuses.session);
    // eslint-disable-next-line
    var songs = [];
    const [song, setSong] = useState([]);
    const [songsList, setSongsList] = useState("아직 입력된 음악이 없습니다");
    const [songsListM, setSongsListM] = useState("아직 입력된 음악이 없습니다");
    // const [compList, setCompList] = useState("아직 입력된 음악이 없습니다");
    // eslint-disable-next-line
    const [compList2, setCompList2] = useState("아직 입력된 음악이 없습니다");
    // const [moderatorUI, setModeratorUI] = useState(null);
    // const updateButton = useSelector((state) => state.statuses.updateButton);
    // const live = useSelector((state) => state.statuses.live);
    const statusIndicator = useSelector((state) => state.statuses.statusIndicator)
    const [selectedDate, setSelectedDate] = useState(getNow());
    const [newSong, setNewSong] = useState({
        proc: -1,
        singer: '',
        title: '',
        requester: '',
        isReaction: false,
        isRequest: false,
        isToSing: false,
        isComplete: false,
        dates: null,
    });

    const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
        <button className="example-custom-input" onClick={onClick} ref={ref}>
          {value}
        </button>
    ));

    // onSortEnd = (oldIndex, newIndex) => {
    //     setItems((array) => arrayMoveImmutable(array, oldIndex, newIndex))
    // }

    // const handleClose = () => dispatch(setCanvasStatus(false));
    const handleShow = () => dispatch(setCanvasStatus(true));

    const onSortEnd = async (oldIndex, newIndex) => {
        console.log(song);
        let song2 = arrayMoveImmutable(song, oldIndex, newIndex);
        
        let newArray = song2.map((item, index) => {
            item.proc = (index+1);
            return item;
        }); 
        console.log(newArray);
        await axios.post(serverURL+"modifysong", { isArray: true, sortable:true, datas:newArray, dates: dateToString(selectedDate), withCredentials: true })
        .then(async (Response)=>{
            console.log(Response.data);
            await setContents(Response);
        })
        .catch((Error)=>{console.log(Error)});
        
    };

    // const changeCanLink = async () => {
    //     canLink = canLink ? false : true;
    //     setCanLink(canLink);
    // }
    const dateToString = (date) => {
        let datestrings = getKST(date).toLocaleString('ko-KR').substring(0,12).replace(". ", "-").replace(". ", "-").replace(".", "").split("-");        
        datestrings = datestrings.map((item)=> {
            if(item*1<10){
                return "0"+item;
            } else {
                return item;
            }
        })
        return datestrings.join("-");
    }

    const updateDate = async (date) => {
        setSelectedDate(date);    
        setNewSong({
            ...newSong, dates: dateToString(date)
        });
        console.log(dateToString(date));
        // console.log(date);
        await axios.post(serverURL+"status", { date: dateToString(date), withCredentials: true })
        .then((Response)=>{
            // console.log(Response);            
            setContents(Response);
        })
        .catch((Error)=>{console.log(Error)});
    }



    const saveRequestSong = () => {  
        console.log(dateToString(selectedDate));      
        axios.post(serverURL+"addsong", { data:newSong, dates: dateToString(selectedDate), withCredentials: true })
        .then((Response)=>{
            // console.log(Response.data);
            setContents(Response);
            setNewSong({
                proc: Response.data.songs.length+1,
                singer: '',
                title: '',
                requester: '',
                isReaction: false,
                isRequest: false,
                isToSing: false,
                isComplete: false,
            })
        })
        .catch((Error)=>{console.log(Error)});

    }


    const onPopup = useCallback((url) => {
        if(canLink){
            window.open(url, "_blank", "noopener, noreferrer");
        }
    },[canLink]);
    
    // const sendPush = () => {
    //     axios.post(serverURL+"push", { data:{title:"", body:""} , withCredentials: true })
    //     .then((Response)=>{
    //         // console.log(Response.data);            
    //     })
    //     .catch((Error)=>{console.log(Error)});
    // }

    // const sendPost = () => {
    //     axios.post(serverURL+"tiktok/callback", { data:{title:"", body:""} , withCredentials: true })
    //     .then((Response)=>{
    //         // console.log(Response.data);            
    //     })
    //     .catch((Error)=>{console.log(Error)});
    // }

    const modifyFunc = (item) => {
        // console.log(item);
        setModifyShow(true);
        setModifyTarget(item);
    }

    

    const setContents = async (Response) => {        
        dispatch(setLive(Response.data.status.live? true : false));
        dispatch(setSession(Response.data.session.passport ? Response.data.session.passport.user : null));
        // dispatch(setUpdateButton(
        //     Response.data.session.passport.user ? (
        //         <Button key={Math.random()+selectedDate.toISOString()} variant='outline-primary' onClick={()=>updateStat()}>
        //             방송상태 업데이트
        //         </Button>
        //     ) : null
        // ))
        let sizes = "30";
        dispatch(setStatusIndicator(
            Response.data.status.live?true:false
        ))
        // songs = Response.data.songs;
        setSong(Response.data.songs);
        setSongsListM(
            Response.data.songs.length > 0 ? Response.data.songs.map((item, index, parent) => {       
                return (
                    <SortableItem key={Math.random()+selectedDate.toISOString()} index={index} style={styleData.capsule}>
                        <Container className="item" tabIndex={0} id="SongListdiv" style={styleData.capsule}> 
                            <Row>
                                <Col xs={1} className='center'>
                                    {item.proc}
                                </Col>
                                <Col xs={10} className='center'>
                                    <Container>
                                        <Row className="d-flex">
                                            <Col xs={10} className='center'>
                                                {item.title}<br/>
                                                {item.singer}
                                            </Col>
                                            <Col xs={2} className='center'>
                                                <Button onClick={()=>modifyFunc(item)}><PiNotePencilDuotone  color={"YellowGreen"} /></Button>
                                            </Col>                                            
                                        </Row>
                                        <Row className="d-flex">
                                            <Col xs={6} className='center'>
                                                {item.requester}
                                            </Col>
                                            <Col xs={4} className='center'>
                                                <PiGiftDuotone color={item.isReaction?styleData.icon.color.gift:"Silver"} />
                                                <PiClipboardTextDuotone color={item.isRequest?styleData.icon.color.request:"Silver"} />
                                                <PiMicrophoneStageDuotone color={item.isToSing?styleData.icon.color.sing:"Silver"} />
                                                <PiCheckBold width={30} height={30} color={item.isComplete?"Red":"Silver"}/>
                                            </Col>
                                            <Col xs={2} className="noPadding center">
                                                <Button variant="outline-danger" className={item.id} onClick={() => removeSong(item.id)}><FaTrash/></Button>
                                            </Col>
                                        </Row>
                                    </Container>
                                </Col>                                
                                <Col xs={1} className="noPadding center">
                                    <SortableKnob>
                                        <Button size='sm' variant="outline-primary" className={item.id} ><PiArrowsOutCardinalBold/></Button>
                                    </SortableKnob>
                                </Col>                                
                            </Row>
                        </Container>
                    </SortableItem>
                );
            }):<h6 className="center" style={{color: "#888888"}}>남은 노래가 없어요~ <span style={{color:"orange"}}>신청곡</span> 많이 많이 부탁드려요♡</h6>
        );
        setSongsList(
            Response.data.songs.length > 0 ? Response.data.songs.map((item, index, parent) => {       
                return (
                    <SortableItem key={Math.random()+selectedDate.toISOString()} index={index} style={styleData.capsule}>
                        <Container className="item" tabIndex={0} id="SongListdiv" style={styleData.capsule}> 
                            <Row key={Math.random()+selectedDate.toISOString()}>
                                <Col xl={1} className='noPadding center'>
                                    {convertOrdinalNumber(item.proc)}
                                </Col>
                                <Col xl={3} className='noPadding center'>
                                    <Container>
                                        <Row>
                                            <Col xl={5} className='noPadding'>
                                                <Form.Control
                                                    placeholder="가수"
                                                    aria-label="가수"
                                                    aria-describedby="singer"
                                                    value={item.singer}
                                                    onChange={(e)=>{changeSong(item.id, "singer", e)}}
                                                />
                                            </Col>
                                            <Col className='noPadding center'>                                
                                            -
                                            </Col>
                                            <Col xl={6} className='noPadding'>
                                                <Form.Control
                                                    placeholder="제목"
                                                    aria-label="제목"
                                                    aria-describedby="title"
                                                    value={item.title}
                                                    onChange={(e)=>{changeSong(item.id, "title", e)}}
                                                />
                                            </Col>
                                        </Row>
                                    </Container>
                                </Col>
                                <Col xl={2} className='noPadding center'>
                                    <Container>
                                        <Row>
                                            <Col className='noPadding center'>                                
                                            신청 : 
                                            </Col>
                                            <Col xl={8} className='noPadding'>
                                                <Form.Control
                                                    placeholder="신청자"
                                                    aria-label="신청자"
                                                    aria-describedby="requester"
                                                    value={item.requester}
                                                    onChange={(e)=>{changeSong(item.id, "requester", e)}}
                                                />
                                            </Col>
                                        </Row>
                                    </Container>
                                </Col>
                                <Col xl={1} className='noPadding center'>
                                    <Container>
                                        <Row>
                                            <Col className='noPadding'>
                                                <Form.Check // prettier-ignore
                                                    type="switch"
                                                    id="isReaction"
                                                    checked={item.isReaction}
                                                    onChange={(e)=>{changeSong(item.id, "isReaction", e)}}
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className='noPadding'>
                                                리액션
                                            </Col>
                                        </Row>
                                    </Container>                        
                                </Col>
                                <Col xl={1} className='noPadding center'>
                                    <Container>
                                        <Row>
                                            <Col className='noPadding'>
                                                <Form.Check // prettier-ignore
                                                    type="switch"
                                                    id="isRequest"
                                                    checked={item.isRequest}
                                                    onChange={(e)=>{changeSong(item.id, "isRequest", e)}}
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className='noPadding'>
                                                신청곡
                                            </Col>
                                        </Row>
                                    </Container>                        
                                </Col>
                                <Col xl={1} className='noPadding center'>
                                    <Container>
                                        <Row>
                                            <Col className='noPadding'>
                                                <Form.Check // prettier-ignore
                                                    type="switch"
                                                    id="isToSing"
                                                    checked={item.isToSing}
                                                    onChange={(e)=>{changeSong(item.id, "isToSing", e)}}
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className='noPadding'>
                                                부를노래
                                            </Col>
                                        </Row>
                                    </Container>                        
                                </Col>
                                <Col xl={1} className='noPadding center'>
                                    <Container>
                                        <Row>
                                            <Col className='noPadding'>
                                                <Form.Check // prettier-ignore
                                                    type="switch"
                                                    id="isComplete"
                                                    checked={item.isComplete}
                                                    onChange={(e)=>{changeSong(item.id, "isComplete", e)}}
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className='noPadding'>
                                                완료된 곡
                                            </Col>
                                        </Row>
                                    </Container>                         
                                </Col>
                                <Col xl={1} className='noPadding center'>
                                    <Button variant="outline-danger" className={item.id} onClick={() => removeSong(item.id)}><FaTrash/></Button>
                                </Col>
                                <Col xl={1} className='noPadding center'>
                                    <Container>
                                        <Row>
                                            <Col className='noPadding'>
                                                <SortableKnob>
                                                    <Button size='sm' variant="outline-primary" className={item.id} ><PiArrowsOutCardinalBold/></Button>
                                                </SortableKnob>
                                            </Col>
                                        </Row>                                    
                                    </Container>                        
                                </Col>
                            </Row>
                        </Container>
                    </SortableItem>
                );
            }):<h6 className="center" style={{color: "#888888"}}>남은 노래가 없어요~ <span style={{color:"orange"}}>신청곡</span> 많이 많이 부탁드려요♡</h6>
        );   
        
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

        // songs = Response.data.songs.length > 0 ? Response.data.songs : [];
        setNewSong({
            ...newSong,
            proc: Response.data.songs.length+1,
            singer: '',
            title: '',
            requester: '',
            isReaction: false,
            isRequest: false,
            isToSing: false,
            isComplete: false,
        })
        if(document.getElementById("nowPlaying")) document.getElementById("nowPlaying").scrollIntoView();
        // setState(state, () => {
        //     // console.log(state);            
        //     // console.log();
        //     if(document.getElementById("nowPlaying")) document.getElementById("nowPlaying").scrollIntoView();
        // });
    };

    

    const updateState = (target, event) => {
        let check = false;
        switch(target){
            case "singer":
                setNewSong({...newSong, singer: event.target.value});                
                break;
            case "title":
                setNewSong({...newSong, title: event.target.value});
                break;
            case "requester":
                setNewSong({...newSong, requester: event.target.value});
                break;
            case "isReaction":
                check = newSong.isReaction? false : true;
                setNewSong({...newSong, isReaction: check});
                break;
            case "isRequest":
                check = newSong.isRequest? false : true;
                setNewSong({...newSong, isRequest: check});
                break;
            case "isToSing":
                check = newSong.isToSing? false : true;
                setNewSong({...newSong, isToSing: check});
                break;            
            case "isComplete":
                check = newSong.isComplete? false : true;
                setNewSong({...newSong, isComplete: check});
                break;
            default:
                break;
        }        
        // setState(state);
    }

    
    const removeSong = async (id) => {        
        // console.log(id);
        let capsule = {
            where: {
                id:id
            }
        }
       
        axios.post(serverURL+"delsong", { where:capsule, dates: dateToString(selectedDate), withCredentials: true })
        .then((Response)=>{
            // console.log(Response.data);
            setContents(Response);
        })
        .catch((Error)=>{console.log(Error)});

    // eslint-disable-next-line no-use-before-define
    };

    const updateStat = () => {
        
        axios.post(serverURL+"updateStat", { 
            date: dateToString(getNow()),
            withCredentials: true,
        })
        .then((Response)=>{
            // console.log(Response.data);            
            setContents(Response);
        })
        .catch((Error)=>{console.log(Error)});
    // eslint-disable-next-line no-use-before-define
    };

    const changeTarget = (target, event) => {

        switch(target){           
            case "singer":
                setModifyTarget({
                    ...modifyTarget,
                    singer: event.target.value
                });
                break;
            case "title":
                setModifyTarget({
                    ...modifyTarget,
                    title: event.target.value
                });
                break;
            case "requester":
                setModifyTarget({
                    ...modifyTarget,
                    requester: event.target.value
                });
                break;
            case "isReaction":
                setModifyTarget({
                    ...modifyTarget,
                    isReaction: event.target.checked
                });
                break;
            case "isRequest":
                setModifyTarget({
                    ...modifyTarget,
                    isRequest: event.target.checked
                });
                break;
            case "isToSing":
                setModifyTarget({
                    ...modifyTarget,
                    isToSing: event.target.checked
                });
                break;            
            case "isComplete":
                setModifyTarget({
                    ...modifyTarget,
                    isComplete: event.target.checked
                });
                break;
            default:
                break;
        }        
    }

    const saveTarget = () => {
        let capsule = {
            data: {
                singer: modifyTarget.singer,
                title: modifyTarget.title,
                requester: modifyTarget.requester,
                isReaction: modifyTarget.isReaction,
                isRequest: modifyTarget.isRequest,
                isToSing: modifyTarget.isToSing,
                isComplete: modifyTarget.isComplete,
            },
            where: {
                where: {
                    id: modifyTarget.id,
                }
            }
        };
        axios.post(serverURL+"modifysong", { isArray: false, datas:capsule, dates: dateToString(selectedDate), withCredentials: true })
        .then((Response)=>{
            // console.log(Response.data);
            setContents(Response);
            setModifyShow(false);
        })
        .catch((Error)=>{console.log(Error)});
    }

    const changeSong = (id, target, event) => {
        // console.log(id);
        // console.log(target);
        // console.log(event);
        let capsule = {
            data: {},
            where: {
                where: {
                    id: id,
                }
            }
        };
        switch(target){           
            case "singer":
                capsule.data.singer = event.target.value;
                break;
            case "title":
                capsule.data.title = event.target.value;
                break;
            case "requester":
                capsule.data.requester = event.target.value;
                break;
            case "isReaction":
                capsule.data.isReaction = event.target.checked;
                break;
            case "isRequest":
                capsule.data.isRequest = event.target.checked;
                break;
            case "isToSing":
                capsule.data.isToSing = event.target.checked
                break;            
            case "isComplete":
                capsule.data.isComplete = event.target.checked
                break;
            default:
                break;
        }        
        // setState(state);
        // console.log(capsule);
        // let data = [capsule];
        // console.log(data);
        
        
        axios.post(serverURL+"modifysong", { isArray: false, datas:capsule, dates: dateToString(selectedDate), withCredentials: true })
        .then((Response)=>{
            // console.log(Response.data);
            setContents(Response);
        })
        .catch((Error)=>{console.log(Error)});
    // eslint-disable-next-line no-use-before-define
    };

    // const urlBase64ToUint8Array = (base64String) => {
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
    // }
    
    useEffect( () => {
        async function init() {
            // setSelectedDate(getKST(new Date()));
            // setNewSong({
            //     ...newSong,
            //     dates: dateToString(getKST(new Date()))
            // })
            // if(Notification.permission === 'granted'){
            //     // Register a Service Worker.
            //     navigator.serviceWorker.register('sw.js');

            //     navigator.serviceWorker.ready
            //     .then((registration) => {
            //         // Use the PushManager to get the user's subscription to the push service.
            //         return registration.pushManager.getSubscription()
            //         .then(async (subscription) => {
            //             // If a subscription was found, return it.
            //             if (subscription) {
            //                 return subscription;
            //             }

            //             // Get the server's public key
            //             const vapidKeys = {
            //                 // "publicKey":"BJmhOhNdNjrMn4DDoVoYUqnETkU76M0ceBn0WBN5r_ex1fCHJ_rDoCcOiwNcnxaOoT1xYQUJwWCMyYMGCQqP1Ro",
            //                 // "privateKey":"yOWYs0w1PH0qx5vFeN4ssFj1UF6px3NcoT3qMyG_bKc",
            //                 "publickey":"BP8OAIzF06k935BX7pRgWmpp5Fjp5NhczrleLk5FpXUwF2MHLO3UjhdLarD42tTSixxhxr4X2O3VDweByFTZJCw",
            //                 "privatekey":"O9O6fFRrX16X0WMz1n5nIeyeyb63M0pRyhfmWpbhj1U"    
            //             }
            //             // const response = await fetch('./vapidPublicKey');
            //             // const vapidPublicKey = await response.text();
            //             // Chrome doesn't accept the base64-encoded (string) vapidPublicKey yet
            //             // urlBase64ToUint8Array() is defined in /tools.js
            //             const convertedVapidKey = urlBase64ToUint8Array(vapidKeys.publickey);

            //             // Otherwise, subscribe the user (userVisibleOnly allows to specify that we don't plan to
            //             // send notifications that don't have a visible effect for the user).
            //             return registration.pushManager.subscribe({
            //                 userVisibleOnly: true,
            //                 applicationServerKey: convertedVapidKey
            //             });
            //         });
            //     }).then(async (subscription) => {
            //     // Send the subscription details to the server using the Fetch API.
            //         // fetch('./register', {
            //         //     method: 'post',
            //         //     headers: {
            //         //         'Content-type': 'application/json'
            //         //     },
            //         //     body: JSON.stringify({
            //         //         subscription: subscription
        //         //     }),
        //         // });
        //         await axios.post(
        //             serverURL+"register", { data: subscription, withCredentials:true }
        //         ).then(()=>{
                
        //         })
        //         .catch((Error)=>{console.log(Error)});
        //         setSubscription(subscription).then(()=>subscribe());
        //         // setState((state) => {
        //         //     return { ...state, subscription:subscription}
        //         // }, () => {
        //         //     // console.log(subscription);
        //         //     subscribe();
        //         // })           
        //     });
        // }    
        await axios.post(serverURL+"status", { date: dateToString(getNow()) })
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

    useEffect(() => {
        if(newSong.dates===null){
            // newSong.dates = dateToString(selectedDate)
            setNewSong({
                ...newSong,
                dates: dateToString(selectedDate)
            })
        }
    }, [selectedDate])

    useEffect(() => {
        if(newSong.dates===null){
            newSong.dates = dateToString(selectedDate)
            setNewSong({
                ...newSong,
                dates: dateToString(selectedDate)
            });
        } 
    },[newSong])

    useEffect(()=>{
        if(!session){
            dispatch(setLoginComponents(false))
        } else {
            dispatch(setLoginComponents(true));
        }
    },[session]);

    useEffect(()=>{
        // console.log(modifyShow);
    },[modifyShow]);


    const sizes = "30";

    return (
        <>
            <BrowserView>
                <Container className='bodyContainer'>
                    <Row>
                    <Col xs={2} className="center" style={{ 
                            backgroundColor: 'WhiteSmoke', 
                        }}>
                            { statusIndicator?<Online width={sizes} height={sizes}></Online> : <Offline width={sizes} height={sizes}></Offline> }
                        </Col>
                        <Col xs={8} style={{ 
                            backgroundColor: 'WhiteSmoke', 
                        }}>
                            <DatePicker
                                selected={selectedDate}
                                onChange={date => updateDate(date)} 
                                locale={ko}
                                dateFormat="yyyy년 MM월 dd일"
                                customInput={<ExampleCustomInput />}
                            />
                        </Col>
                        <Col xs={2} className="center" style={{ 
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
                            <Col style={{ 
                                backgroundColor: 'WhiteSmoke',
                                height: (window.innerHeight*0.65),
                                overflow: "auto" 
                            }}
                            width="100%" 
                            >                               
                                <SortableList onSortEnd={onSortEnd} className="list" draggedItemClassName="dragged">
                                    { songsList }
                                </SortableList>
                            </Col>
                        </Row>
                        <Row className="justify-content-md-center">
                            <Col style={{ 
                                backgroundColor: 'WhiteSmoke',
                                height: '10px' 
                            }}>
                            </Col>
                        </Row>
                        <Row className="justify-content-md-center">
                            <Col style={{ 
                                backgroundColor: 'WhiteSmoke',
                                border: "dotted 3px",
                                borderColor: "green",
                                padding: "5px" 
                            }}>
                                <Stack direction="horizontal" gap={1} className="justify-content-md-center">
                                    <Form.Control
                                    placeholder="가수"
                                    aria-label="가수"
                                    aria-describedby="singer"
                                    value={newSong.singer}
                                    onChange={event => updateState("singer", event)}
                                    style={{width:150}}
                                    />
                                    -
                                    <Form.Control
                                    placeholder="제목"
                                    aria-label="제목"
                                    aria-describedby="title"
                                    value={newSong.title}
                                    onChange={event => updateState("title", event)}
                                    width={20}
                                    style={{width:210}}
                                    />
                                    신청 : 
                                    <Form.Control
                                    placeholder="신청자"
                                    aria-label="신청자"
                                    aria-describedby="requester"
                                    value={newSong.requester}
                                    onChange={event => updateState("requester", event)}
                                    style={{width:140}}
                                    />
                                    <Form.Check // prettier-ignore
                                        type="switch"
                                        id="isRequest"
                                        label="리액션"
                                        checked={newSong.isReaction}
                                        onChange={event => updateState("isReaction", event)}
                                    />
                                    <Form.Check // prettier-ignore
                                        type="switch"
                                        id="isRequest"
                                        label="신청곡"
                                        checked={newSong.isRequest}
                                        onChange={event => updateState("isRequest", event)}
                                    />
                                    <Form.Check // prettier-ignore
                                        type="switch"
                                        id="isToSing"
                                        label="부를노래"
                                        checked={newSong.isToSing}
                                        onChange={event => updateState("isToSing", event)}
                                    />
                                    <Form.Check // prettier-ignore
                                        type="switch"
                                        id="isComplete"
                                        label="완료"
                                        checked={newSong.isComplete}
                                        onChange={event => updateState("isComplete", event)}
                                    />
                                    <Button variant="outline-primary" onClick={() => saveRequestSong()}>저장</Button>
                                </Stack>
                            </Col>
                        </Row>
                </Container>
            </BrowserView> 
            <MobileView>
                <Container className='bodyContainer'>
                    <Row>
                    <Col xs={2} className="center" style={{ 
                            backgroundColor: 'WhiteSmoke', 
                        }}>
                            { statusIndicator?<Online width={sizes} height={sizes}></Online> : <Offline width={sizes} height={sizes}></Offline> }
                        </Col>
                        <Col xs={8} style={{ 
                            backgroundColor: 'WhiteSmoke', 
                        }}>
                            <DatePicker
                                selected={selectedDate}
                                onChange={date => updateDate(date)} 
                                locale={ko}
                                dateFormat="yyyy년 MM월 dd일"
                                customInput={<ExampleCustomInput />}
                            />
                        </Col>
                        <Col xs={2} className="center" style={{ 
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
                            <Col style={{ 
                                backgroundColor: 'WhiteSmoke',
                                height: (window.innerHeight*0.65),
                                overflow: "auto" 
                            }}
                            width="100%" 
                            >                               
                                <SortableList onSortEnd={onSortEnd} className="list" draggedItemClassName="dragged">
                                    { songsListM }
                                </SortableList>
                            </Col>
                        </Row>
                        <Row className="justify-content-md-center">
                            <Col style={{ 
                                backgroundColor: 'WhiteSmoke',
                                height: '10px' 
                            }}>
                            </Col>
                        </Row>
                        <Row className="justify-content-md-center">
                            <Col style={{ 
                                backgroundColor: 'WhiteSmoke',
                                border: "dotted 3px",
                                borderColor: "green",
                                padding: "5px" 
                            }}>
                                <Container>
                                    <Row>
                                        <Col xs="5">
                                            <Form.Control
                                                placeholder="가수"
                                                aria-label="가수"
                                                aria-describedby="singer"
                                                value={newSong.singer}
                                                onChange={event => updateState("singer", event)}
                                            />
                                        </Col>
                                        <Col xs="1">
                                        -
                                        </Col>
                                        <Col xs="6">
                                            <Form.Control
                                                placeholder="제목"
                                                aria-label="제목"
                                                aria-describedby="title"
                                                value={newSong.title}
                                                onChange={event => updateState("title", event)}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="4">
                                        <Form.Control
                                            placeholder="신청자"
                                            aria-label="신청자"
                                            aria-describedby="requester"
                                            value={newSong.requester}
                                            onChange={event => updateState("requester", event)}
                                        />
                                        </Col>
                                        <Col xs="8">
                                            <Container>
                                                <Row>
                                                    <Col xs="3">
                                                        <PiGiftDuotone color={styleData.icon.color.gift} />
                                                    </Col>
                                                    <Col xs="3">
                                                        <PiClipboardTextDuotone color={styleData.icon.color.request} />
                                                    </Col>
                                                    <Col xs="3">
                                                        <PiMicrophoneStageDuotone color={styleData.icon.color.sing} />
                                                    </Col>
                                                    <Col xs="3">
                                                        <PiCheckBold width={30} height={30} color={"Red"}/>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs="3">
                                                    <Form.Check // prettier-ignore
                                                        type="switch"
                                                        id="isRequest"
                                                        checked={newSong.isReaction}
                                                        onChange={event => updateState("isReaction", event)}
                                                    />
                                                    </Col>
                                                    <Col xs="3">
                                                        <Form.Check // prettier-ignore
                                                            type="switch"
                                                            id="isRequest"
                                                            checked={newSong.isRequest}
                                                            onChange={event => updateState("isRequest", event)}
                                                        />
                                                    </Col>
                                                    <Col xs="3">
                                                        <Form.Check // prettier-ignore
                                                            type="switch"
                                                            id="isToSing"
                                                            checked={newSong.isToSing}
                                                            onChange={event => updateState("isToSing", event)}
                                                        />
                                                    </Col>
                                                    <Col xs="3">
                                                        <Form.Check // prettier-ignore
                                                            type="switch"
                                                            id="isComplete"
                                                            checked={newSong.isComplete}
                                                            onChange={event => updateState("isComplete", event)}
                                                        />
                                                    </Col>
                                                </Row>
                                            </Container>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="12">
                                            <Button variant="outline-primary" onClick={() => saveRequestSong()}>저장</Button>
                                        </Col>
                                    </Row>
                                </Container>
                            </Col>
                        </Row>
                </Container>
            </MobileView>
            <Modal
                show={ modifyShow }
                onHide={() => setModifyShow(false)}
                size="xs"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                    노래 수정
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>                
                    <Container>
                        <Row>
                            <Col xs={3} className='noPadding center'>
                                가수
                            </Col>
                            <Col xs={9} className='noPadding center'>
                                <Form.Control
                                    placeholder="가수"
                                    aria-label="가수"
                                    aria-describedby="singer"
                                    value={modifyTarget.singer}
                                    onChange={(e)=>{changeTarget("singer", e)}}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={3} className='noPadding center'>
                                제목
                            </Col>
                            <Col xs={9} className='noPadding center'>
                                <Form.Control
                                    placeholder="제목"
                                    aria-label="제목"
                                    aria-describedby="title"
                                    value={modifyTarget.title}
                                    onChange={(e)=>{changeTarget("title", e)}}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={3} className='noPadding center'>
                                신청자
                            </Col>
                            <Col xs={9} className='noPadding center'>
                                <Form.Control
                                    placeholder="신청자"
                                    aria-label="신청자"
                                    aria-describedby="requester"
                                    value={modifyTarget.requester}
                                    onChange={(e)=>{changeTarget("requester", e)}}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={3} className='noPadding center'>
                                <PiGiftDuotone color={styleData.icon.color.gift} />
                            </Col>
                            <Col xs={3} className='noPadding center'>
                                <PiClipboardTextDuotone color={styleData.icon.color.request} />
                            </Col>
                            <Col xs={3} className='noPadding center'>
                                <PiMicrophoneStageDuotone color={styleData.icon.color.sing} />
                            </Col>
                            <Col xs={3} className='noPadding center'>
                                <PiCheckBold width={30} height={30} color={"Red"}/>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={3} className='noPadding center'>
                                <Form.Check // prettier-ignore
                                    type="switch"
                                    id="isReaction"
                                    checked={modifyTarget.isReaction}
                                    onChange={(e)=>{changeTarget("isReaction", e)}}
                                />
                            </Col>
                            <Col xs={3} className='noPadding center'>
                                <Form.Check // prettier-ignore
                                    type="switch"
                                    id="isRequest"
                                    checked={modifyTarget.isRequest}
                                    onChange={(e)=>{changeTarget("isRequest", e)}}
                                />
                            </Col>
                            <Col xs={3} className='noPadding center'>
                                <Form.Check // prettier-ignore
                                    type="switch"
                                    id="isToSing"
                                    checked={modifyTarget.isToSing}
                                    onChange={(e)=>{changeTarget("isToSing", e)}}
                                />
                            </Col>
                            <Col xs={3} className='noPadding center'>
                                <Form.Check // prettier-ignore
                                    type="switch"
                                    id="isComplete"
                                    checked={modifyTarget.isComplete}
                                    onChange={(e)=>{changeTarget("isComplete", e)}}
                                />
                            </Col>
                        </Row>
                    </Container>  
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => saveTarget()}>수정</Button>
                </Modal.Footer>
            </Modal>

        </>
    );
    // <Col xl={3} className='noPadding center'>
    //                                 <Container>
    //                                     <Row>
    //                                         <Col xl={5} className='noPadding'>
    //                                             <Form.Control
    //                                                 placeholder="가수"
    //                                                 aria-label="가수"
    //                                                 aria-describedby="singer"
    //                                                 value={item.singer}
    //                                                 onChange={(e)=>{changeSong(item.id, "singer", e)}}
    //                                             />
    //                                         </Col>
    //                                         <Col className='noPadding center'>                                
    //                                         -
    //                                         </Col>
    //                                         <Col xl={6} className='noPadding'>
    //                                             <Form.Control
    //                                                 placeholder="제목"
    //                                                 aria-label="제목"
    //                                                 aria-describedby="title"
    //                                                 value={item.title}
    //                                                 onChange={(e)=>{changeSong(item.id, "title", e)}}
    //                                             />
    //                                         </Col>
    //                                     </Row>
    //                                 </Container>
    //                             </Col>
    //                             <Col xl={2} className='noPadding center'>
    //                                 <Container>
    //                                     <Row>
    //                                         <Col className='noPadding center'>                                
    //                                         신청 : 
    //                                         </Col>
    //                                         <Col xl={8} className='noPadding'>
    //                                             <Form.Control
    //                                                 placeholder="신청자"
    //                                                 aria-label="신청자"
    //                                                 aria-describedby="requester"
    //                                                 value={item.requester}
    //                                                 onChange={(e)=>{changeSong(item.id, "requester", e)}}
    //                                             />
    //                                         </Col>
    //                                     </Row>
    //                                 </Container>
    //                             </Col>
    //                             <Col xl={1} className='noPadding center'>
    //                                 <Container>
    //                                     <Row>
    //                                         <Col className='noPadding'>
    //                                             <Form.Check // prettier-ignore
    //                                                 type="switch"
    //                                                 id="isReaction"
    //                                                 checked={item.isReaction}
    //                                                 onChange={(e)=>{changeSong(item.id, "isReaction", e)}}
    //                                             />
    //                                         </Col>
    //                                     </Row>
    //                                     <Row>
    //                                         <Col className='noPadding'>
    //                                             리액션
    //                                         </Col>
    //                                     </Row>
    //                                 </Container>                        
    //                             </Col>
    //                             <Col xl={1} className='noPadding center'>
    //                                 <Container>
    //                                     <Row>
    //                                         <Col className='noPadding'>
    //                                             <Form.Check // prettier-ignore
    //                                                 type="switch"
    //                                                 id="isRequest"
    //                                                 checked={item.isRequest}
    //                                                 onChange={(e)=>{changeSong(item.id, "isRequest", e)}}
    //                                             />
    //                                         </Col>
    //                                     </Row>
    //                                     <Row>
    //                                         <Col className='noPadding'>
    //                                             신청곡
    //                                         </Col>
    //                                     </Row>
    //                                 </Container>                        
    //                             </Col>
    //                             <Col xl={1} className='noPadding center'>
    //                                 <Container>
    //                                     <Row>
    //                                         <Col className='noPadding'>
    //                                             <Form.Check // prettier-ignore
    //                                                 type="switch"
    //                                                 id="isToSing"
    //                                                 checked={item.isToSing}
    //                                                 onChange={(e)=>{changeSong(item.id, "isToSing", e)}}
    //                                             />
    //                                         </Col>
    //                                     </Row>
    //                                     <Row>
    //                                         <Col className='noPadding'>
    //                                             부를노래
    //                                         </Col>
    //                                     </Row>
    //                                 </Container>                        
    //                             </Col>
    //                             <Col xl={1} className='noPadding center'>
    //                                 <Container>
    //                                     <Row>
    //                                         <Col className='noPadding'>
    //                                             <Form.Check // prettier-ignore
    //                                                 type="switch"
    //                                                 id="isComplete"
    //                                                 checked={item.isComplete}
    //                                                 onChange={(e)=>{changeSong(item.id, "isComplete", e)}}
    //                                             />
    //                                         </Col>
    //                                     </Row>
    //                                     <Row>
    //                                         <Col className='noPadding'>
    //                                             완료된 곡
    //                                         </Col>
    //                                     </Row>
    //                                 </Container>                         
    //                             </Col>


    // <Row>
    //                                 <Col style={{ 
    //                                     backgroundColor: 'WhiteSmoke', 
    //                                 }}>
    //                                     현재곡
    //                                 </Col>
    //                             </Row>
    //                             <Row>
    //                                 <Col className='d-flex flex-wrap'>
    //                                     { nowSong }
    //                                 </Col>
    //                             </Row>
    //                             <Row>
    //                                 <Col style={{ 
    //                                     backgroundColor: 'WhiteSmoke', 
    //                                 }}>
    //                                     다음곡
    //                                 </Col>
    //                             </Row>
    //                             <Row>
    //                                 <Col className='d-flex flex-wrap'>
    //                                     { remainSongs }
    //                                 </Col>
    //                             </Row>
    //                             <Row>
    //                                 <Col style={{ 
    //                                     backgroundColor: 'WhiteSmoke', 
    //                                 }}>
    //                                     들은곡
    //                                 </Col>
    //                             </Row>
    //                             <Row>
    //                                 <Col className='d-flex flex-wrap'>
    //                                     { compList }
    //                                 </Col>
    //                             </Row>
}

// 숫자를 넘겨받아 서수형 문자열 반환
function convertOrdinalNumber(n)
{
    n = parseInt(n, 10);
    const suffix = ['th', 'st', 'nd', 'rd'];
    const mod100 = n % 100;

    return n+(suffix[(mod100-20)%10] || suffix[mod100] || suffix[0]);
}


