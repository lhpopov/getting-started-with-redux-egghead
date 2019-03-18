import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import expect from 'expect';
import deepFreeze from 'deep-freeze';
import { combineReducers } from 'redux';
import { createStore } from 'redux';

/* Todo component */
const Todo = ({
    onClick,
    text,
    completed
}) => {
    return (
        <li 
            onClick={onClick}
            style={{
                textDecoration: completed ? 'line-through' : 'none'
            }}
            >
            {text}
        </li>
    )
};

/* TodoList component */

const TodoList = ({
    todos,
    onTodoClick
}) => {
    return (
        <ul>
            { todos.map(todo =>
                <Todo 
                    key={todo.id}
                    {...todo}
                    onClick={ () => onTodoClick(todo.id)}
                 />
            )}
        </ul>
    );
};

/* AddTodo component */
const AddTodo = ({
    onAddClick,
    store
}) => {
    let input;

    return (
        <div>
                <input type="text" ref={ node => { input = node; }}/>
                <button 
                    onClick={ () => {
                        store.dispatch({
                            type: 'ADD_TODO',
                            id: nextTodoId++,
                            text: input.value
                        });
                        input.value = '';
                    }}
                    >
                    Add Todo
                </button>
            </div>
    );
};

/* Footer component */
const Footer = ({ store }) => {
    return (
        <p>
            Show: 
            {' '}
            <FilterLink 
                filter='SHOW_ALL'
                store={ store }
            >
                 All
             </FilterLink>
            {' '}
            <FilterLink 
                filter ='SHOW_ACTIVE'
                store={ store }
            >
                 Active
             </FilterLink>
            {' '}
            <FilterLink 
                filter ='SHOW_COMPLETED'
                store={ store }
            >
                 Completed
             </FilterLink>
        </p>
    );
};

/* FooterLink component */
class FilterLink extends React.Component {
    componentDidMount() {
        const { store } = this.props;
        this.unsubscribe = store.subscribe(() => {
            this.forceUpdate();
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        const props = this.props;
        const { store } = this.props;
        const state = store.getState();

        return (
            <Link 
                active={
                    props.filter === state.visibilityFilter
                }
                onClick={() => {
                        store.dispatch({
                            type: 'SET_VISIBILITY_FILTER',
                            filter: props.filter
                        });
                    }
                }
            >
            {props.children}
            </Link>
        );
    }
};

/* Link component */

const Link = ({
    active,
    children,
    onClick
}) => {
    if (active) {
        return <span>{children}</span>
    }

    return (
        <a href='#'
            onClick={ e => {
                e.preventDefault();
                onClick();
        }}>
            {children}
        </a>
    );
};

/* VisibleTodoList */
class VisibleTodoList extends Component{
    componentDidMount() {
        const { store } = this.props;
        this.unsubscribe = store.subscribe(() => {
            this.forceUpdate();
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render(){
        const props = this.props;
        const { store } = this.props;
        const state = store.getState();

        return (
            <TodoList 
                todos = { getVisibleTodos(
                        state.todos, 
                        state.visibilityFilter
                    )
                } 
                onTodoClick = {
                    (id) => {
                        store.dispatch({
                            type: 'TOGGLE_TODO',
                            id
                        });
                    }
                }
            /> 
        );
    }
}

/* Rest */

let nextTodoId = 0;

const getVisibleTodos = (todos, filter) => {
    switch (filter) {
        case 'SHOW_ALL':
            return todos;
        case 'SHOW_COMPLETED':
            return todos.filter(todo => todo.completed);
        case 'SHOW_ACTIVE':
            return todos.filter(todo => !todo.completed);
        default:
            return todos;
    }
};

const TodoApp = ({ store }) => {
        return (
            <div>
                <AddTodo store={ store } />
                <VisibleTodoList store={ store } />
                <Footer store={ store } />
            </div>
        );
}

const todo = (state, action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return { id: action.id, text: action.text, completed: false };
        case 'TOGGLE_TODO':
            if (state.id !== action.id) {
                return state;
            }

            return { ...state, completed: !state.completed }
        default:
            return state;
    }
};

const todos = (state = [], action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return [...state, todo(undefined, action)];
        case 'TOGGLE_TODO':
            return state.map(t => { return todo(t, action) });
        case 'REMOVE_TODO':
            return state.filter(todo => todo.id !== action.id);
        default:
            return state;
    }
};

const testAddTodo = () => {
    const stateBefore = [];
    const action = {
        type: 'ADD_TODO',
        id: 0,
        text: 'Todo redux test'
    };
    const stateAfter = [{
        id: 0,
        text: 'Todo redux test',
        completed: false
    }];

    deepFreeze(stateBefore);

    expect(
        todos(stateBefore, action)
    ).toEqual(stateAfter);
};

const testToggleTodo = () => {
    const stateBefore = [{
        id: 0,
        text: 'Todo redux test',
        completed: false
    }, {
        id: 1,
        text: 'Todo redux test. Already done.',
        completed: false
    }];

    const action = {
        type: 'TOGGLE_TODO',
        id: 1
    };

    const stateAfter = [{
        id: 0,
        text: 'Todo redux test',
        completed: false
    }, {
        id: 1,
        text: 'Todo redux test. Already done.',
        completed: true
    }];

    deepFreeze(stateBefore);

    expect(
        todos(stateBefore, action)
    ).toEqual(stateAfter);
};

const testRemoveTodo = () => {
    const stateBefore = [{
        id: 0,
        text: 'Todo redux test',
        completed: false
    }, {
        id: 1,
        text: 'Todo redux test. Already done.',
        completed: false
    }];

    const action = {
        type: 'REMOVE_TODO',
        id: 0
    };

    const stateAfter = [{
        id: 1,
        text: 'Todo redux test. Already done.',
        completed: false
    }];

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(
        todos(stateBefore, action)
    ).toEqual(stateAfter);
};

const visibilityFilter = (
    state = 'SHOW_ALL',
    action
) => {
    switch (action.type) {
        case 'SET_VISIBILITY_FILTER':
            return action.filter;
        default:
            return state;
    }
};

const todoApp = combineReducers({
    todos,
    visibilityFilter
});





ReactDOM.render(
    <TodoApp store={ createStore(todoApp) }/>,
    document.getElementById('root')
);