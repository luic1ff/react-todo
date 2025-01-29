import { useState, useEffect } from 'react';
import { FiTrash2, FiCheckCircle, FiCircle, FiSun, FiMoon, FiArrowRight } from 'react-icons/fi';

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

    useEffect(() => {
        const savedTodos = localStorage.getItem('todos');
        if (savedTodos) setTodos(JSON.parse(savedTodos) as Todo[]);

        const savedTheme = localStorage.getItem('theme') as Theme || 'light';
        setTheme(savedTheme);
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }, []);

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
        <div className="min-h-screen bg-gradient-to-br from-zinc-100 to-gray-200 dark:from-[#0a0a0a] dark:to-[#1a1a1a] transition-all duration-500">
            <div className="max-w-2xl mx-auto p-4 md:p-6 lg:p-8">
                <div className="bg-white/80 dark:bg-[#161616]/90 backdrop-blur-lg rounded-2xl shadow-2xl p-6 lg:p-8 transition-all duration-500 border border-white/20 dark:border-[#ffffff10]">
                    {/* Header Section */}
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                            TaskFlow
                        </h1>
                        <button
                            onClick={toggleTheme}
                            className="p-3 rounded-xl bg-white/50 dark:bg-[#212124]/50 hover:bg-white/80 dark:hover:bg-[#212124]/80 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20 dark:border-[#ffffff10]"
                        >
                            {theme === 'light' ? (
                                <FiMoon size={24} className="text-zinc-800 dark:text-amber-400"/>
                            ) : (
                                <FiSun size={24} className="text-zinc-800 dark:text-amber-400"/>
                            )}
                        </button>
                    </div>

                    {/* Input Section */}
                    <div className="flex flex-col gap-4 mb-8">
                        <div className="relative group">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addTodo()}
                                placeholder="What's next?"
                                className="w-full bg-white/80 dark:bg-[#212124]/80 dark:text-white px-6 py-4 rounded-xl shadow-xl border-2 border-transparent focus:border-amber-500 focus:dark:border-amber-400 outline-none transition-all duration-300 text-lg placeholder-zinc-400 dark:placeholder-zinc-600"
                            />
                            <button
                                onClick={addTodo}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-amber-500 hover:bg-amber-600 rounded-lg transition-all duration-300 shadow hover:shadow-md"
                            >
                                <FiArrowRight size={24} className="text-white"/>
                            </button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2 mb-6 flex-wrap">
                        {(['all', 'active', 'completed'] as Filter[]).map(filter => (
                            <button
                                key={filter}
                                onClick={() => setCurrentFilter(filter)}
                                className={`px-4 py-2 rounded-xl capitalize font-medium transition-all duration-300 ${
                                    currentFilter === filter
                                        ? 'bg-amber-500/90 text-white shadow-inner'
                                        : 'bg-white/50 dark:bg-[#212124]/50 text-zinc-600 dark:text-zinc-400 hover:bg-white/80 dark:hover:bg-[#212124]/80 shadow hover:shadow-md'
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
                                className="group flex items-center justify-between p-4 bg-white/50 dark:bg-[#212124]/50 backdrop-blur-sm rounded-xl hover:bg-white/80 dark:hover:bg-[#212124]/80 transition-all duration-300 shadow hover:shadow-md border border-white/20 dark:border-[#ffffff10]"
                            >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <button
                                        onClick={() => toggleComplete(todo.id)}
                                        className={`flex-shrink-0 transition-all duration-300 ${
                                            todo.completed
                                                ? 'text-amber-500 dark:text-amber-400'
                                                : 'text-zinc-400 hover:text-amber-500 dark:hover:text-amber-400'
                                        }`}
                                    >
                                        {todo.completed ? (
                                            <FiCheckCircle size={28} className="animate-pop-in"/>
                                        ) : (
                                            <FiCircle size={28}/>
                                        )}
                                    </button>
                                    <span
                                        className={`text-lg truncate transition-all duration-300 ${
                                            todo.completed
                                                ? 'text-zinc-400 dark:text-zinc-600 line-through'
                                                : 'text-zinc-700 dark:text-zinc-200'
                                        }`}
                                    >
                                        {todo.text}
                                    </span>
                                </div>
                                <button
                                    onClick={() => deleteTodo(todo.id)}
                                    className="flex-shrink-0 text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition-colors ml-2 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                >
                                    <FiTrash2 size={20} />
                                </button>
                            </div>
                        ))}

                        {!filteredTodos.length && (
                            <div className="text-center py-6">
                                <div className="text-zinc-400 dark:text-zinc-600 text-lg mb-2">
                                    ✨ Nothing here, add your first task!
                                </div>
                                <div className="text-sm text-zinc-400 dark:text-zinc-600">
                                    {currentFilter !== 'all' && `No ${currentFilter} tasks found`}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TodoList;