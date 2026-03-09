import { useState } from 'react'
import { CalendarIcon, PlusIcon, TrashIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

export default function Schedule({ tasks, setTasks, activeDay, setActiveDay }) {
    // State lifted to Dashboard.jsx

    /* 
    const [activeDay, setActiveDay] = useState('Monday')
    const [tasks, setTasks] = useState(...)
    */

    const [showAddTask, setShowAddTask] = useState(false)
    const [newTask, setNewTask] = useState({ time: '', title: '', type: 'Study' })

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

    const handleAddTask = () => {
        if (newTask.time && newTask.title) {
            setTasks({
                ...tasks,
                [activeDay]: [...tasks[activeDay], { ...newTask, id: Date.now(), completed: false }]
            })
            setNewTask({ time: '', title: '', type: 'Study' })
            setShowAddTask(false)
        }
    }

    const handleDeleteTask = (taskId) => {
        setTasks({
            ...tasks,
            [activeDay]: tasks[activeDay].filter(t => t.id !== taskId)
        })
    }

    const toggleComplete = (taskId) => {
        setTasks({
            ...tasks,
            [activeDay]: tasks[activeDay].map(t =>
                t.id === taskId ? { ...t, completed: !t.completed } : t
            )
        })
    }

    return (
        <div className="font-lora">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-black mb-2">My Schedule 📅</h1>
                <p className="text-gray-600 font-medium">Plan your week for success and balance</p>
            </div>

            <div className="grid lg:grid-cols-4 gap-6">
                {/* Days Sidebar */}
                <div className="lg:col-span-1 bg-white border-2 border-purple-200 rounded-2xl p-4 h-fit">
                    <div className="space-y-2">
                        {days.map(day => (
                            <button
                                key={day}
                                onClick={() => setActiveDay(day)}
                                className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-all flex justify-between items-center ${activeDay === day
                                    ? 'bg-black text-white shadow-lg shadow-black/10'
                                    : 'text-gray-500 hover:bg-purple-50 hover:text-purple-700'
                                    }`}
                            >
                                <span>{day}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${activeDay === day ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-600'
                                    }`}>
                                    {tasks[day].length}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Schedule Content */}
                <div className="lg:col-span-3">
                    <div className="bg-white border-2 border-purple-200 rounded-2xl p-6 min-h-[600px] relative">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black text-black">{activeDay}'s Plan</h2>
                            <button
                                onClick={() => setShowAddTask(true)}
                                className="bg-black text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-gray-800 transition-all flex items-center gap-2"
                            >
                                <PlusIcon className="w-4 h-4" />
                                Add Activity
                            </button>
                        </div>

                        {tasks[activeDay].length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-center">
                                <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-4">
                                    <CalendarIcon className="w-8 h-8 text-purple-300" />
                                </div>
                                <p className="text-gray-500 font-medium">No plans yet for {activeDay}</p>
                                <p className="text-sm text-purple-400">Add tasks to organize your day!</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {tasks[activeDay]
                                    .sort((a, b) => a.time.localeCompare(b.time))
                                    .map(task => (

                                        <div
                                            key={task.id}
                                            className={`group border-2 rounded-xl p-4 transition-all duration-500 hover:shadow-lg flex items-center gap-4 cursor-pointer transform ${task.completed
                                                    ? 'bg-green-50 border-green-300 shadow-green-100 scale-[1.02]'
                                                    : 'bg-white border-purple-100 hover:border-purple-300 hover:-translate-y-1'
                                                } ${!task.completed && task.title.includes('Science') ? 'animate-pulse ring-4 ring-yellow-100 border-yellow-400' : ''}`}
                                            onClick={() => toggleComplete(task.id)}
                                        >
                                            <button
                                                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${task.completed
                                                    ? 'bg-green-500 border-green-500 text-white rotate-0 scale-100'
                                                    : 'border-gray-300 group-hover:border-green-500 bg-white rotate-180 scale-90 opacity-70 group-hover:opacity-100'
                                                    }`}
                                            >
                                                {task.completed && <CheckCircleIcon className="w-5 h-5 animate-bounce-subtle" />}
                                            </button>

                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <h3 className={`font-bold text-lg transition-colors duration-300 ${task.completed ? 'text-green-800' : 'text-black'}`}>
                                                        {task.title}
                                                    </h3>
                                                    <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wide ${task.type === 'Study' ? 'bg-blue-100 text-blue-700' :
                                                        task.type === 'Wellness' ? 'bg-green-100 text-green-700' :
                                                            'bg-purple-100 text-purple-700'
                                                        }`}>
                                                        {task.type}
                                                    </span>
                                                </div>
                                                <p className={`text-sm font-medium ${task.completed ? 'text-green-600' : 'text-gray-500'}`}>
                                                    {task.time}
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => handleDeleteTask(task.id)}
                                                className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 transition-all"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Task Modal */}
            {
                showAddTask && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl p-6 w-full max-w-sm border-2 border-purple-200 shadow-xl">
                            <h3 className="text-xl font-black text-black mb-4">Add New Activity</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Activity Name</label>
                                    <input
                                        autoFocus
                                        type="text"
                                        value={newTask.title}
                                        onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border-2 border-gray-100 focus:border-purple-200 outline-none transition-colors"
                                        placeholder="e.g. Math Revision"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Time</label>
                                        <input
                                            type="time"
                                            value={newTask.time}
                                            onChange={e => setNewTask({ ...newTask, time: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl border-2 border-gray-100 focus:border-purple-200 outline-none transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Type</label>
                                        <select
                                            value={newTask.type}
                                            onChange={e => setNewTask({ ...newTask, type: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl border-2 border-gray-100 focus:border-purple-200 outline-none transition-colors"
                                        >
                                            <option value="Study">Study 📚</option>
                                            <option value="Wellness">Wellness 🧘</option>
                                            <option value="Other">Other ⚡</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-8">
                                <button
                                    onClick={() => setShowAddTask(false)}
                                    className="flex-1 px-4 py-2 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddTask}
                                    disabled={!newTask.title || !newTask.time}
                                    className="flex-1 bg-black text-white px-4 py-2 rounded-xl font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Add Plan
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    )
}
