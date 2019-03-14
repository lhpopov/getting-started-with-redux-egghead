import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import Counter from './Counter';
import { createStore } from 'redux';

class App extends Component {
    render() {
        return (
            <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <span
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React in 
            
              seconds!
          </span>          
        </header>
      </div>
        );
    }
};


export default App;