import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import useFetch from '../hooks/useFetchHook';

import '../css/todos.css';

const Todos = () => {
    const location = useLocation();
    const user = location.state.user;
    const fetchObj = useFetch();
    const hasRunRef = useRef(false);

    const [todos, setTodos] = useState([]);
    const [sortCriterion, setSortCriterion] = useState('serial');
    const [searchCriterion, setSearchCriterion] = useState('serial');
    const [searchTerm, setSearchTerm] = useState('');
    const [newTodo, setNewTodo] = useState('');

    useEffect(() => {
        const fetchTodos = async () => {
            if (user && user.id) {
                console.log('Fetching todos for user:', user.id);
                const data = await fetchObj.fetchData(`todos?userId=${user.id}`);
                if (data) setTodos(data);
            }
        };

        if (!hasRunRef.current) {
            if (user && user.id) fetchTodos();
            hasRunRef.current = true;
        }
    }, []);

    const getNewId = async () => {
        const data = await fetchObj.fetchData('todos');
        let maxId = 0;

        if (data)
            maxId = data.reduce((max, todo) => Math.max(max, parseInt(todo.id, 10)), 0);
        else
            maxId = todos.reduce((max, todo) => Math.max(max, parseInt(todo.id, 10)), 0);

        return maxId + 1;
    };

    const handleSortChange = (e) => {
        setSortCriterion(e.target.value);
    };

    const handleSearchCriterionChange = (e) => {
        setSearchCriterion(e.target.value);
        setSearchTerm('');
    };

    const handleSearchTermChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleNewTodoChange = (e) => {
        setNewTodo(e.target.value);
    };

    const handleAddTodo = async () => {
        if (newTodo.trim() === '') return;

        const newTodoId = await getNewId();
        const newTodoItem = {
            userId: user.id,
            id: newTodoId.toString(),
            title: newTodo,
            completed: false
        };

        const response = await fetchObj.fetchData('todos', 'POST', newTodoItem);

        if (response) {
            setTodos([newTodoItem, ...todos]);
            setNewTodo('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleAddTodo();
        }
    };

    const handleDeleteTodo = async (id) => {
        const response = await fetchObj.fetchData(`todos/${id}`, 'DELETE', '');
        if (response)
            setTodos(todos.filter(todo => todo.id !== id));
    };

    const handleUpdateTodo = async (id, updatedTodo) => {
        const response = await fetchObj.fetchData(`todos/${id}`, 'PUT', updatedTodo);

        if (response)
            setTodos(todos.map(todo => (todo.id === id ? updatedTodo : todo)));
    };

    const handleToggleCompleted = async (id) => {
        const todo = todos.find(todo => todo.id === id);
        const updatedTodo = { ...todo, completed: !todo.completed };
        handleUpdateTodo(id, updatedTodo);
    };

    const sortTodos = (todos) => {
        switch (sortCriterion) {
            case 'serial':
                return todos.slice().sort((a, b) => b.id - a.id);
            case 'completed':
                return todos.slice().sort((a, b) => a.completed - b.completed);
            case 'alphabetical':
                return todos.sort((a, b) => a.title.localeCompare(b.title));
            case 'random':
                return todos.sort(() => Math.random() - 0.5);
            default:
                return todos;
        }
    };

    const getLocalIndex = (id) => {
        const sortedTodos = sortTodos([...todos]);
        return sortedTodos.findIndex(todo => todo.id === id) + 1;
    };

    const filterTodos = (todos) => {
        return todos.filter((todo) => {
            switch (searchCriterion) {
                case 'serial':
                    return getLocalIndex(todo.id).toString().includes(searchTerm);
                case 'title':
                    return todo.title.toLowerCase().includes(searchTerm.toLowerCase());
                case 'completed': {
                    if (searchTerm === '') return true;
                    const isCompleted = searchTerm.toLowerCase() === 'true';
                    return todo.completed === isCompleted;
                }
                default:
                    return true;
            }
        });
    };

    return (
        <div className="todos-container">
            <div className="todos-header">
                <h2>{user.username}'s Todos</h2>
                <div className="sort-container">
                    <p>Sort: </p>
                    <select onChange={handleSortChange} value={sortCriterion}>
                        <option value="serial">Serial</option>
                        <option value="completed">Completed</option>
                        <option value="alphabetical">Alphabetical</option>
                        <option value="random">Random</option>
                    </select>
                </div>
                <div className='search-container'>
                    <p>search: </p>
                    <select onChange={handleSearchCriterionChange} value={searchCriterion}>
                        <option value="serial">Serial</option>
                        <option value="title">Title</option>
                        <option value="completed">Completion Status</option>
                    </select>
                    <input
                        type="text"
                        onChange={handleSearchTermChange}
                        value={searchTerm}
                        placeholder="Search..."
                        list="suggestions"
                    />
                </div>
            </div>
            <div className="add-todo-container">
                <input
                    type="text"
                    value={newTodo}
                    onChange={handleNewTodoChange}
                    onKeyDown={handleKeyDown}
                    placeholder="new task..."
                />
                <button className='todo-button' onClick={handleAddTodo}>Add</button>
            </div>
            <div className="todos-list">
                <div className="todos-scroll">
                    <ul>
                        {sortTodos(filterTodos(todos)).map((todo) => (
                            <li key={todo.id} className="todo-item">
                                <span className="todo-id">{getLocalIndex(todo.id)}</span>
                                <span><input type="checkbox" checked={todo.completed} onChange={() => handleToggleCompleted(todo.id)} /></span>
                                <span className="todo-title">
                                    <input
                                        type="text"
                                        value={todo.title}
                                        onChange={(e) => handleUpdateTodo(todo.id, { ...todo, title: e.target.value })}
                                    />
                                </span>
                                <button onClick={() => handleDeleteTodo(todo.id)}>🗑️</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Todos;
