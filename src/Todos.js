// ts-check

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import expect from 'expect';
import deepFreeze from 'deep-freeze';

import { combineReducers, createStore } from 'redux';
import { Provider, connect } from 'react-redux';


/* Action cretors */
let nextTodoId = 0;
const addTodo = (text) => {
    return {
        type: 'ADD_TODO',
        id: nextTodoId++,
        text
    };
};

const setVisibilityFilter = (filter) => {
    return {
        type: 'SET_VISIBILITY_FILTER',
        filter
    };
};

const toggleTodo = (id) => {
    return {
        type: 'TOGGLE_TODO',
        id
    };
};

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
let AddTodo = ({ dispatch }) => {
    let input;

    return (
        <div>
                <input type="text" ref={ node => { input = node; }}/>
                <button onClick={ () => {
                    dispatch(addTodo(input.value));
                    input.value = '';
                }}>
                    Add Todo
                </button>
            </div>
    );
};

// AddTodo = connect(
//     null,
//     dispatch => {
//         return { dispatch };
//     }
// )(AddTodo);

// Cool stuff with connect.
AddTodo = connect()(AddTodo);

/* Footer component */
const Footer = () => {
    return (
        <p>
            Show: 
            {' '}
            <FilterLink 
                filter='SHOW_ALL'
            >
                 All
             </FilterLink>
            {' '}
            <FilterLink 
                filter ='SHOW_ACTIVE'
            >
                 Active
             </FilterLink>
            {' '}
            <FilterLink 
                filter ='SHOW_COMPLETED'
            >
                 Completed
             </FilterLink>
        </p>
    );
};

/* FooterLink component */
const mapStateToLinkProps = (
    state,
    ownProps) => {
    return {
        active: ownProps.filter === state.visibilityFilter
    };
};

const mapDispatchToLinkProps = (dispatch, ownProps) => {
    return {
        onClick: () => {
            dispatch(
                setVisibilityFilter(ownProps.filter)
            );
        }
    };
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

const FilterLink = connect(
    mapStateToLinkProps,
    mapDispatchToLinkProps
)(Link);

/* VisibleTodoList */

const mapStateTodoListProps = (state) => {
    return {
         todos: getVisibleTodos(
            state.todos, 
            state.visibilityFilter
        )
    };
};

const mapDispatchToTodoListProps = (dispatch) => {
    return {
        onTodoClick: (id) => {
            dispatch(toggleTodo(id));
       }
    };
};

const VisibleTodoList = connect(
    mapStateTodoListProps,
    mapDispatchToTodoListProps
)(TodoList);

/* Rest */

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

const TodoApp = () => {
        return (
            <div>
                <AddTodo />
                <VisibleTodoList />
                <Footer />
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
    <Provider store={ createStore(todoApp) }>
        <TodoApp />
    </Provider>,
    document.getElementById('root')
);