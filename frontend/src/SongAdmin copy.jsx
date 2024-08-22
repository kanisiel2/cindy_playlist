import React, { forwardRef } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
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
// import './index.css';
// import { ReactComponent as RequestIcon } from './RequestIcon.svg';
// import { ReactComponent as BGMIcon } from './BGMIcon.svg';

// import Card from 'react-bootstrap/Card';
import { PiMicrophoneStageDuotone, PiMusicNotesDuotone, PiCaretRightBold, PiCheckBold, PiGiftDuotone, PiClipboardTextDuotone, PiArrowsOutCardinalBold } from 'react-icons/pi';

import Profile from './Profile';
import Offcanvas from 'react-bootstrap/Offcanvas';
import {RxHamburgerMenu} from 'react-icons/rx';
// import RequestIcon from "./request.png";
// import BGMIcon from "./BGM.png";
// import ReactionIcon from "./REACTION.png";
// import nowIcon from "./now.png";


axios.defaults.withCredentials = true;
const serverURL = "https://song.cindy.team:3002/";
const statusURL = "https://song.cindy.team:3002/status";
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


// function getDateTime() {
//     const TIME_ZONE = 9 * 60 * 60 * 1000; // 9시간
//     const d = new Date();

//     const date = new Date(d.getTime() + TIME_ZONE).toISOString().split('T')[0];
//     const time = d.toTimeString().split(' ')[0];

    
//     // console.log(date + ' ' + time);
//     return (date + ' ' + time);
// }

export default class RankAdmin extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            coinRanks:[],
            coinRankComponents:[],
            viewRanks:[],
            viewRankComponents:[],
            newRank:{
                type:"",
                rank:"",
                name:"",
                season:"",
            },
            selectedDate: getNow(),
            selectedMode: false,
            yearPicker: 
                <DatePicker        
                    selected={getNow()}
                    onChange={date => this.updateDate(date)} 
                    locale={ko}
                    renderYearContent={renderYearContent}
                    customInput={<this.ExampleCustomInput />}
                    filterDate={isAfter}
                    showYearPicker
                    dateFormat="yyyy년"
                />,
            monthPicker:
                <DatePicker                    
                    selected={getNow()}
                    onChange={date => this.updateDate(date)} 
                    locale={ko}
                    renderMonthContent={renderMonthContent}
                    customInput={<this.ExampleCustomInput />}
                    filterDate={isAfter}
                    showMonthYearPicker
                    dateFormat="yyyy년 MM월"
                />,
            pickerComponents: monthPicker,
            
        }        
        // this.procUp = this.procUp.bind(this);        
      }
    // onSortEnd = (oldIndex, newIndex) => {
    //     setItems((array) => arrayMoveImmutable(array, oldIndex, newIndex))
    // }

    handleClose = () => this.setState((state) => {
        return { ...state, showCanvas: false };
    });
    handleShow = () => this.setState((state) => {
        return { ...state, showCanvas: true };
    });

    isAfter = (date) => {
        const day = getDay(date);
        return date > new Date('2023-10-18');
      };

    renderYearContent = (year) => {
        const tooltipText = `${year} 년`;
        return <span title={tooltipText}>{year}</span>;
    };

    renderMonthContent = (month, shortMonth, longMonth) => {
        const tooltipText = `${longMonth} 월`;
        return <span title={tooltipText}>{shortMonth}</span>;
      };
    

    changeMode = (mode) => {
        console.log(mode);
    }

    onSortEndCoin = (oldIndex, newIndex) => {
        // console.log(value);
        // console.log(value2);
        // let state = this.state;
        // state.songs = arrayMove(state.songs, oldIndex, newIndex);
        this.setState((state) => {
            // state.songs = arrayMove(state.songs, oldIndex, newIndex);
            // console.log(state.songs);
            // state.songs.forEach((item, index) => {
            //     item.proc = (index+1);
            // });  
            return { coinRanks: arrayMoveImmutable(state.coinRanks, oldIndex, newIndex) };
        }, () => {
            let newArray = this.state.coinRanks.map((item, index) => {
                item.proc = (index+1);
                return item;
            }); 
            axios.post(serverURL+"modifyrank", { isArray: true, sortable:true, datas:newArray, dates: this.state.selectedDate.toISOString().split('T')[0], withCredentials: true })
            .then((Response)=>{
                // console.log(Response.data);
                this.setContents(Response);
            })
            .catch((Error)=>{console.log(Error)});
        });
    };

    onSortEndCoin = (oldIndex, newIndex) => {
        // console.log(value);
        // console.log(value2);
        // let state = this.state;
        // state.songs = arrayMove(state.songs, oldIndex, newIndex);
        this.setState((state) => {
            // state.songs = arrayMove(state.songs, oldIndex, newIndex);
            // console.log(state.songs);
            // state.songs.forEach((item, index) => {
            //     item.proc = (index+1);
            // });  
            return { viewRanks: arrayMoveImmutable(state.viewRanks, oldIndex, newIndex) };
        }, () => {
            let newArray = this.state.viewRanks.map((item, index) => {
                item.proc = (index+1);
                return item;
            }); 
            axios.post(serverURL+"modifyrank", { isArray: true, sortable:true, datas:newArray, dates: this.state.selectedDate.toISOString().split('T')[0], withCredentials: true })
            .then((Response)=>{
                // console.log(Response.data);
                this.setContents(Response);
            })
            .catch((Error)=>{console.log(Error)});
        });
    };

    // updateSongs = async () => {
    //     console.log(this.state.songs);
    //     // axios.post(serverURL+"modifysong", { isArray: true, datas:capsule, dates: this.state.selectedDate.toISOString().split('T')[0], withCredentials: true })
    //     // .then((Response)=>{
    //     //     // console.log(Response.data);
    //     //     this.setContents(Response);
    //     // })
    //     // .catch((Error)=>{console.log(Error)});
    // }

    ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
        <button className="example-custom-input" onClick={onClick} ref={ref}>
          {value}
        </button>
    ));

    updateDate = async (date) => {
        let state = this.state;
        state.selectedDate = date;        
        state.newSong.dates = date.toISOString().split('T')[0];        
        state.songs = [];
        state.songsList = "아직 입력된 음악이 없습니다";
        // this.setState(state, async () => {
        //     console.log(this.state);
        //     await axios.post(statusURL, { date: date.toISOString().split('T')[0], withCredentials: true })
        //     .then((Response)=>{
        //         // console.log(Response);            
        //         this.setContents(Response);
        //     })
        //     .catch((Error)=>{console.log(Error)});
        // });
                
    }

    removeSong = async (id) => {        
        // console.log(id);
        let capsule = {
            where: {
                id:id
            }
        }
       
        axios.post(serverURL+"delsong", { where:capsule, dates: this.state.selectedDate.toISOString().split('T')[0], withCredentials: true })
        .then((Response)=>{
            // console.log(Response.data);
            this.setContents(Response);
        })
        .catch((Error)=>{console.log(Error)});

    }

    changeSong = (id, target, event) => {
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
        // this.setState(state);
        // console.log(capsule);
        // let data = [capsule];
        // console.log(data);
        
        
        axios.post(serverURL+"modifysong", { isArray: false, datas:capsule, dates: this.state.selectedDate.toISOString().split('T')[0], withCredentials: true })
        .then((Response)=>{
            // console.log(Response.data);
            this.setContents(Response);
        })
        .catch((Error)=>{console.log(Error)});
    }

    procChange = (id, action) => {
        let state = this.state;
        let buffer;
        // console.log(id);
        // console.log(action);
        switch(action){
            case "up":
                buffer = state.songs[id].proc;
                state.songs[id].proc = state.songs[id-1].proc;
                state.songs[id-1].proc = buffer;
                break;
            case "down":                                
                buffer = state.songs[id].proc;
                state.songs[id].proc = state.songs[id+1].proc;
                state.songs[id+1].proc = buffer;
                break;
            default:
                break;
        }
        // console.log(state.songs);
        let capsule = state.songs.map((item, index) => {
            return {
                where:{
                    where: {
                        id: item.id,
                    },
                },
                data: {                
                    proc: item.proc
                }                
            }
        });
        axios.post(serverURL+"modifysong", { isArray: true, datas:capsule, dates: this.state.selectedDate.toISOString().split('T')[0], withCredentials: true })
        .then((Response)=>{
            // console.log(Response.data);
            this.setContents(Response);
        })
        .catch((Error)=>{console.log(Error)});
    }

    saveRequestSong = () => {        
        
        axios.post(serverURL+"addsong", { data:this.state.newSong , withCredentials: true })
        .then((Response)=>{
            // console.log(Response.data);
            this.setContents(Response);
        })
        .catch((Error)=>{console.log(Error)});

    }


    onPopup = (url) => {
        if(this.state.canLink){
            window.open(url, "_blank", "noopener, noreferrer");
        }
    }
    
    sendPush = () => {
        axios.post(serverURL+"push", { data:{title:"", body:""} , withCredentials: true })
        .then((Response)=>{
            // console.log(Response.data);            
        })
        .catch((Error)=>{console.log(Error)});
    }

    sendPost = () => {
        axios.post(serverURL+"tiktok/callback", { data:{title:"", body:""} , withCredentials: true })
        .then((Response)=>{
            // console.log(Response.data);            
        })
        .catch((Error)=>{console.log(Error)});
    }

    setContents = (Response) => {
        
        let state = this.state;
        let status = Response.data.status.live? true : false;
        state.status = Response.data.status;
        state.session = Response.data.session.passport ? Response.data.session.passport.user : null;
        state.updateButton = state.session ? (
            <Button key={Math.random()+state.selectedDate.toISOString()} variant='outline-primary' onClick={()=>this.updateStat()}>
                방송상태 업데이트
            </Button>
        ) : null;
        ////padding: "0px"}}>
        let sizes = "30";
        let statusIndicator = status?<Online width={sizes} height={sizes}></Online> : <Offline width={sizes} height={sizes}></Offline>
        let lists = Response.data.songs.map((item, index, parent) => {       
            return (
                <SortableItem key={Math.random()+state.selectedDate.toISOString()} index={index} style={styleData.capsule}>
                    <Container className="item" tabIndex={0} id="SongListdiv" style={styleData.capsule}> 
                        <Row key={Math.random()+state.selectedDate.toISOString()}>
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
                                                onChange={(e)=>{this.changeSong(item.id, "singer", e)}}
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
                                                onChange={(e)=>{this.changeSong(item.id, "title", e)}}
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
                                                onChange={(e)=>{this.changeSong(item.id, "requester", e)}}
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
                                                onChange={(e)=>{this.changeSong(item.id, "isReaction", e)}}
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
                                                onChange={(e)=>{this.changeSong(item.id, "isRequest", e)}}
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
                                                onChange={(e)=>{this.changeSong(item.id, "isToSing", e)}}
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
                                                onChange={(e)=>{this.changeSong(item.id, "isComplete", e)}}
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
                                <Button variant="outline-danger" className={item.id} onClick={() => this.removeSong(item.id)}><FaTrash/></Button>
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
        });   
        
        let now = true;
        let compList2 = Response.data.songs.length > 0 ? Response.data.songs.map((item, index, parent) => {    
           
            let isComplete = item.isComplete ? <PiCheckBold width={30} height={30}></PiCheckBold> : null;
            
            let isReaction = item.isReaction ? <PiGiftDuotone color={styleData.icon.color.gift}/> : null ;
            
            let isRequest = item.isRequest ? <PiClipboardTextDuotone color={styleData.icon.color.request} /> : null;
            let isToSing = item.isToSing ? <PiMicrophoneStageDuotone color={styleData.icon.color.sing} width={30} height={30} /> : <PiMusicNotesDuotone color={styleData.icon.color.bgm} width={30} height={30} />;
            let nowPlaying = null ;
            let nowplayingid = "songs";
            let endBG = isComplete ? styleData.complete : styleData.remain;
            if(!item.isComplete && now){
                now = false;
                nowPlaying = <PiCaretRightBold color='red'></PiCaretRightBold>;
                nowplayingid = "nowPlaying";
                endBG = styleData.now;
            }
            
            let songData = item.singer +" - "+ item.title;
                                    
            return (
                <ListGroup.Item as="li" key={Math.random()+state.selectedDate.toISOString()} style={endBG} onClick={() => this.onPopup(item.video)}>
                    <Container tabIndex={0} id={nowplayingid} style={{padding: "0px"}}>
                        <Row>
                            <Col xs={4} className='playlistCell'>
                            { nowPlaying }{ isReaction }{ isRequest }{ isToSing } { isComplete }
                            </Col>
                            <Col xs={5} className='playlistCell'>
                                <marquee // eslint-disable-line jsx-a11y/no-distracting-elements
                                >{ songData }</marquee>
                            </Col>
                            <Col xs={3} className='playlistCell'>
                                {item.requester}
                            </Col>
                        </Row>
                    </Container>
                </ListGroup.Item>
            );
        }) : <h6 className="center" style={{color: "#888888"}}>남은 노래가 없어요~ <span style={{color:"orange"}}>신청곡</span> 많이 많이 부탁드려요♡</h6>;

        state.compList2 = compList2;
        state.songsList = Response.data.songs.length > 0 ? lists : <h6 className="center" style={{color: "#888888"}}>남은 노래가 없어요~ <span style={{color:"orange"}}>신청곡</span> 많이 많이 부탁드려요♡</h6>;
        state.songs = Response.data.songs.length > 0 ? Response.data.songs : [] ;
        state.statusIndicator = statusIndicator;
        state.newSong = {
            proc: state.songs.length+1,
            singer: '',
            title: '',
            requester: '',
            isReaction: false,
            isRequest: false,
            isToSing: false,
            isComplete: false,
            dates: state.selectedDate.toISOString().split('T')[0],
        }
        this.setState(state, () => {
            // console.log(this.state);            
            // console.log();
            if(document.getElementById("nowPlaying")) document.getElementById("nowPlaying").scrollIntoView();
        });
    }

    updateStat = () => {

        
        axios.post(serverURL+"updateStat", { 
            date: getNow().toISOString().split('T')[0],
            withCredentials: true,
        })
        .then((Response)=>{
            // console.log(Response.data);            
            this.setContents(Response);
        })
        .catch((Error)=>{console.log(Error)});
    }

    updateState = (target, event) => {
        // console.log(event.target.value);
        let state = this.state;
        switch(target){
            case "date":                
                state.selectedDate = event.target.value;
                state.newSong.dates = event.target.value.toISOString().split('T')[0];
                break;
            case "singer":
                state.newSong.singer = event.target.value;
                break;
            case "title":
                state.newSong.title = event.target.value;
                break;
            case "requester":
                state.newSong.requester = event.target.value;
                break;
            case "isReaction":
                state.newSong.isReaction = this.state.newSong.isReaction? false : true;
                break;
            case "isRequest":
                state.newSong.isRequest = this.state.newSong.isRequest? false : true;
                break;
            case "isToSing":
                state.newSong.isToSing = this.state.newSong.isToSing? false: true;
                break;            
            case "isComplete":
                state.newSong.isComplete = this.state.newSong.isComplete? false : true;
                break;
            default:
                break;
        }        
        this.setState(state);
    }
    
    async componentDidMount() {
        // // console.log("welcome to Moderator Page!");
        // await axios.post(statusURL, { date: getNow().toISOString().split('T')[0], withCredentials: true })
        // .then((Response)=>{
        //     // console.log(Response.data.session.passport);            
        //     this.setContents(Response);
        // })
        // .catch((Error)=>{console.log(Error)});
        // // console.log(this.state.selectedDate);
        // if(!this.state.session){
            
        //     setInterval(async () => {
        //         await axios.post(statusURL, { date: this.state.selectedDate.toISOString().split('T')[0], withCredentials: true })
        //         .then((Response)=>{
        //             // console.log(Response.data);
        //             // console.log(this.state);   
        //             if((Object.entries(Response.data.status).toString() !== Object.entries(this.state.status).toString())
        //             ||
        //             (Object.entries(Response.data.songs).toString() !== Object.entries(this.state.songs).toString())
        //             ){
        //               console.log("update!");  
        //             }
        //             this.setContents(Response);
        //         })
        //         .catch((Error)=>{console.log(Error)});
        //     }, 10000);        
        // } else {
        //     this.setState((state)=> {
        //         return { ...state, loginComponents: <Profile></Profile> }
        //     })
        //     // console.log(JSON.parse(this.state.session.refToken));
        // }
    }

    

    
    render(){    
        return (
            <>
                <Container className='bodyContainer'>
                    <Row>
                    <Col xs={2} className="center" style={{ 
                            backgroundColor: 'WhiteSmoke', 
                        }}>
                            <Form.Select defaultValue={false} onChange={(mode)=>this.changeMode(mode)} aria-label="Default select example">
                                <option value={true}>월간</option>
                                <option value={false}>연간</option>
                            </Form.Select>
                        </Col>
                        <Col xs={8} style={{ 
                            backgroundColor: 'WhiteSmoke', 
                        }}>
                            {this.state.pickerComponents}
                        </Col>
                        <Col xs={2} className="center" style={{ 
                            backgroundColor: 'WhiteSmoke', 
                        }}>
                            <Button variant="primary" onClick={this.handleShow}>
                                <RxHamburgerMenu></RxHamburgerMenu>
                            </Button>                            
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
//         <SortableList onSortEnd={this.onSortEnd} className="list" draggedItemClassName="dragged">
            
//         </SortableList>
//     </Col>
// </Row>
// <Row className="justify-content-md-center">
//     <Col style={{ 
//         backgroundColor: 'WhiteSmoke',
//         height: '10px' 
//     }}>
//     </Col>
// </Row>
// <Row className="justify-content-md-center">
//     <Col style={{ 
//         backgroundColor: 'WhiteSmoke',
//         border: "dotted 3px",
//         borderColor: "green",
//         padding: "5px" 
//     }}>
//         <Stack direction="horizontal" gap={1} className="justify-content-md-center">
//             <Form.Control
//             placeholder="이름"
//             aria-label="이름"
//             aria-describedby="name"
//             value={this.state.newSong.singer}
//             onChange={event => this.updateState("singer", event)}
//             style={{width:150}}
//             />
//             -
//             <Form.Control
//             placeholder="제목"
//             aria-label="제목"
//             aria-describedby="title"
//             value={this.state.newSong.title}
//             onChange={event => this.updateState("title", event)}
//             width={20}
//             style={{width:210}}
//             />
//             신청 : 
//             <Form.Control
//             placeholder="신청자"
//             aria-label="신청자"
//             aria-describedby="requester"
//             value={this.state.newSong.requester}
//             onChange={event => this.updateState("requester", event)}
//             style={{width:140}}
//             />
//             <Form.Check // prettier-ignore
//                 type="switch"
//                 id="isRequest"
//                 label="리액션"
//                 checked={this.state.newSong.isReaction}
//                 onChange={event => this.updateState("isReaction", event)}
//             />
            <Form.Check // prettier-ignore
                type="switch"
                id="isRequest"
                label="신청곡"
                checked={this.state.newSong.isRequest}
                onChange={event => this.updateState("isRequest", event)}
            />
            <Form.Check // prettier-ignore
                type="switch"
                id="isToSing"
                label="부를노래"
                checked={this.state.newSong.isToSing}
                onChange={event => this.updateState("isToSing", event)}
            />
            <Form.Check // prettier-ignore
                type="switch"
                id="isComplete"
                label="완료"
                checked={this.state.newSong.isComplete}
                onChange={event => this.updateState("isComplete", event)}
            />
            <Button variant="outline-primary" onClick={() => this.saveRequestSong()}>저장</Button>
        </Stack>
    </Col>
</Row>
</Container>




    // <Row>
    //                                 <Col style={{ 
    //                                     backgroundColor: 'WhiteSmoke', 
    //                                 }}>
    //                                     현재곡
    //                                 </Col>
    //                             </Row>
    //                             <Row>
    //                                 <Col className='d-flex flex-wrap'>
    //                                     { this.state.nowSong }
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
    //                                     { this.state.remainSongs }
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
    //                                     { this.state.compList }
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


