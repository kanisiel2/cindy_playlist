import React, { forwardRef, useState, useEffect } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Stack from 'react-bootstrap/Stack';
import { FaTrash } from 'react-icons/fa6'; //FaChevronUp, FaChevronDown,
import { ReactComponent as Online } from './online.svg';
import { ReactComponent as Offline } from './offline.svg';

import './index.css';
import axios from 'axios';
// eslint-disable-next-line
import SortableList, { SortableItem, SortableKnob } from 'react-easy-sort'
// import arrayMove from 'array-move';
import { arrayMoveImmutable } from 'array-move';


import { ko } from 'date-fns/esm/locale';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector, useDispatch } from 'react-redux';
import { setCanvasStatus, setModalStatus } from './redux/windowSlice';
import { setLive, setSession, setStatusIndicator, setUpdateButton, setLoginComponents } from './redux/statusSlice';
import {
    PiBellLight,
    PiMicrophoneStageDuotone,
    PiMusicNotesDuotone,
    PiCaretRightBold,
    PiCheckBold,
    PiGiftDuotone,
    PiEyeBold,
    PiArrowsOutCardinalBold
} from 'react-icons/pi';
import { GiImperialCrown, GiQueenCrown, GiJewelCrown } from 'react-icons/gi';
// eslint-disable-next-line
import Profile from './Profile';
import Offcanvas from 'react-bootstrap/Offcanvas';
import {RxHamburgerMenu} from 'react-icons/rx';
// import RequestIcon from "./request.png";
// import BGMIcon from "./BGM.png";
// import ReactionIcon from "./REACTION.png";
// import nowIcon from "./now.png";


axios.defaults.withCredentials = true;
// eslint-disable-next-line
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
    capsule :{
        backgroundColor: "HoneyDew",
        border: "solid 1px",
        borderColor: "DarkOliveGreen",
        cursor:"pointer",
        margin: "3 3 0"
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


// function getDateTime() {
//     const TIME_ZONE = 9 * 60 * 60 * 1000; // 9시간
//     const d = new Date();

//     const date = new Date(d.getTime() + TIME_ZONE).toISOString().split('T')[0];
//     const time = d.toTimeString().split(' ')[0];

    
//     // console.log(date + ' ' + time);
//     return (date + ' ' + time);
// }
var season;
export default function RankAdmin () {

    const dispatch = useDispatch()

    const modalShow = useSelector((state) => state.windows.modal);
    const loginComponents = useSelector((state) => state.statuses.loginComponents);    
    const session = useSelector((state) => state.statuses.session);
    const updateButton = useSelector((state) => state.statuses.updateButton);
    const live = useSelector((state) => state.statuses.live);
    const statusIndicator = useSelector((state) => state.statuses.statusIndicator)
    
    // const [session, setSession] = useState(null);
    const [mode, setMode] = useState("week");
    const [weeknum, setWeeknum] = useState("1");
    const [selectedMode, setSelectedMode] = useState(true);
    const [subscription, setSubscription] = useState(null);
    const [subscribeComponents, setSubscribeComponents] = useState(<PiBellLight />);
    // const [coinRanks, setCoinRanks] = useState([]);
    const [coinRankComponents, setCoinRankComponents] = useState([]);
    // const [viewRanks, setViewRanks] = useState([]);
    const [viewRankComponents, setViewRankComponents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(getNow());
    const [newRank, setNewRank] = useState({
        rank:"",
        type: "coin",
        name: null,
        point: null,
        season: null,
    });        
    const [yearStyle, setYearStyle] = useState(null);
    const [monthStyle, setMonthStyle] = useState(null);
    const [weekStyle, setWeekStyle] = useState(null);
    const [include, setInclude] = useState(null);
    const [monthInclude, setMonthInclude] = useState([]);
    const [wrapper, setWrapper] = useState(null);

    var newRanks = {
        rank:"",
        type: "coin",
        name: null,
        point: null,
        season: null,
    };

    var coinRanks = [];
    var viewRanks = [];

    // onSortEnd = (oldIndex, newIndex) => {
    //     setItems((array) => arrayMoveImmutable(array, oldIndex, newIndex))
    // }

    const handleClose = () => dispatch(setCanvasStatus(false));
    const handleShow = () => dispatch(setCanvasStatus(true));

    const isAfter = (date) => {
        return date > new Date('2023-08-30');
    };

    const isAfter2 = (date) => {
        return date > new Date('2022-12-31');
    };

    const renderYearContent = (year) => {
        const tooltipText = `${year} 년`;
        return <span title={tooltipText}>{year}</span>;
    };

    const renderMonthContent = (month, shortMonth, longMonth) => {
        const tooltipText = `${longMonth} 월`;
        return <span title={tooltipText}>{shortMonth}</span>;
      };
    

    
    const onSortEndCoin = (oldIndex, newIndex) => {
        // console.log(value);
        // console.log(value2);
        // let state = state;
        // state.songs = arrayMove(state.songs, oldIndex, newIndex);
        coinRanks = arrayMoveImmutable(coinRanks, oldIndex, newIndex)
        .then(() => {
            let newArray = coinRanks.map((item, index) => {
                item.proc = (index+1);
                return item;
            }); 
            axios.post(serverURL+"modifyrank", { type: "coin", isArray: true, sortable:true, datas:newArray, dates: selectedDate.toISOString().split('T')[0], withCredentials: true })
            .then((Response)=>{
                // console.log(Response.data);
                setContents(Response);
            })
            .catch((Error)=>{console.log(Error)});
        })
    };
    const onSortEndView = (oldIndex, newIndex) => {
        // console.log(value);
        // console.log(value2);
        // let state = state;
        // state.songs = arrayMove(state.songs, oldIndex, newIndex);
        viewRanks = arrayMoveImmutable(viewRanks, oldIndex, newIndex)
        .then(() => {
            let newArray = coinRanks.map((item, index) => {
                item.proc = (index+1);
                return item;
            }); 
            axios.post(serverURL+"modifyrank", { type: "view", isArray: true, sortable:true, datas:newArray, dates: selectedDate.toISOString().split('T')[0], withCredentials: true })
            .then((Response)=>{
                // console.log(Response.data);
                setContents(Response);
            })
            .catch((Error)=>{console.log(Error)});
        })
    };

    // onSortEndCoin = (oldIndex, newIndex) => {
    //     // console.log(value);
    //     // console.log(value2);
    //     // let state = state;
    //     // state.songs = arrayMove(state.songs, oldIndex, newIndex);
    //     setState((state) => {
    //         // state.songs = arrayMove(state.songs, oldIndex, newIndex);
    //         // console.log(state.songs);
    //         // state.songs.forEach((item, index) => {
    //         //     item.proc = (index+1);
    //         // });  
    //         return { viewRanks: arrayMoveImmutable(state.viewRanks, oldIndex, newIndex) };
    //     }, () => {
    //         let newArray = viewRanks.map((item, index) => {
    //             item.proc = (index+1);
    //             return item;
    //         }); 
    //         axios.post(serverURL+"modifyrank", { isArray: true, sortable:true, datas:newArray, dates: selectedDate.toISOString().split('T')[0], withCredentials: true })
    //         .then((Response)=>{
    //             // console.log(Response.data);
    //             setContents(Response);
    //         })
    //         .catch((Error)=>{console.log(Error)});
    //     });
    // };


    // updateSongs = async () => {
    //     console.log(songs);
    //     // axios.post(serverURL+"modifysong", { isArray: true, datas:capsule, dates: selectedDate.toISOString().split('T')[0], withCredentials: true })
    //     // .then((Response)=>{
    //     //     // console.log(Response.data);
    //     //     setContents(Response);
    //     // })
    //     // .catch((Error)=>{console.log(Error)});
    // }

    const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
        <button className="example-custom-input2" onClick={onClick} ref={ref}>
          {value}
        </button>
    ));

    /*eslint no-extend-native: ["error", { "exceptions": ["Object", "Date","String","Number"] }]*/
    // eslint-disable-next-line
    Date.prototype.format = function (f) {
        // console.log(valueOf());
        // if (!valueOf()) return " ";



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

    const fillzero = (data) => {
        return data < 10 ? "0" + data.toString() : data.toString();
    }

    const changeMode = (event) => {        
        switch(event.target.value){
            case "week":
                setWeekStyle({});
                setMonthStyle({display: "none"});
                setYearStyle({display: "none"});
                break;
            case "month":
                setWeekStyle({display: "none"});
                setMonthStyle({});
                setYearStyle({display: "none"});
                break;
            case "year":
                setWeekStyle({display: "none"});
                setMonthStyle({display: "none"});
                setYearStyle({});
                break;
            default:
                break;
        }
        // let modes = event.target.value === "true" ? true : false;        
        setMode(event.target.value);        
    }
    const dateToString = (date, type) => {
        let datestrings = getKST(date).toLocaleString('ko-KR').substring(0,11).replace(". ", "-").replace(". ", "-").split("-");
        // console.log(datestrings);
        datestrings = datestrings.map((item)=> {
            if(item.length<2){
                return "0"+item;
            } else {
                return item;
            }
        })
        switch(type){
            case "week":
                datestrings.pop();
                datestrings = datestrings.join("-")+"/"+weeknum;
                break;
            case "month":
                datestrings.pop();
                datestrings = datestrings.join("-");
                break;
            case "year":
                datestrings = datestrings[0];
                break;
            default:
                break;
        }
        return datestrings;
    }

    const updateDate = async (date) => {
        // console.log(date);
        // console.log(mode);
        newRank.season = dateToString(date, mode);
        // switch(mode){
        //     case "week":
        //         newRank.season = getKST(date).toISOString().split('T')[0].substring(0,7)+"/"+weeknum;
        //         break;
        //     case "month":
        //         newRank.season = getKST(date).toISOString().split('T')[0].substring(0,7);
        //         break;
        //     case "year":
        //         newRank.season = getKST(date).toISOString().split('T')[0].substring(0,4);
        //         break;
        //     default:
        //         break;
        // }
        // newRank.season = mode ? date.toISOString().split('T')[0].substring(0,7) :
        // date.toISOString().split('T')[0].substring(0,4);
        // console.log(date.toISOString());
        console.log(newRank.season);

        setNewRank({
            ...newRank,
            season: newRank.season
        })
       
        // console.log(date.getMonth());
        await setSelectedDate(getKST(date));
        // console.log(season);
        // console.log(selectedDate);
    }

    const changeRadio = (event) => {
        let rank = -1;
        switch(event.target.value) {
            case "coin":
                rank = coinRanks.length+1;
                break;
            case "view":
                rank = viewRanks.length+1;
                break;
            default:
                rank = -1;
                break;
        }

        newRanks.rank = rank;
        newRanks.type = event.target.value;
        setNewRank({
            ...newRank, rank: rank, type: event.target.value
        })
    }

    const removeRank = async (item) => {   
       
        axios.post(serverURL+"delRank", { rank: item, withCredentials: true })
        .then((Response)=>{
            // console.log(Response.data);
            setContents(Response);
        })
        .catch((Error)=>{console.log(Error)});

    }

    const changeRankData = (id, target, event) => {
        let capsule = {
            data: {},
            where: {
                where: {
                    id: id,
                }
            }
        };
        switch(target){           
            case "name":
                capsule.data.name = event.target.value;
                break;
            case "point":
                capsule.data.point = event.target.value;
                break;            
            default:
                break;
        }        
        // setState(state);
        console.log(capsule);
        // let data = [capsule];
        // console.log(data);
        
        
        // axios.post(serverURL+"modifysong", { isArray: false, datas:capsule, dates: selectedDate.toISOString().split('T')[0], withCredentials: true })
        // .then((Response)=>{
        //     // console.log(Response.data);
        //     setContents(Response);
        // })
        // .catch((Error)=>{console.log(Error)});
    }

    // procChange = (id, action) => {
    //     let state = state;
    //     let buffer;
    //     // console.log(id);
    //     // console.log(action);
    //     switch(action){
    //         case "up":
    //             buffer = state.songs[id].proc;
    //             state.songs[id].proc = state.songs[id-1].proc;
    //             state.songs[id-1].proc = buffer;
    //             break;
    //         case "down":                                
    //             buffer = state.songs[id].proc;
    //             state.songs[id].proc = state.songs[id+1].proc;
    //             state.songs[id+1].proc = buffer;
    //             break;
    //         default:
    //             break;
    //     }
    //     // console.log(state.songs);
    //     let capsule = state.songs.map((item, index) => {
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
    //     axios.post(serverURL+"modifysong", { isArray: true, datas:capsule, dates: selectedDate.toISOString().split('T')[0], withCredentials: true })
    //     .then((Response)=>{
    //         // console.log(Response.data);
    //         setContents(Response);
    //     })
    //     .catch((Error)=>{console.log(Error)});
    // }

    // saveRequestSong = () => {        
        
    //     axios.post(serverURL+"addsong", { data:newSong , withCredentials: true })
    //     .then((Response)=>{
    //         // console.log(Response.data);
    //         setContents(Response);
    //     })
    //     .catch((Error)=>{console.log(Error)});

    // }

    const saveRanking = () => {
        
        // console.log(newRank);
        axios.post(serverURL+"addRank", { datas:newRank, withCredentials: true })
        .then((Response)=>{
            // console.log(Response.data);
            setContents(Response);            
            // newRank.season = mode? getNow().toISOString().split('T')[0].substring(0,7) : 
            refreshNewRank();
        })
        .catch((Error)=>{console.log(Error)});
    }

    // const onPopup = (url) => {
    //     if(canLink){
    //         window.open(url, "_blank", "noopener, noreferrer");
    //     }
    // }

    const adminComponents = (item, index, type) => {
        let rankComponent = null;
        switch(item.rank){
            case 1:
                rankComponent = <GiImperialCrown width={30} color="goldenrod" />
                break;
            case 2:
                rankComponent = <GiQueenCrown width={30} color="silver" />
                break;
            case 3:
                rankComponent = <GiJewelCrown width={30} color="peru" />
                break;
            default:
                rankComponent = convertOrdinalNumber(item.rank)
                break;
        }
        return (
            <SortableItem key={Math.random()+type+"Admin"} index={index} style={styleData.capsule}>
                <Container className="item" tabIndex={0} id={type+"ranksAdmin"} style={styleData.capsule}> 
                    <Row key={type+index+Math.random()}>
                        <Col xs={1} className='noPadding center'>
                            { rankComponent }
                        </Col>
                        <Col xs={6} className='noPadding center'>
                            <Form.Control
                                placeholder="이름"
                                aria-label="이름"
                                aria-describedby="name"
                                value={item.name}
                                onChange={(e)=>{changeRankData(item.id, "name", e)}}
                                width="10em"
                            />
                        </Col>                            
                        <Col xs={3} className='noPadding center'>
                            <Form.Control
                                placeholder="점수"
                                aria-label="점수"
                                aria-describedby="point"
                                value={item.point}
                                onChange={(e)=>{changeRankData(item.id, "point", e)}}
                                width="10em"
                            />                                
                        </Col>                            
                        <Col xs={1} className='noPadding center'>
                            <Button variant="outline-danger" className={item.id} onClick={() => removeRank(item)}><FaTrash/></Button>
                        </Col>
                        <Col xs={1} className='noPadding center'>
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
    }

    const userComponents = (item, index, type) => {
        //onClick={() => onPopup(item.video)}
        let rankComponent = null;
        switch(item.rank){
            case 1:
                rankComponent = <GiImperialCrown width={30} color="goldenrod" />
                break;
            case 2:
                rankComponent = <GiQueenCrown width={30} color="silver" />
                break;
            case 3:
                rankComponent = <GiJewelCrown width={30} color="peru" />
                break;
            default:
                rankComponent = convertOrdinalNumber(item.rank)
                break;
        }
        return (
            <ListGroup.Item as="li" key={item.rank+index+Math.random()} style={{width:"25em"}} >
                <Container className="item" tabIndex={0} id={type+"index"} style={styleData.capsule}> 
                    <Row key={Math.random()+selectedDate.toISOString()}>
                        <Col xs={3} className='noPadding center'>
                            { rankComponent }
                        </Col>
                        <Col xs={6} className='noPadding center'>
                            {item.name}
                        </Col>                            
                        <Col xs={3} className='noPadding center'>
                            {item.point}                     
                        </Col>
                    </Row>
                </Container>
            </ListGroup.Item>
        );
    }

    const setContents = async (Response) => {    
        console.log(Response.data)   
        coinRanks = Response.data.coin;
        viewRanks = Response.data.view;
        dispatch(setSession(Response.data.session.passport ? Response.data.session.passport.user : null));
        dispatch(setUpdateButton(
            Response.data.session.passport ? (
                <Button key={Math.random()+selectedDate.toISOString()} variant='outline-primary' onClick={()=>updateStat()}>
                    방송상태 업데이트
                </Button>
            ) : null
        ))
        if(Response.data.session.passport){
            setCoinRankComponents(coinRanks.map((item, index, parent) => {       
                return adminComponents(item, index, "coin");
            }));
            setViewRankComponents(viewRanks.map((item, index, parent) => {       
                return adminComponents(item, index, "view");
            }));
        } else {
            let now = true;
            setCoinRankComponents(coinRanks.length > 0 ? coinRanks.map((item, index, parent) => {    
                return userComponents(item,index,"coin");
            }) : <h6 className="center" style={{color: "#888888"}}>아직 입력된 <span style={{color:"orange"}}>순위</span>가 없어요 😢</h6>);
            setViewRankComponents(viewRanks.length > 0 ? viewRanks.map((item, index, parent) => {    
                return userComponents(item,index,"coin");
            }) : <h6 className="center" style={{color: "#888888"}}>아직 입력된 <span style={{color:"orange"}}>순위</span>가 없어요 😢</h6>);
        }
        
        // console.log(mode);
        // console.log(selectedDate);   
        // console.log(newRank);
    }

    const updateStat = () => {

        
        axios.post(serverURL+"updateStat", { 
            date: getNow().toISOString().split('T')[0],
            withCredentials: true,
        })
        .then((Response)=>{
            // console.log(Response.data);            
            setContents(Response);
        })
        .catch((Error)=>{console.log(Error)});
    }

    const updateState = (target, event) => {
        switch(target){
            case "name":
                newRank.name = event.target.value;                
                break;
            case "point":
                newRank.point = event.target.value;                
                break;
            default:
                break;
        }
    }

    const changeWeeks = (event) => {
        let week = event.target.value;
        // console.log(week);
        setWeeknum(week);
    }

    const setRank = async () => {     
        
        let rank
        switch(newRank.type) {
            case "coin":
                rank = coinRanks.length+1;
                break;
            case "view":
                rank = viewRanks.length+1;
                break;
            default:
                rank = -1;
                break;
        }
        
        newRank.rank = rank;
    }
    const refreshNewRank = () => {
        let rank
        switch(newRank.type) {
            case "coin":
                rank = coinRanks.length+1;
                break;
            case "view":
                rank = viewRanks.length+1;
                break;
            default:
                rank = -1;
                break;
        }
        newRank.rank = rank;
        newRank.name = null;
        newRank.point = null;
        setNewRank({
            ...newRank,
            rank: rank,
            name: null,
            point: null
        })
    }
    
    const calcWeekNum = (date) => {
        let num = Math.floor(
            date.getDate() / 7
        );
        num = num > 4 ? 4 : num;
        num = num <=0 ? 1 : num;

        return num;
        // console.log(num);
    }
    
    useEffect(()=>{
        if(!session){
            dispatch(setLoginComponents(<a href={serverURL+"google"}>구글 로그인</a>))            
            // setInterval(async () => {
            //     await axios.post(serverURL+"status", { date: formatDate(selectedDate), withCredentials: true })
            //     .then((Response)=>{
            //         // console.log(Response.data);
            //         // console.log(state);   
            //         if((Object.entries(Response.data.status.live).toString() !== Object.entries(live).toString())
            //         ||
            //         (Object.entries(Response.data.songs).toString() !== Object.entries(songs).toString())
            //         ){
            //           console.log("update!");  
            //         }
            //         setContents(Response);
            //     })
            //     .catch((Error)=>{console.log(Error)});
            // }, 10000);        
        } else {
            dispatch(setLoginComponents(<Profile></Profile>));
            
            // setState((state)=> {
            //     return { ...state, loginComponents: <Profile></Profile> }
            // })
            // console.log(JSON.parse(session.refToken));           
        }
    },[session]);
    useEffect(() => {
        newRank.season = dateToString(selectedDate, mode);
        // console.log(newRank.season);
        setNewRank({
            ...newRank,
            season: newRank.season
        })
        
    }, [selectedDate, mode, weeknum]);
    // useEffect(() => {
    //     setRank();
    //     setNewRank({
    //         name: null,
    //         point: null,
    //     });
    // }, [coinRanks]);
    
    useEffect( async() => {
        let weekn = calcWeekNum(getNow());
        console.log(weekn);
        setWeeknum(weekn);
        newRank.season = dateToString(getNow(), "week");   
        refreshNewRank();
        switch(mode){
            case "week":
                setWeekStyle({});
                setMonthStyle({display: "none"});
                setYearStyle({display: "none"});
                break;
            case "month":
                setWeekStyle({display: "none"});
                setMonthStyle({});
                setYearStyle({display: "none"});
                break;
            case "year":
                setWeekStyle({display: "none"});
                setMonthStyle({display: "none"});
                setYearStyle({});
                break;
        }
        refreshNewRank();

        await axios.post(serverURL+"getRanks", { season: newRank.season })
        .then(async (Response)=>{
            // console.log(Response.data.session.passport);
            // Response.data.            
            await setContents(Response);
        })
        .catch((Error)=>{console.log(Error)});
        // let month = (<DatePicker
        //     selected={selectedDate}
        //     onChange={date => updateDate(date)} 
        //     locale={ko}
        //     renderMonthContent={renderMonthContent}
        //     customInput={<ExampleCustomInput />}
        //     filterDate={isAfter}
        //     includeDates={include}
        //     showMonthYearPicker
        //     dateFormat="yyyy년 MM월"
        // />);
        // let year = (<DatePicker        
        //     selected={selectedDate}
        //     onChange={date => updateDate(date)} 
        //     locale={ko}
        //     renderYearContent={renderYearContent}
        //     customInput={<ExampleCustomInput />}
        //     filterDate={isAfter2}
        //     showYearPicker
        //     dateFormat="yyyy년"
        // />);
        
        // setPickerComponents(month);
        // setMonthPicker(month);
        // setYearPicker(year);
        setMonthInclude(new Array(new Date("2023-09-01"), new Date("2023-10-01"), new Date("2023-11-01")));
        // console.log(yearStyle);
    },[]);

    

    
    return (
        <>
            <Container className='bodyContainer'>
                <Row>
                <Col xs={3} className="center" style={{ 
                        backgroundColor: 'WhiteSmoke', 
                    }}>
                        <Form.Select defaultValue={mode} onChange={(mode)=>changeMode(mode)} aria-label="Default select example">
                            <option value="week">주간</option>
                            <option value="month">월간</option>
                            <option value="year">연간</option>
                        </Form.Select>
                    </Col>
                    <Col xs={7} style={{ 
                        backgroundColor: 'WhiteSmoke', 
                    }}>
                        <div style={yearStyle}>
                            <DatePicker        
                                selected={selectedDate}
                                onChange={date => updateDate(date)} 
                                locale={ko}
                                renderYearContent={renderYearContent}
                                customInput={<ExampleCustomInput />}
                                filterDate={isAfter2}
                                showYearPicker
                                dateFormat="yyyy년"
                            />
                        </div>
                        <div style={monthStyle}>
                            <DatePicker
                                selected={selectedDate}
                                onChange={date => updateDate(date)} 
                                locale={ko}
                                renderMonthContent={renderMonthContent}
                                customInput={<ExampleCustomInput />}
                                filterDate={isAfter}
                                includeDates={monthInclude}
                                showMonthYearPicker
                                dateFormat="yyyy년 MM월"
                            />
                        </div>                        
                        <div style={weekStyle}>
                            <DatePicker
                                selected={selectedDate}
                                onChange={date => updateDate(date)} 
                                locale={ko}
                                renderMonthContent={renderMonthContent}
                                customInput={<ExampleCustomInput />}
                                filterDate={isAfter}
                                includeDates={monthInclude}
                                showMonthYearPicker
                                dateFormat="yyyy년 MM월"
                                style={{display: "inline"}}
                            /><span style={{width:"3em"}}></span>
                            <Form.Select aria-label="주차 선택" defaultValue={weeknum} onChange={changeWeeks}
                            style ={{display: "inline", width:"6rem", margin:"0 2 0 rem"}}
                            >
                                <option value="1">1주차</option>
                                <option value="2">2주차</option>
                                <option value="3">3주차</option>
                                <option value="4">4주차</option>
                            </Form.Select>
                        </div>
                    </Col>
                    <Col xs={2} className="center" style={{ 
                        backgroundColor: 'WhiteSmoke', 
                    }}>
                        <Button variant="primary" onClick={handleShow}>
                            <RxHamburgerMenu></RxHamburgerMenu>
                        </Button>                            
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
                    <Col xs={6} className="center" style={{ 
                        backgroundColor: 'WhiteSmoke',
                    }}>
                        <PiGiftDuotone width={30} color='purple'/> 선물 순위
                    </Col>
                    <Col xs={6} style={{ 
                        backgroundColor: 'WhiteSmoke',
                    }}>
                        <PiEyeBold width={30} color='purple' /> 시청 순위
                    </Col>
                </Row>
                <Row className="justify-content-md-center">
                    <Col xs={6} className="center" style={{ 
                        backgroundColor: 'WhiteSmoke',
                    }}>
                        <SortableList onSortEnd={onSortEndCoin} className="list" draggedItemClassName="dragged">
                            {coinRankComponents}
                        </SortableList>                 
                    </Col>
                    <Col xs={6} style={{ 
                        backgroundColor: 'WhiteSmoke',
                    }}>
                        <SortableList onSortEnd={onSortEndView} className="list" draggedItemClassName="dragged">
                            {viewRankComponents}
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
                            <div style={{padding: "5px", backgroundColor:"Silver"}}>
                                <Form.Check
                                    type="radio"
                                    value="coin"
                                    label="코인"
                                    id="rankTypeC"
                                    name="rankType"
                                    onChange={changeRadio}
                                    checked={newRank.type === "coin"}
                                />
                                <Form.Check
                                    type="radio"
                                    value="view"
                                    label="시청시간"
                                    id="rankTypeV"
                                    name="rankType"
                                    onChange={changeRadio}
                                    checked={newRank.type === "view"}
                                />
                            </div>
                            닉네임: 
                            <Form.Control
                            placeholder="이름"
                            aria-label="이름"
                            aria-describedby="name"
                            value={newRank.name}
                            onChange={event => updateState("name", event)}
                            style={{width:"10em"}}
                            />
                            점수: 
                            <Form.Control
                            placeholder="점수"
                            aria-label="점수"
                            aria-describedby="point"
                            value={newRank.point}
                            onChange={event => updateState("point", event)}
                            width={20}
                            style={{width:"8em"}}
                            />
                            <Button variant="outline-primary" onClick={() => saveRanking()}>저장</Button>
                        </Stack>
                    </Col>
                </Row>
            </Container>          
        </>
    );
    
    


//     <Container style={{ 
//         backgroundColor: 'WhiteSmoke', 
//     }}>
// <Row className="justify-content-md-center">
//     <Col style={{ 
//         backgroundColor: 'WhiteSmoke',
//         height: (window.innerHeight*0.65),
//         overflow: "auto" 
//     }}
//     width="100%" 
//     >                               
//         <SortableList onSortEnd={onSortEnd} className="list" draggedItemClassName="dragged">
            
//         </SortableList>
//     </Col>
// </Row>

// </Container>




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


function daysInMonth (month, year) {
    return new Date(year, month, 0).getDate();
}