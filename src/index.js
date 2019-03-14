import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore } from 'redux';
import Counter from './Counter';
import expect from 'expect';
import deepFreeze from 'deep-freeze';



ReactDOM.render(<App />, document.getElementById('root'));


const counter = (state = 0, action) => {
    switch (action.type) {
        case 'INCREMENT':
            return state + 1;
        case 'DECREMENT':
            return state - 1;
        default:
            return state;
    }
};

// const renderC = () => {
//   ReactDOM.render(
//         <Counter value={ store.getState() }
//               onIncrement={ () => 
//                 store.dispatch({
//                   type: 'INCREMENT'
//                 })
//               }

//               onDecrement={ () => 
//                 store.dispatch({
//                   type: 'DECREMENT'
//                 })
//               }
//             />,
//             document.getElementById('root'));
// };

// const store = createStore(counter);
// store.subscribe(renderC);

// renderC();

const addCounter = (list) => {
	return [...list, 0];
};

const testAddCounter = () => {
	const listBefore = [];
	const listAfter = [0];

	deepFreeze(listBefore);

	expect(
		addCounter(listBefore)
	).toEqual(listAfter);
};

const removeCounter = (list, index) => {
	return [
			list.slice(0, index),
			list.slice(index + 1)
			];
};

const testRemoveCounter = () => {
	const listBefore = [ 3, 5, 8];
	const listAfter = [3, 8];

	deepFreeze(listBefore);

	expect(
	removeCounter(listBefore, 1)
	).toEqual(listAfter);

};

testAddCounter();
testRemoveCounter();

console.log('All tests passed');


/*asdsa*/





// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
