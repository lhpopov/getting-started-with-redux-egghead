import React from 'react';
import ReactDOM from 'react-dom';
import expect from 'expect';
import deepFreeze from 'deep-freeze';
import { createStore } from 'redux';

class Counter extends React.Component {
    render() {
        return (
        	<div>
	            <div onClick={ this.handleClick }>
	            	{ this.props.value }
	            </div>
	            <button onClick={ this.props.onIncrement }>+</button>
	            <button onClick={ this.props.onDecrement }>-</button>
            </div>

        )
    }
}

export default Counter;

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

const renderC = () => {
  ReactDOM.render(
        <Counter value={ store.getState() }
              onIncrement={ () => 
                store.dispatch({
                  type: 'INCREMENT'
                })
              }

              onDecrement={ () => 
                store.dispatch({
                  type: 'DECREMENT'
                })
              }
            />,
            document.getElementById('root'));
};

const store = createStore(counter);
store.subscribe(renderC);

renderC();

const addCounter = (list) => {
    return [...list, 0];
};

const removeCounter = (list, index) => {
    return [
        ...list.slice(0, index),
        ...list.slice(index + 1)
    ];
};

const incrementCounter = (list, index) => {
    return [
        ...list.slice(0, index),
        list[index] + 1,
        ...list.slice(index + 1)
    ];
};

const testAddCounter = () => {
    const listBefore = [];
    const listAfter = [0];

    deepFreeze(listBefore);

    expect(
        addCounter(listBefore)
    ).toEqual(listAfter);
};

const testRemoveCounter = () => {
    const listBefore = [3, 5, 8];
    const listAfter = [3, 8];

    deepFreeze(listBefore);

    expect(
        removeCounter(listBefore, 1)
    ).toEqual(listAfter);

};

const testIncrementCounter = () => {
    const listBefore = [3, 5, 8];
    const listAfter = [3, 6, 8];


    expect(
        incrementCounter(listBefore, 1)
    ).toEqual(listAfter);
};

testAddCounter();
testRemoveCounter();
testIncrementCounter();

console.log('All tests passed');