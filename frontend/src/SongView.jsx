import React, { forwardRef } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';

import { FaChevronUp, FaChevronDown, FaTrash } from 'react-icons/fa6';
import { ReactComponent as Online } from './online.svg';
import { ReactComponent as Offline } from './offline.svg';
import axios from 'axios';
import { ko } from 'date-fns/esm/locale';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import './index.css';
// import { ReactComponent as RequestIcon } from './RequestIcon.svg';
// import { ReactComponent as BGMIcon } from './BGMIcon.svg';

// import Card from 'react-bootstrap/Card';
import { PiMicrophoneStageDuotone, PiMusicNotesDuotone, PiCaretRightBold, PiCheckBold, PiGiftDuotone, PiClipboardTextDuotone } from 'react-icons/pi';

import Profile from './Profile';
import Offcanvas from 'react-bootstrap/Offcanvas';
import {RxHamburgerMenu} from 'react-icons/rx';
// import RequestIcon from "./request.png";
// import BGMIcon from "./BGM.png";
// import ReactionIcon from "./REACTION.png";
// import nowIcon from "./now.png";


axios.defaults.withCredentials = true;
const loginURL = "https://song.cindy.team:3002/google";
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

export default class SongView extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            loginComponents: null,
            showCanvas: false,
            canLink: true,
            session: null,
            songs: [],
            songsList: "아직 입력된 음악이 없습니다",
            compList: "아직 입력된 음악이 없습니다",            
            compList2: "아직 입력된 음악이 없습니다",
            remainSongs: "아직 입력된 음악이 없습니다",
            nowSong: "아직 입력된 음악이 없습니다",
            updateButton: null,
            moderatorUI: null,
            status: { live:0 },
            statusIndicator: <Spinner animation="border" variant="primary" />,            
            selectedDate: getNow(),
            newSong: {
                proc: -1,
                singer: '',
                title: '',
                requester: '',
                isReaction: false,
                isRequest: false,
                isToSing: false,
                isComplete: false,
                dates: getNow().toISOString().split('T')[0],
            },
        }
        this.removeSong = this.removeSong.bind(this);
        // this.procUp = this.procUp.bind(this);
        
      }

    ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
        <button className="example-custom-input" onClick={onClick} ref={ref}>
          {value}
        </button>
    ));

    handleClose = () => this.setState((state) => {
        return { ...state, showCanvas: false };
    });
    handleShow = () => this.setState((state) => {
        return { ...state, showCanvas: true };
    });

    changeCanLink = async () => {
        let state = this.state;
        state.canLink = state.canLink ? false : true;
        this.setState(state);
    }

    updateDate = async (date) => {
        let state = this.state;
        state.selectedDate = date;        
        state.newSong.dates = date.toISOString().split('T')[0];        
        state.songs = [];
        state.songsList = "아직 입력된 음악이 없습니다";
        this.setState(state, async () => {
            console.log(this.state);
            await axios.post(statusURL, { date: date.toISOString().split('T')[0], withCredentials: true })
            .then((Response)=>{
                // console.log(Response);            
                this.setContents(Response);
            })
            .catch((Error)=>{console.log(Error)});
        });
                
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

    // <Stack key={item.id+state.selectedDate.toISOString()} direction="horizontal" gap={1} className="justify-content-md-center">
    //     {convertOrdinalNumber(item.proc)}
    //     <Form.Control
    //     placeholder="가수"
    //     aria-label="가수"
    //     aria-describedby="singer"
    //     value={item.singer}
    //     onChange={()=>{}}
    //     style={{width:150}}
    //     />
    //     -
    //     <Form.Control
    //     placeholder="제목"
    //     aria-label="제목"
    //     aria-describedby="title"
    //     value={item.title}
    //     onChange={()=>{}}
    //     style={{width:210}}
    //     />
    //     신청 : 
    //     <Form.Control
    //     placeholder="신청자"
    //     aria-label="신청자"
    //     aria-describedby="requester"
    //     value={item.requester}
    //     onChange={()=>{}}
    //     style={{width:140}}
    //     />
    //     <Form.Check // prettier-ignore
    //         type="switch"
    //         id="isRequest"
    //         label="신청곡"
    //         checked={item.isRequest}
    //         onChange={()=>{}}
    //     />
    //     <Form.Check // prettier-ignore
    //         type="switch"
    //         id="isToSing"
    //         label="부를노래"
    //         checked={item.isToSing}
    //         onChange={()=>{}}
    //     />
    //     <Form.Check // prettier-ignore
    //         type="switch"
    //         id="isComplete"
    //         label="완료"
    //         checked={item.isComplete}
    //         onChange={()=>{}}
    //     />
    //     <Button variant="outline-primary" className={item.id}  onClick={() => this.procChange(index, "up")}><FaChevronUp/></Button>
    //     <Button variant="outline-primary" className={item.id} onClick={() => this.procChange(index, "down")}><FaChevronDown/></Button>
    //     <Button variant="outline-danger" className={item.id} onClick={() => this.removeSong(item.id)}><FaTrash/></Button>
    // </Stack>

    onPopup = (url) => {
        if(this.state.canLink){
            window.open(url, "_blank", "noopener, noreferrer");
        }
    }

    setContents = (Response) => {
        
        let state = this.state;
        let status = Response.data.status.live? true : false;
        state.status = Response.data.status;
        state.session = Response.data.session.passport ? Response.data.session.passport.user : null;
        state.updateButton = state.session ? (
            <Button key={Math.random()+state.selectedDate.toISOString()} variant='outline-primary' onClick={()=>this.updateStat()}>
                업데이트
            </Button>
        ) : null;
        
        let sizes = "30";
        let statusIndicator = status?<Online width={sizes} height={sizes}></Online> : <Offline width={sizes} height={sizes}></Offline>
        let lists = Response.data.songs.map((item, index, parent) => {       
            return (
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
                        <Container>
                            <Row>
                                <Col className='noPadding'>
                                    <Button size='sm' variant={index>0?"outline-primary":"outline-secondary"} disabled={index>0?false:true} className={item.id}  onClick={() => this.procChange(index, "up")}><FaChevronUp/></Button>
                                </Col>
                            </Row>
                            <Row>
                                <Col className='noPadding'>
                                    <Button size='sm' variant={index<(parent.length-1)?"outline-primary":"outline-secondary"} disabled={index<(parent.length-1)?false:true} className={item.id} onClick={() => this.procChange(index, "down")}><FaChevronDown/></Button>
                                </Col>
                            </Row>
                        </Container>                        
                    </Col>
                    <Col xl={1} className='noPadding center'>
                        <Button variant="outline-danger" className={item.id} onClick={() => this.removeSong(item.id)}><FaTrash/></Button>
                    </Col>
                </Row>
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

        // let compList = Response.data.songsComplete.map((item, index, parent) => {    
        //     let ico = {
        //         req: <img className="thumbnail" src={RequestIcon} alt="RequestIcon"></img>,
        //         bgm: <img className="thumbnail" src={BGMIcon} alt="BGMIcon"></img>,
        //         reac: <img className="thumbnail" src={ReactionIcon} alt="ReactionIcon"></img>,                   
        //     }
        //     let isComplete = item.isComplete ? <PiCheckBold width={30} height={30}></PiCheckBold> : null;
        //     let isReaction = item.isReaction ? ico.reac : null ;
        //     let isRequest = item.isRequest ? ico.req : ico.bgm ;
        //     let isToSing = item.isToSing ? <PiMicrophoneStageDuotone width={30} height={30}></PiMicrophoneStageDuotone> : <PiMusicNotesDuotone  width={30} height={30}></PiMusicNotesDuotone>;

        //     return (
        //         <>
        //         <Card key={Math.random()+state.selectedDate.toISOString()} style={{ width: '22rem' }}>
        //             <Card.Header>{ isRequest }{ isReaction }{ isToSing } { isComplete }</Card.Header>
        //             <Card.Body>
        //             <Card.Title>{ item.singer } - { item.title }</Card.Title>
        //             <Card.Text className='noPadding' style={{alignContent: "center"}}>
        //                 {item.requester}
        //             </Card.Text>
        //             </Card.Body>
        //         </Card>
        //         <div key={Math.random()+state.selectedDate.toISOString()} className='center'>
        //             <PiCaretRightBold key={item.id+"3"+state.selectedDate.toISOString()}></PiCaretRightBold>              
        //         </div>
        //         </>
        //     );
        // });
        // let songs = Response.data.remainSongs;
        // let nowSongs = songs.slice(0, 1);
        
        // let remainSongs = songs.slice(1);
        // let nowSong = nowSongs.length > 0 ? nowSongs.map((item, index, parent) => {    
        //     let ico = {
        //         req: <img className="thumbnail" src={RequestIcon} alt="RequestIcon"></img>,
        //         bgm: <img className="thumbnail" src={BGMIcon} alt="BGMIcon"></img>,
        //         reac: <img className="thumbnail" src={ReactionIcon} alt="ReactionIcon"></img>,   
        //         now: <img className="thumbnail" src={nowIcon} alt="nowIcon"></img>
        //     }
        //     let isComplete = item.isComplete ? <PiCheckBold width={30} height={30}></PiCheckBold> : null;
        //     let isReaction = item.isReaction ? ico.reac : null ;
        //     let isRequest = item.isRequest ? ico.req : ico.bgm ;
        //     let isToSing = item.isToSing ? <PiMicrophoneStageDuotone width={30} height={30}></PiMicrophoneStageDuotone> : <PiMusicNotesDuotone  width={30} height={30}></PiMusicNotesDuotone>;

        //     return (
        //         <>
        //         <Card key={Math.random()+state.selectedDate.toISOString()} style={{ width: '22rem' }}>
        //             <Card.Header>{ isRequest }{ isReaction }{ isToSing } { isComplete } { ico.now }</Card.Header>
        //             <Card.Body>
        //             <Card.Title>{ item.singer } - { item.title }</Card.Title>
        //             <Card.Text className='noPadding' style={{alignContent: "center"}}>
        //                 {item.requester}
        //             </Card.Text>
        //             </Card.Body>
        //         </Card>
        //         </>
        //     );
        // }) : <h6 className="center" style={{color: "#888888"}}>남은 노래가 없어요~ <span style={{color:"orange"}}>신청곡</span> 많이 많이 부탁드려요♡</h6>;
        // let remainList = remainSongs.length > 0 ? remainSongs.map((item, index, parent) => {    
        //     let ico = {
        //         req: <img className="thumbnail" src={RequestIcon} alt="RequestIcon"></img>,
        //         bgm: <img className="thumbnail" src={BGMIcon} alt="BGMIcon"></img>,
        //         reac: <img className="thumbnail" src={ReactionIcon} alt="ReactionIcon"></img>,
        //     }
        //     let isComplete = item.isComplete ? <PiCheckBold width={30} height={30}></PiCheckBold> : null;
        //     let isReaction = item.isReaction ? ico.reac : null ;
        //     let isRequest = item.isRequest ? ico.req : ico.bgm ;
        //     let isToSing = item.isToSing ? <PiMicrophoneStageDuotone width={30} height={30}></PiMicrophoneStageDuotone> : <PiMusicNotesDuotone  width={30} height={30}></PiMusicNotesDuotone>;

        //     return (
        //         <>
        //         <Card key={Math.random()+state.selectedDate.toISOString()} style={{ width: '22rem' }}>
        //             <Card.Header>{ isRequest }{ isReaction }{ isToSing } { isComplete }</Card.Header>
        //             <Card.Body>
        //             <Card.Title>{ item.singer } - { item.title }</Card.Title>
        //             <Card.Text className='noPadding' style={{alignContent: "center"}}>
        //                 {item.requester}
        //             </Card.Text>
        //             </Card.Body>
        //         </Card>
        //         <div key={Math.random()+state.selectedDate.toISOString()} className='center'>
        //             <PiCaretRightBold key={item.id+"3"+state.selectedDate.toISOString()}></PiCaretRightBold>              
        //         </div>
        //         </>
        //     );
        // }) : <h6 className="center" style={{color: "#888888"}}>남은 노래가 없어요~ <span style={{color:"orange"}}>신청곡</span> 많이 많이 부탁드려요♡</h6>;
        // state.compList = compList;
        state.compList2 = compList2;
        // state.remainSongs = remainList;
        // state.nowSong = nowSong;
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

    // <Row
    //             key={item.id+"1"+state.selectedDate.toISOString()}
    //             className='justify-content-center'
                
    //             >
    //                 <Col className='noPadding center d-inline-flex' align="right" style={{border: "solid 1px"}}>
    //                   { item.singer } - { item.title }                        
    //                 </Col>
    //                 <Col className='noPadding center d-inline-flex' align="left">
    //                     신청자 : {item.requester}{ isRequest }{ isToSing }
    //                 </Col>
    //             </Row>

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
        // console.log("welcome to Moderator Page!");
        await axios.post(statusURL, { date: getNow().toISOString().split('T')[0], withCredentials: true })
        .then((Response)=>{
            // console.log(Response.data.session.passport);            
            this.setContents(Response);
        })
        .catch((Error)=>{console.log(Error)});
        // console.log(this.state.selectedDate);
        if(!this.state.session){
            this.setState((state)=> {
                return { ...state, loginComponents: <a href={loginURL}>구글 로그인</a> }
            })
            setInterval(async () => {
                await axios.post(statusURL, { date: this.state.selectedDate.toISOString().split('T')[0], withCredentials: true })
                .then((Response)=>{
                    // console.log(Response.data);
                    // console.log(this.state);   
                    if((Object.entries(Response.data.status).toString() !== Object.entries(this.state.status).toString())
                    ||
                    (Object.entries(Response.data.songs).toString() !== Object.entries(this.state.songs).toString())
                    ){
                      console.log("update!");  
                    }
                    this.setContents(Response);
                })
                .catch((Error)=>{console.log(Error)});
            }, 10000);        
        } else {
            this.setState((state)=> {
                return { ...state, loginComponents: <Profile></Profile> }
            })
            // console.log(JSON.parse(this.state.session.refToken));
        }
    }

    

    
    render(){    
        return (
            <>
                <Container className='bodyContainer'>
                    <Row>
                        <Col xs={2} className="center" style={{ 
                            backgroundColor: 'WhiteSmoke', 
                        }}>
                            { this.state.statusIndicator }
                        </Col>
                        <Col xs={8} style={{ 
                            backgroundColor: 'WhiteSmoke', 
                        }}>
                            <DatePicker
                                selected={this.state.selectedDate}
                                onChange={date => this.updateDate(date)} 
                                locale={ko}
                                dateFormat="yyyy년 MM월 dd일"
                                customInput={<this.ExampleCustomInput />}
                            />
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
                                        <PiClipboardTextDuotone color={styleData.icon.color.request} /> : 신청곡 / <PiGiftDuotone color={styleData.icon.color.gift} /> : 리액션 <br />
                                        <PiMusicNotesDuotone color={styleData.icon.color.bgm} /> : 틀어주는 노래 / <PiMicrophoneStageDuotone color={styleData.icon.color.sing} /> : 불러주는 노래                                        
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="justify-content-end" style={{ 
                                        backgroundColor: 'WhiteSmoke', 
                                    }}>
                                        <Form.Check // prettier-ignore
                                        type="switch"
                                        id="canLink"
                                        checked={this.state.canLink}                                        
                                        onChange={()=>{this.changeCanLink()}}
                                        label="클릭하여 노래재생"
                                        aria-label="클릭하여 노래재생"
                                        className='center'
                                    />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col width="100%" style={{height: (window.innerHeight*0.65), overflow: "auto"}}>
                                        <ListGroup as="ul" className='d-flex'>
                                            { this.state.compList2 }
                                        </ListGroup>
                                    </Col>
                                </Row>
                            </Container>                         
                            
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


