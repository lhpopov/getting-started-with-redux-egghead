import React from 'react';

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