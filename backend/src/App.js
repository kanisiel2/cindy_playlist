import React, { Component } from 'react';
import axios from 'axios';
import queryString from 'query-string'

class App extends Component {
  render() {
    const f1 = async () => {
      await axios.get('/app', {})
    }
    const f2 = async () => {
      await axios.get('/bpp/호랑이', {})
    }
    const f3 = async () => {
      await axios.get('/cpp/?', {})
    }
    const f4 = async () => {
      await axios.get('/dpp', {
        params:
        {
          name: "홍길동",
          age: 30,
        }
      })
    }
    const name = "호랑이"
    const age = 100
    const obj = {
      name,
      age
    }

    const str = queryString.stringify(obj);

    const f5 = async () => {
      await axios.get('/epp/?' + str, obj)
    }

    const f6 = async () => {
      await axios.get('/fpp/?' + str, obj)
    }

    const f7 = async () => {
      await axios.post('/gpp', {
        name: "홍길동",
        age: 30,
      })
    }

    const obj1={
      name: "홍길동",
      age: 30
    }
    const f8 = async () => {
      await axios.post('/hpp', obj1)
    }

    return (
      <div>
        <button onClick={f1}>Click1</button>
        <button onClick={f2}>Click2</button>
        <button onClick={f3}>Click3</button>
        <button onClick={f4}>Click4</button>
        <button onClick={f5}>Click5</button>
        <button onClick={f6}>Click6</button>
        <button onClick={f7}>Click7</button>
        <button onClick={f8}>Click8</button>
      </div>
    );
  }
}

export default App;
