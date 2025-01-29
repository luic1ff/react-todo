import { useState, useEffect } from 'react';
import { FiTrash2, FiCheckCircle, FiCircle, FiPlus, FiSun, FiMoon } from 'react-icons/fi';

type Todo = {
    id: number;
    text: string;
    completed: boolean;
    createdAt: string;
};

type Filter = 'all' | 'active' | 'completed';
type Theme = 'light' | 'dark';

const TodoList = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [inputText, setInputText] = useState<string>('');
    const [currentFilter, setCurrentFilter] = useState<Filter>('all');
    const [theme, setTheme] = useState<Theme>('light');

    // Загрузка из localStorage
    useEffect(() => {
        const savedTodos = localStorage.getItem('todos');
        if (savedTodos) setTodos(JSON.parse(savedTodos) as Todo[]);

        const savedTheme = localStorage.getItem('theme') as Theme || 'light';
        setTheme(savedTheme);
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }, []);

    // Сохранение в localStorage
    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
        localStorage.setItem('theme', theme);
    }, [todos, theme]);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.classList.toggle('dark');
    };

    const addTodo = () => {
        if (inputText.trim()) {
            setTodos([...todos, {
                id: Date.now(),
                text: inputText,
                completed: false,
                createdAt: new Date().toISOString()
            }]);
            setInputText('');
        }
    };

    const toggleComplete = (id: number) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    const deleteTodo = (id: number) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    const filteredTodos = todos.filter(todo => {
        if (currentFilter === 'active') return !todo.completed;
        if (currentFilter === 'completed') return todo.completed;
        return true;
    });

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-4xl mx-auto p-4 md:p-8 lg:p-12">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 lg:p-8 transition-all duration-300">
                    {/* Header Section */}
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white">
                            Todo List
                        </h1>
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                            {theme === 'light' ? (
                                <FiMoon size={24} className="text-gray-800 dark:text-gray-200"/>
                            ) : (
                                <FiSun size={24} className="text-gray-800 dark:text-gray-200"/>
                            )}
                        </button>
                    </div>

                    {/* Input Section */}
                    <div className="flex gap-3 mb-8">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputText(e.target.value)}
                            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && addTodo()}
                            placeholder="Add a new task..."
                            className="flex-1 p-3 lg:p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                        />
                        <button
                            onClick={addTodo}
                            className="bg-blue-500 hover:bg-blue-600 text-white p-3 lg:p-4 rounded-xl transition-colors flex items-center gap-2"
                        >
                            <FiPlus size={20} />
                            <span className="hidden lg:inline">Add Task</span>
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2 mb-6 flex-wrap">
                        {(['all', 'active', 'completed'] as Filter[]).map(filter => (
                            <button
                                key={filter}
                                onClick={() => setCurrentFilter(filter)}
                                className={`px-4 py-2 rounded-lg capitalize text-sm lg:text-base ${
                                    currentFilter === filter
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    {/* Todo List */}
                    <div className="space-y-3">
                        {filteredTodos.map(todo => (
                            <div
                                key={todo.id}
                                className="flex items-center justify-between p-4 lg:p-5 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                            >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <button
                                        onClick={() => toggleComplete(todo.id)}
                                        className="flex-shrink-0 text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors"
                                    >
                                        {todo.completed ? (
                                            <FiCheckCircle size={24} className="text-green-500 dark:text-green-400" />
                                        ) : (
                                            <FiCircle size={24} />
                                        )}
                                    </button>
                                    <span
                                        className={`text-base lg:text-lg truncate ${
                                            todo.completed
                                                ? 'text-gray-400 dark:text-gray-500 line-through'
                                                : 'text-gray-700 dark:text-gray-200'
                                        }`}
                                    >
                    {todo.text}
                  </span>
                                </div>
                                <button
                                    onClick={() => deleteTodo(todo.id)}
                                    className="flex-shrink-0 text-red-400 hover:text-red-600 dark:hover:text-red-500 transition-colors ml-2"
                                >
                                    <FiTrash2 size={20} />
                                </button>
                            </div>
                        ))}

                        {!filteredTodos.length && (
                            <div className="text-center text-gray-400 dark:text-gray-500 py-6 text-lg">
                                No tasks found {currentFilter !== 'all' && `in ${currentFilter}`}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TodoList;