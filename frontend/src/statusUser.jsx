import React, { useState, useEffect, useRef, forwardRef } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import Card from 'react-bootstrap/Card';
import { PiMicrophoneStageDuotone, PiMusicNotesDuotone, PiCaretRightBold, PiCheckBold } from 'react-icons/pi';
import RequestIcon from "./request.png";
import BGMIcon from "./BGM.png";
import ReactionIcon from "./REACTION.png";
import nowIcon from "./now.png";
 // eslint-disable-next-line
import Button from 'react-bootstrap/Button';
import { ReactComponent as Online } from './online.svg';
import { ReactComponent as Offline } from './offline.svg';
import axios from 'axios';
import { ko } from 'date-fns/esm/locale';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import './index.css';

axios.defaults.withCredentials = true;
const statusURL = "https://song.cindy.team:3002/status";

function getNow(){
    const TIME_ZONE = 9 * 60 * 60 * 1000; // 9시간
    const d = new Date();

    return new Date(d.getTime() + TIME_ZONE);
    
}


export default function StatusUser() {
     // eslint-disable-next-line
    // let [songs, setSongs] = useState(false);
    let [statusIndicator, setStatusIndicator] = useState(<Spinner animation="border" variant="primary" />);
     // eslint-disable-next-line
    let [compList, setCompList] = useState("아직 입력된 음악이 없습니다");
    let [remainSongs, setRemainSongs] = useState("아직 입력된 음악이 없습니다");
    let [nowSong, setNowSong] = useState("아직 입력된 음악이 없습니다");
    let [selectedDate, setSelectedDate] = useState(getNow());

    const DatepickerInput = forwardRef(({ value, onClick }, ref) => (
        <button className="example-custom-input" onClick={onClick} ref={ref}>
          {value}
        </button>
      ));
    // eslint-disable-next-line
    // const addCaret = async (arr) => {
    //     let length = arr.length;
    //     let buf = [1]
    //     let caret = buf.map((item, index, parent) => {    
    //         let ico = {
    //             req: <img className="thumbnail" src={RequestIcon} alt="RequestIcon"></img>,
    //             bgm: <img className="thumbnail" src={BGMIcon} alt="BGMIcon"></img>,
    //             reac: <img className="thumbnail" src={ReactionIcon} alt="ReactionIcon"></img>,                   
    //         }
    // eslint-disable-next-line
    //         let isComplete = item.isComplete ? <PiCheckBold width={30} height={30}></PiCheckBold> : null;
    // eslint-disable-next-line
    //         let isReaction = item.isReaction ? ico.reac : null ;
    //         let isRequest = item.isRequest ? ico.req : ico.bgm ;
    //         let isToSing = item.isToSing ? <PiMicrophoneStageDuotone width={30} height={30}></PiMicrophoneStageDuotone> : <PiMusicNotesDuotone  width={30} height={30}></PiMusicNotesDuotone>;

    //         return (
    //             <div key={Math.random()+selectedDate.toISOString()} className='center'>
    //                 <PiCaretRightBold key={"8"+Math.random()+selectedDate.toISOString()}></PiCaretRightBold>              
    //             </div>
    //         )
    //     });
    //     for(let idx = length-1; idx>0 ; idx--){
    //         arr = arr.splice(idx,0,caret[0]);
    //     }
    //     return arr;
    // }

    const changeDate = async (dateparam) => {
        setSelectedDate(dateparam);
        console.log(dateparam.toISOString());
        getDatas(dateparam);
    }

    const getDatas = async (dateParam) => {
        await axios.post(statusURL, { date: dateParam.toISOString().split('T')[0], withCredentials: true })
        .then((Response)=>{
            // console.log(Response.data.session.passport);

            let status = Response.data.status.live? true : false;
            let sizes = "30";
            let statusIndicator = status?<Online width={sizes} height={sizes}></Online> : <Offline width={sizes} height={sizes}></Offline>
            // setStatus(status);
            setStatusIndicator(statusIndicator);

            let compList = Response.data.songsComplete.map((item, index, parent) => {    
                let ico = {
                    req: <img className="thumbnail" src={RequestIcon} alt="RequestIcon"></img>,
                    bgm: <img className="thumbnail" src={BGMIcon} alt="BGMIcon"></img>,
                    reac: <img className="thumbnail" src={ReactionIcon} alt="ReactionIcon"></img>,                   
                }
                let isComplete = item.isComplete ? <PiCheckBold width={30} height={30}></PiCheckBold> : null;
                let isReaction = item.isReaction ? ico.reac : null ;
                let isRequest = item.isRequest ? ico.req : ico.bgm ;
                let isToSing = item.isToSing ? <PiMicrophoneStageDuotone width={30} height={30}></PiMicrophoneStageDuotone> : <PiMusicNotesDuotone  width={30} height={30}></PiMusicNotesDuotone>;
    
                return (
                    <>
                    <Card key={item.id+"1"+selectedDate.toISOString()} style={{ width: '22rem' }}>
                        <Card.Header>{ isRequest }{ isReaction }{ isToSing } { isComplete }</Card.Header>
                        <Card.Body>
                        <Card.Title>{ item.singer } - { item.title }</Card.Title>
                        <Card.Text className='noPadding' style={{alignContent: "center"}}>
                            {item.requester}
                        </Card.Text>
                        </Card.Body>
                    </Card>
                    <div key={Math.random()+selectedDate.toISOString()} className='center'>
                        <PiCaretRightBold key={"8"+Math.random()+selectedDate.toISOString()}></PiCaretRightBold>              
                    </div>
                    </>
                );
            });
            // compList = Response.data.songsComplete.length > 0 ? addCaret(compList) : compList;
            let songs = Response.data.remainSongs;
            let nowSongs = songs.slice(0, 1);
            
            let remainSongs = songs.slice(1);
            let nowSong = nowSongs.length > 0 ? nowSongs.map((item, index, parent) => {    
                let ico = {
                    req: <img className="thumbnail" src={RequestIcon} alt="RequestIcon"></img>,
                    bgm: <img className="thumbnail" src={BGMIcon} alt="BGMIcon"></img>,
                    reac: <img className="thumbnail" src={ReactionIcon} alt="ReactionIcon"></img>,   
                    now: <img className="thumbnail" src={nowIcon} alt="nowIcon"></img>
                }
                let isComplete = item.isComplete ? <PiCheckBold width={30} height={30}></PiCheckBold> : null;
                let isReaction = item.isReaction ? ico.reac : null ;
                let isRequest = item.isRequest ? ico.req : ico.bgm ;
                let isToSing = item.isToSing ? <PiMicrophoneStageDuotone width={30} height={30}></PiMicrophoneStageDuotone> : <PiMusicNotesDuotone  width={30} height={30}></PiMusicNotesDuotone>;
    
                return (
                    <Card key={item.id+"3"+selectedDate.toISOString()} style={{ width: '22rem' }}>
                        <Card.Header>{ isRequest }{ isReaction }{ isToSing } { isComplete } { ico.now }</Card.Header>
                        <Card.Body>
                        <Card.Title>{ item.singer } - { item.title }</Card.Title>
                        <Card.Text className='noPadding' style={{alignContent: "center"}}>
                            {item.requester}
                        </Card.Text>
                        </Card.Body>
                    </Card>
                );
            }) : <h2 className="center" style={{color: "#888888"}}>남은 노래가 없어요~ <span style={{color:"orange"}}>신청곡</span> 많이 많이 부탁드려요♡</h2>;
            let remainList = remainSongs.length > 0 ? remainSongs.map((item, index, parent) => {    
                let ico = {
                    req: <img className="thumbnail" src={RequestIcon} alt="RequestIcon"></img>,
                    bgm: <img className="thumbnail" src={BGMIcon} alt="BGMIcon"></img>,
                    reac: <img className="thumbnail" src={ReactionIcon} alt="ReactionIcon"></img>,
                }
                let isComplete = item.isComplete ? <PiCheckBold width={30} height={30}></PiCheckBold> : null;
                let isReaction = item.isReaction ? ico.reac : null ;
                let isRequest = item.isRequest ? ico.req : ico.bgm ;
                let isToSing = item.isToSing ? <PiMicrophoneStageDuotone width={30} height={30}></PiMicrophoneStageDuotone> : <PiMusicNotesDuotone  width={30} height={30}></PiMusicNotesDuotone>;
    
                return (
                    <>
                    <Card key={item.id+"4"+selectedDate.toISOString()} style={{ width: '22rem' }}>
                        <Card.Header>{ isRequest }{ isReaction }{ isToSing } { isComplete }</Card.Header>
                        <Card.Body>
                        <Card.Title>{ item.singer } - { item.title }</Card.Title>
                        <Card.Text className='noPadding' style={{alignContent: "center"}}>
                            {item.requester}
                        </Card.Text>
                        </Card.Body>
                    </Card>
                    <div key={Math.random()+selectedDate.toISOString()} className='center'>
                        <PiCaretRightBold key={"8"+Math.random()+selectedDate.toISOString()}></PiCaretRightBold>              
                    </div>
                    </>
                );
            }) : <h2 className="center" style={{color: "#888888"}}>남은 노래가 없어요~ <span style={{color:"orange"}}>신청곡</span> 많이 많이 부탁드려요♡</h2>;
            // remainList = remainSongs.length > 0 ? addCaret(remainList) : remainList;
            setCompList(compList);
            setRemainSongs(remainList);
            setNowSong(nowSong);
            // setSongsList(userLists);
        })
        .catch((Error)=>{console.log(Error)});
    }
    useEffect(() => {
        // getDatas(selectedDate);
    });

    useInterval(async () => {
        // Your custom logic here
        
        getDatas(selectedDate);
    }, 10000);

    
        
    return (
        <>
            <Container>
                <Row>
                    <Col xl={4} style={{ 
                        backgroundColor: 'WhiteSmoke', 
                    }}></Col>
                    <Col xl={4} style={{ 
                        backgroundColor: 'WhiteSmoke', 
                    }}>
                        <DatePicker
                            selected={selectedDate}
                            onChange={date => setSelectedDate(date)} 
                            locale={ko}
                            dateFormat="yyyy년 MM월 dd일"
                            customInput={<DatepickerInput />}
                        />
                    </Col>
                    <Col xl={4} className="center" style={{ 
                        backgroundColor: 'WhiteSmoke', 
                    }}>
                        <Container fluid>
                            <Row className="justify-content-md-end">
                                <Col md="auto" style={{ 
                                    backgroundColor: 'WhiteSmoke', 
                                }}>
                                    <span className="align-middle">라이브 여부 :</span>
                                </Col>
                                <Col md="auto" style={{ 
                                    backgroundColor: 'WhiteSmoke', 
                                }}>
                                    { statusIndicator }        
                                </Col>
                            </Row>
                        </Container>
                    </Col>                        
                </Row>
            </Container>
            <Container>
                <Row className="justify-content-md-center">
                    <Col>
                        <Container>
                            <Row>
                                <Col style={{ 
                                    backgroundColor: 'WhiteSmoke', 
                                }}>
                                    현재곡
                                </Col>
                            </Row>
                            <Row>
                                <Col className='d-flex flex-wrap'>
                                    { nowSong }
                                </Col>
                            </Row>
                            <Row>
                                <Col style={{ 
                                    backgroundColor: 'WhiteSmoke', 
                                }}>
                                    다음곡
                                </Col>
                            </Row>
                            <Row>
                                <Col className='d-flex flex-wrap'>
                                    { remainSongs }
                                </Col>
                            </Row>
                            <Row>
                                <Col style={{ 
                                    backgroundColor: 'WhiteSmoke', 
                                }}>
                                    들은곡
                                </Col>
                            </Row>
                            <Row>
                                <Col className='d-flex flex-wrap'>
                                    { compList }
                                </Col>
                            </Row>
                        </Container>                                                            
                    </Col>
                </Row>
            </Container>            
        </>
    );
    
}

function useInterval(callback, delay) {
    const savedCallback = useRef();
  
    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
  
    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }