import React from 'react';
import ReactDOM from 'react-dom';
import expect from 'expect';
import deepFreeze from 'deep-freeze';
import { createStore, combineReducers } from 'redux';


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

const FilterLink = ({ filter, currentFilter, children }) => {
    if (filter === currentFilter) {
        return <span>{children}</span>
    }

    return (
        <a href='#'
                onClick={ e => {
                        e.preventDefault();
                        store.dispatch({
                            type: 'SET_VISIBILITY_FILTER',
                            filter
                        });
                    }
                }>
                {children}
            </a>
    );
};

class TodoApp extends React.Component {
    render() {
        const { todos, visibilityFilter } = this.props;
        const visibleTodos = getVisibleTodos(todos, visibilityFilter);

        return (
            <div>
                <input type="text" ref={ node => { this.input = node; }}/>
                <button onClick={ () => {
                    store.dispatch({
                        type: 'ADD_TODO',
                        text: this.input.value,
                        id: nextTodoId++
                    });

                    this.input.value = '';
                }}>
                    Add Todo
                </button>
                <TodoList 
                    todos={visibleTodos}
                    onTodoClick={
                         (id) => {
                            store.dispatch({
                                type: 'TOGGLE_TODO',
                                id
                            });
                        }
                    }                    
                />
                <p>
                    Show: 
                    {' '}<FilterLink filter='SHOW_ALL' currentFilter={ visibilityFilter } >All</FilterLink>
                    {' '}<FilterLink filter ='SHOW_ACTIVE' currentFilter={ visibilityFilter } >Active</FilterLink>
                    {' '}<FilterLink filter ='SHOW_COMPLETED' currentFilter={ visibilityFilter } >Completed</FilterLink>
                </p>
            </div>
        );
    }
}

const render = () => {
    ReactDOM.render(
        <TodoApp 
            {...store.getState()}
        />,
        document.getElementById('root')
    );
};

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

const store = createStore(todoApp);
store.subscribe(render);
render();

// testAddTodo();
// testToggleTodo();
// testRemoveTodo();

// const store = createStore(todoApp);

// console.log('--- Initial state ---');
// console.log(store.getState());

// store.dispatch({
//     type: 'ADD_TODO',
//     id: 0,
//     text: 'Yo, first todo'
// });

// console.log('--- Current state ---');
// console.log(store.getState());

// console.log('--- Dispatching SET_VISIBILITY_FILTER ---');
// store.dispatch({
//     type: 'SET_VISIBILITY_FILTER',
//     filter: 'SHOW_COMPLETED'
// });

// console.log('--- Current state ---');
// console.log(store.getState());