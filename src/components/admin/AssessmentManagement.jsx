import { useState } from 'react'
import { PlusIcon, TrashIcon, PencilIcon, ChevronDownIcon, ChevronRightIcon, FolderIcon, FolderPlusIcon } from '@heroicons/react/24/outline'

export default function AssessmentManagement() {
    const [questions, setQuestions] = useState([
        {
            id: 1,
            text: 'How are you feeling today?',
            options: ['Very Happy 😊', 'Happy 🙂', 'Okay 😐', 'Sad 😢'],
            groups: ['Daily Check-in']
        },
        {
            id: 2,
            text: 'How well did you sleep last night?',
            options: ['Very Well 😴', 'Good 😌', 'Not Great 😪', 'Poorly 😫'],
            groups: ['Daily Check-in']
        },
        {
            id: 3,
            text: 'How confident do you feel about your studies?',
            options: ['Very Confident 💪', 'Confident 👍', 'Somewhat Confident 🤔', 'Not Confident 😟'],
            groups: ['Class 8th']
        },
    ])

    const [groups, setGroups] = useState([
        { id: 'Daily Check-in', name: 'Daily Check-in', color: 'purple', isDefault: true },
        { id: 'Class 8th', name: 'Class 8th Standard', color: 'green', isDefault: true },
        { id: 'Class 9th', name: 'Class 9th Standard', color: 'blue', isDefault: true },
        { id: 'Class 10th', name: 'Class 10th Standard', color: 'indigo', isDefault: true },
    ])

    const [selectedGroup, setSelectedGroup] = useState(null)
    const [expandedQuestion, setExpandedQuestion] = useState(null)
    const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false)
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false)
    const [editingQuestion, setEditingQuestion] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')

    const [questionFormData, setQuestionFormData] = useState({
        text: '',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        groups: []
    })

    const [groupFormData, setGroupFormData] = useState({
        name: '',
        color: 'purple'
    })

    const colorOptions = [
        { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
        { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
        { value: 'green', label: 'Green', class: 'bg-green-500' },
        { value: 'yellow', label: 'Yellow', class: 'bg-yellow-500' },
        { value: 'red', label: 'Red', class: 'bg-red-500' },
        { value: 'pink', label: 'Pink', class: 'bg-pink-500' },
        { value: 'indigo', label: 'Indigo', class: 'bg-indigo-500' },
        { value: 'orange', label: 'Orange', class: 'bg-orange-500' },
    ]

    const getColorClasses = (color) => {
        const colorMap = {
            purple: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200', hover: 'hover:bg-purple-50' },
            blue: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200', hover: 'hover:bg-blue-50' },
            green: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', hover: 'hover:bg-green-50' },
            yellow: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200', hover: 'hover:bg-yellow-50' },
            red: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200', hover: 'hover:bg-red-50' },
            pink: { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-200', hover: 'hover:bg-pink-50' },
            indigo: { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-200', hover: 'hover:bg-indigo-50' },
            orange: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200', hover: 'hover:bg-orange-50' },
        }
        return colorMap[color] || colorMap.purple
    }

    const handleOpenQuestionModal = (question = null) => {
        if (question) {
            setEditingQuestion(question)
            setQuestionFormData({
                text: question.text,
                option1: question.options[0] || '',
                option2: question.options[1] || '',
                option3: question.options[2] || '',
                option4: question.options[3] || '',
                groups: question.groups || []
            })
        } else {
            setEditingQuestion(null)
            setQuestionFormData({
                text: '',
                option1: '',
                option2: '',
                option3: '',
                option4: '',
                groups: selectedGroup ? [selectedGroup] : []
            })
        }
        setIsQuestionModalOpen(true)
    }

    const handleOpenGroupModal = () => {
        setGroupFormData({ name: '', color: 'purple' })
        setIsGroupModalOpen(true)
    }

    const handleSaveQuestion = () => {
        const options = [
            questionFormData.option1,
            questionFormData.option2,
            questionFormData.option3,
            questionFormData.option4
        ].filter(opt => opt.trim())

        if (!questionFormData.text || options.length < 2) {
            alert('Please provide a question and at least 2 options')
            return
        }

        if (editingQuestion) {
            setQuestions(questions.map(q =>
                q.id === editingQuestion.id
                    ? { ...q, text: questionFormData.text, options, groups: questionFormData.groups }
                    : q
            ))
        } else {
            const newQuestion = {
                id: Date.now(),
                text: questionFormData.text,
                options,
                groups: questionFormData.groups
            }
            setQuestions([...questions, newQuestion])
        }
        setIsQuestionModalOpen(false)
    }

    const handleSaveGroup = () => {
        if (!groupFormData.name.trim()) {
            alert('Please provide a group name')
            return
        }

        const newGroup = {
            id: groupFormData.name,
            name: groupFormData.name,
            color: groupFormData.color,
            isDefault: false
        }
        setGroups([...groups, newGroup])
        setIsGroupModalOpen(false)
    }

    const handleDeleteQuestion = (id) => {
        if (window.confirm('Are you sure you want to delete this question?')) {
            setQuestions(questions.filter(q => q.id !== id))
        }
    }

    const handleDeleteGroup = (groupId) => {
        const group = groups.find(g => g.id === groupId)
        if (group.isDefault) {
            alert('Cannot delete default groups')
            return
        }

        const hasQuestions = questions.some(q => q.groups.includes(groupId))
        if (hasQuestions) {
            alert('Cannot delete group with existing questions. Please delete or reassign questions first.')
            return
        }

        if (window.confirm(`Are you sure you want to delete the group "${group.name}"?`)) {
            setGroups(groups.filter(g => g.id !== groupId))
            if (selectedGroup === groupId) {
                setSelectedGroup(null)
            }
        }
    }

    const toggleQuestion = (id) => {
        setExpandedQuestion(expandedQuestion === id ? null : id)
    }

    const getGroupQuestions = (groupId) => {
        return questions.filter(q => q.groups.includes(groupId))
    }

    const filteredQuestions = selectedGroup
        ? questions.filter(q => q.groups.includes(selectedGroup))
        : questions

    const searchedQuestions = filteredQuestions.filter(q => {
        if (!searchTerm) return true
        return q.text.toLowerCase().includes(searchTerm.toLowerCase())
    })

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">Feelings Explorer</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            {selectedGroup
                                ? `Managing questions for: ${groups.find(g => g.id === selectedGroup)?.name}`
                                : 'Select a group to view and manage questions'}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleOpenQuestionModal()}
                            className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                            <PlusIcon className="w-5 h-5 mr-2" />
                            Add Question
                        </button>
                        <button
                            onClick={handleOpenGroupModal}
                            className="flex items-center px-4 py-2 border border-purple-600 text-purple-600 rounded-md shadow-sm text-sm font-medium hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                            <FolderPlusIcon className="w-5 h-5 mr-2" />
                            Create Group
                        </button>
                    </div>
                </div>
            </div>

            {/* Groups Grid */}
            <div className="mb-8">
                <h4 className="text-sm font-semibold text-gray-700 uppercase mb-3">Question Groups</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {groups.map((group) => {
                        const questionCount = getGroupQuestions(group.id).length
                        const colors = getColorClasses(group.color)
                        const isSelected = selectedGroup === group.id

                        return (
                            <div
                                key={group.id}
                                onClick={() => setSelectedGroup(group.id)}
                                className={`
                  relative p-4 rounded-lg border-2 cursor-pointer transition-all
                  ${isSelected
                                        ? `${colors.border} ${colors.bg} shadow-md`
                                        : `border-gray-200 bg-white hover:shadow-md ${colors.hover}`}
                `}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center">
                                        <FolderIcon className={`w-5 h-5 mr-2 ${colors.text}`} />
                                        <h5 className={`font-medium text-sm ${isSelected ? colors.text : 'text-gray-900'}`}>
                                            {group.name}
                                        </h5>
                                    </div>
                                    {!group.isDefault && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleDeleteGroup(group.id)
                                            }}
                                            className="text-gray-400 hover:text-red-600"
                                            title="Delete Group"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">
                                        {questionCount} {questionCount === 1 ? 'question' : 'questions'}
                                    </span>
                                    {isSelected && (
                                        <span className={`text-xs font-semibold ${colors.text}`}>Selected</span>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Questions Section */}
            {selectedGroup && (
                <div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                        <h4 className="text-sm font-semibold text-gray-700 uppercase">
                            Questions in {groups.find(g => g.id === selectedGroup)?.name}
                        </h4>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Search questions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full px-4 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        />
                    </div>

                    {/* Questions List */}
                    <div className="space-y-3">
                        {searchedQuestions.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-lg">
                                <p className="text-gray-500">
                                    {searchTerm ? `No questions found for "${searchTerm}"` : 'No questions in this group yet.'}
                                </p>
                                <button
                                    onClick={() => handleOpenQuestionModal()}
                                    className="mt-4 text-purple-600 hover:text-purple-700 text-sm font-medium"
                                >
                                    Add your first question
                                </button>
                            </div>
                        ) : (
                            searchedQuestions.map((question, index) => (
                                <div key={question.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                    <div className="p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start flex-1">
                                                <button
                                                    onClick={() => toggleQuestion(question.id)}
                                                    className="mr-3 mt-1 text-gray-400 hover:text-gray-600"
                                                >
                                                    {expandedQuestion === question.id ? (
                                                        <ChevronDownIcon className="w-5 h-5" />
                                                    ) : (
                                                        <ChevronRightIcon className="w-5 h-5" />
                                                    )}
                                                </button>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-xs font-semibold text-gray-500">Q{index + 1}</span>
                                                    </div>
                                                    <p className="text-sm font-medium text-gray-900">{question.text}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 ml-4">
                                                <button
                                                    onClick={() => handleOpenQuestionModal(question)}
                                                    className="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-md"
                                                    title="Edit Question"
                                                >
                                                    <PencilIcon className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteQuestion(question.id)}
                                                    className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-md"
                                                    title="Delete Question"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Expanded Options */}
                                        {expandedQuestion === question.id && (
                                            <div className="mt-4 pl-8 pt-3 border-t border-gray-100">
                                                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Answer Options:</p>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    {question.options.map((option, idx) => (
                                                        <div key={idx} className="flex items-center p-2 bg-purple-50 rounded-md">
                                                            <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-purple-200 text-purple-700 rounded-full text-xs font-bold mr-2">
                                                                {idx + 1}
                                                            </span>
                                                            <span className="text-sm text-gray-700">{option}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Add/Edit Question Modal */}
            {isQuestionModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsQuestionModalOpen(false)}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                            <div>
                                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                    {editingQuestion ? 'Edit Question' : 'Add New Question'}
                                </h3>

                                <div className="space-y-4">
                                    {/* Question Text */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Question Text
                                        </label>
                                        <textarea
                                            value={questionFormData.text}
                                            onChange={(e) => setQuestionFormData({ ...questionFormData, text: e.target.value })}
                                            rows="2"
                                            placeholder="e.g., How are you feeling today?"
                                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                        />
                                    </div>

                                    {/* Group Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Assign to Groups
                                        </label>
                                        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border border-gray-200 rounded-md">
                                            {groups.map(group => (
                                                <label key={group.id} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={questionFormData.groups.includes(group.id)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setQuestionFormData(prev => ({ ...prev, groups: [...prev.groups, group.id] }))
                                                            } else {
                                                                setQuestionFormData(prev => ({ ...prev, groups: prev.groups.filter(id => id !== group.id) }))
                                                            }
                                                        }}
                                                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                                    />
                                                    <span className="text-sm text-gray-700">{group.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                        {questionFormData.groups.length === 0 && (
                                            <p className="mt-1 text-xs text-red-500">Please select at least one group.</p>
                                        )}
                                    </div>

                                    {/* Answer Options */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Answer Options (4 options)
                                        </label>
                                        <div className="space-y-2">
                                            {[1, 2, 3, 4].map((num) => (
                                                <div key={num} className="flex items-center">
                                                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-purple-100 text-purple-700 rounded-full text-xs font-bold mr-2">
                                                        {num}
                                                    </span>
                                                    <input
                                                        type="text"
                                                        value={questionFormData[`option${num}`]}
                                                        onChange={(e) => setQuestionFormData({ ...questionFormData, [`option${num}`]: e.target.value })}
                                                        placeholder={`Option ${num} (e.g., Very Happy 😊)`}
                                                        className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <p className="mt-2 text-xs text-gray-500">
                                            💡 Tip: You can use emojis to make options more engaging!
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                                <button
                                    type="button"
                                    onClick={handleSaveQuestion}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:col-start-2 sm:text-sm"
                                >
                                    {editingQuestion ? 'Update' : 'Add'} Question
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsQuestionModalOpen(false)}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Group Modal */}
            {isGroupModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="group-modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsGroupModalOpen(false)}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full sm:p-6">
                            <div>
                                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4" id="group-modal-title">
                                    Create New Group
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Group Name
                                        </label>
                                        <input
                                            type="text"
                                            value={groupFormData.name}
                                            onChange={(e) => setGroupFormData({ ...groupFormData, name: e.target.value })}
                                            placeholder="e.g., Weekly Reflection"
                                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Color Theme
                                        </label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {colorOptions.map((color) => (
                                                <button
                                                    key={color.value}
                                                    type="button"
                                                    onClick={() => setGroupFormData({ ...groupFormData, color: color.value })}
                                                    className={`
                            p-3 rounded-md border-2 transition-all
                            ${groupFormData.color === color.value
                                                            ? 'border-gray-900 ring-2 ring-gray-900'
                                                            : 'border-gray-200 hover:border-gray-400'}
                          `}
                                                >
                                                    <div className={`w-full h-6 rounded ${color.class}`}></div>
                                                    <p className="text-xs mt-1 text-center text-gray-600">{color.label}</p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                                <button
                                    type="button"
                                    onClick={handleSaveGroup}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:col-start-2 sm:text-sm"
                                >
                                    Create Group
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsGroupModalOpen(false)}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
