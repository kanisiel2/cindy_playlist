import React from 'react';
// { useEffect, useState } from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
// import StatusUser from './statusUser';

import SongAdmin from './SongAdmin';
// import SongView from './SongView.jsx.bak';
import SongViewTest from './SongViewTest';
import Push from './Push';
import Guide from './Guide';
import RankAdmin from './RankAdmin';
// import cookie from 'react-cookies';



function App() {

  // let [session, setSession] = useState(null);
  // let [components, setComponents] = useState(null);

  // useEffect(() => {
  //   if(cookie.load('koa.sess')){
  //     // setSession(cookie.load('koa.sess'));
  //     setComponents(<StatusModerator></StatusModerator>);
  //   } else {      
  //     // setSession(null);
  //     setComponents(<StatusUser></StatusUser>);
  //   }
  // }, []);
  // {session? (<StatusModerator></StatusModerator>) : (<StatusUser></StatusUser>)}
  return (
    <div className="App"
      style={
        {
          backgroundColor: 'WhiteSmoke',
          height:(window.innerHeight*0.88),
          marginTop:(window.innerHeight*0.086)
        }
      }>
               
        <Routes>
          <Route path="/" element={<SongViewTest/> }/> 
          <Route path="/admin" element={<SongAdmin/> }/> 
          <Route path="/test" element={<RankAdmin/>}/>
          <Route path="/guide" element={<Guide/>}/>
          <Route path="/rankAdmin" element={<RankAdmin/>}/>
          <Route path="/pppp" element={<Push/>}/>
        </Routes>
    </div>
  );
}

export default App;
