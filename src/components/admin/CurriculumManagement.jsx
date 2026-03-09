import { useState } from 'react'
import {
    PlusIcon,
    TrashIcon,
    PencilIcon,
    VideoCameraIcon,
    DocumentTextIcon,
    ListBulletIcon,
    QuestionMarkCircleIcon,
    ChevronRightIcon,
    ChevronDownIcon,
    AcademicCapIcon,
    PhotoIcon
} from '@heroicons/react/24/outline'

export default function CurriculumManagement() {
    const [syllabi, setSyllabi] = useState([
        {
            id: 1,
            subject: 'Mathematics',
            classLevel: '10th Standard',
            modules: [
                {
                    id: 101,
                    title: 'Quadratic Equations',
                    videoUrl: 'https://www.youtube.com/watch?v=XogXnUPkG68',
                    summary: 'Understanding the fundamentals of quadratic equations and the quadratic formula.',
                    learningObjectives: ['Solve equations by factoring', 'Apply the quadratic formula', 'Graph quadratic functions'],
                    quiz: [
                        { id: 1, question: 'What is the standard form of a quadratic equation?', options: ['ax + b = 0', 'ax² + bx + c = 0', 'a² + b² = c²', 'y = mx + c'], correctAnswer: 1 },
                        { id: 2, question: 'What is the discriminant?', options: ['b² - 4ac', '2a', '-b', '√a'], correctAnswer: 0 }
                    ]
                }
            ]
        },
        {
            id: 2,
            subject: 'Science',
            classLevel: '9th Standard',
            modules: [
                {
                    id: 201,
                    title: 'The Central Nervous System',
                    videoUrl: 'https://www.youtube.com/watch?v=qPix_X-9t7E',
                    summary: 'Exploring the brain and spinal cord, the command center of the human body.',
                    learningObjectives: ['Identify parts of the brain', 'Understand neuron transmission', 'Explain reflex actions'],
                    quiz: [
                        { id: 3, question: 'Which part of the brain controls balance?', options: ['Cerebrum', 'Cerebellum', 'Medulla', 'Hypothalamus'], correctAnswer: 1 },
                        { id: 4, question: 'What is the basic unit of the nervous system?', options: ['Cell', 'Neuron', 'Tissue', 'Organ'], correctAnswer: 1 }
                    ]
                }
            ]
        },
    ])

    const [isSyllabusModalOpen, setIsSyllabusModalOpen] = useState(false)
    const [isModuleModalOpen, setIsModuleModalOpen] = useState(false)
    const [selectedSyllabus, setSelectedSyllabus] = useState(null)
    const [editingSyllabus, setEditingSyllabus] = useState(null)
    const [editingModule, setEditingModule] = useState(null)

    // Syllabus Form State
    const [syllabusFormData, setSyllabusFormData] = useState({
        subject: '',
        classLevel: '8th Standard'
    })

    // Module Form State
    const [moduleFormData, setModuleFormData] = useState({
        title: '',
        videoUrl: '',
        summary: '',
        learningObjectives: '',
        quiz: [] // Simplified for now, will add quiz builder
    })

    const [expandedSyllabus, setExpandedSyllabus] = useState(null)

    const handleOpenSyllabusModal = (syllabus = null) => {
        if (syllabus) {
            setEditingSyllabus(syllabus)
            setSyllabusFormData({
                subject: syllabus.subject,
                classLevel: syllabus.classLevel
            })
        } else {
            setEditingSyllabus(null)
            setSyllabusFormData({
                subject: '',
                classLevel: '8th Standard'
            })
        }
        setIsSyllabusModalOpen(true)
    }

    const handleSaveSyllabus = () => {
        if (!syllabusFormData.subject.trim()) return

        if (editingSyllabus) {
            setSyllabi(syllabi.map(s => s.id === editingSyllabus.id ? { ...s, ...syllabusFormData } : s))
        } else {
            const newSyllabus = {
                id: Date.now(),
                ...syllabusFormData,
                modules: []
            }
            setSyllabi([...syllabi, newSyllabus])
        }
        setIsSyllabusModalOpen(false)
    }

    const handleDeleteSyllabus = (id) => {
        if (window.confirm('Are you sure you want to delete this syllabus?')) {
            setSyllabi(syllabi.filter(s => s.id !== id))
        }
    }

    const handleOpenModuleModal = (syllabusId, module = null) => {
        setSelectedSyllabus(syllabusId)
        if (module) {
            setEditingModule(module)
            setModuleFormData({
                title: module.title,
                videoUrl: module.videoUrl,
                summary: module.summary,
                summaryImage: module.summaryImage || '',
                learningObjectives: module.learningObjectives.join('\n'),
                quiz: module.quiz || []
            })
        } else {
            setEditingModule(null)
            setModuleFormData({
                title: '',
                videoUrl: '',
                summary: '',
                summaryImage: '',
                learningObjectives: '',
                quiz: []
            })
        }
        setIsModuleModalOpen(true)
    }

    const handleSaveModule = () => {
        if (!moduleFormData.title.trim()) return

        const preparedModule = {
            id: editingModule ? editingModule.id : Date.now(),
            title: moduleFormData.title,
            videoUrl: moduleFormData.videoUrl,
            summary: moduleFormData.summary,
            summaryImage: moduleFormData.summaryImage,
            learningObjectives: moduleFormData.learningObjectives.split('\n').filter(l => l.trim()),
            quiz: moduleFormData.quiz
        }

        setSyllabi(syllabi.map(s => {
            if (s.id === selectedSyllabus) {
                if (editingModule) {
                    return { ...s, modules: s.modules.map(m => m.id === editingModule.id ? preparedModule : m) }
                } else {
                    return { ...s, modules: [...s.modules, preparedModule] }
                }
            }
            return s
        }))
        setIsModuleModalOpen(false)
    }

    const handleDeleteModule = (syllabusId, moduleId) => {
        if (window.confirm('Are you sure you want to delete this module?')) {
            setSyllabi(syllabi.map(s => {
                if (s.id === syllabusId) {
                    return { ...s, modules: s.modules.filter(m => m.id !== moduleId) }
                }
                return s
            }))
        }
    }

    return (
        <div className="space-y-6">
            {/* Top Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h3 className="text-lg font-medium text-gray-900">Education Curriculum</h3>
                    <p className="text-sm text-gray-500 mt-1">Design syllabi and structured learning content for students</p>
                </div>
                <button
                    onClick={() => handleOpenSyllabusModal()}
                    className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-purple-700 transition-colors"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Add Syllabus
                </button>
            </div>

            {/* Syllabi List */}
            <div className="grid grid-cols-1 gap-4">
                {syllabi.map((syllabus) => (
                    <div key={syllabus.id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                        <div className={`p-5 flex items-center justify-between transition-colors ${expandedSyllabus === syllabus.id ? 'bg-purple-50' : 'hover:bg-gray-50'}`}>
                            <div
                                className="flex items-center cursor-pointer flex-1"
                                onClick={() => setExpandedSyllabus(expandedSyllabus === syllabus.id ? null : syllabus.id)}
                            >
                                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mr-4">
                                    <AcademicCapIcon className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <h4 className="text-base font-semibold text-gray-900">{syllabus.subject}</h4>
                                    <p className="text-sm text-gray-500">{syllabus.classLevel} • {syllabus.modules.length} Modules</p>
                                </div>
                                <div className="ml-4">
                                    {expandedSyllabus === syllabus.id ? (
                                        <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleOpenSyllabusModal(syllabus)}
                                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                    title="Edit Syllabus"
                                >
                                    <PencilIcon className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleDeleteSyllabus(syllabus.id)}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete Syllabus"
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Modules Section */}
                        {expandedSyllabus === syllabus.id && (
                            <div className="border-t border-gray-100 p-5 bg-white">
                                <div className="flex justify-between items-center mb-4">
                                    <h5 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Learning Modules</h5>
                                    <button
                                        onClick={() => handleOpenModuleModal(syllabus.id)}
                                        className="text-sm font-medium text-purple-600 hover:text-purple-700 flex items-center"
                                    >
                                        <PlusIcon className="w-4 h-4 mr-1" />
                                        New Module
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {syllabus.modules.length === 0 ? (
                                        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                                            <p className="text-sm text-gray-500">No modules added yet.</p>
                                        </div>
                                    ) : (
                                        syllabus.modules.map((module) => (
                                            <div key={module.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-between hover:border-purple-200 hover:bg-purple-50/30 transition-all">
                                                <div className="flex items-center flex-1">
                                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-gray-200 mr-3">
                                                        <DocumentTextIcon className="w-4 h-4 text-gray-500" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-900">{module.title}</p>
                                                        <div className="flex items-center gap-3 mt-1">
                                                            {module.videoUrl && (
                                                                <span className="flex items-center text-xs text-blue-600">
                                                                    <VideoCameraIcon className="w-3 h-3 mr-1" /> Video Included
                                                                </span>
                                                            )}
                                                            <span className="flex items-center text-xs text-green-600">
                                                                <ListBulletIcon className="w-3 h-3 mr-1" /> {module.learningObjectives.length} Objectives
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleOpenModuleModal(syllabus.id, module)}
                                                        className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors"
                                                    >
                                                        <PencilIcon className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteModule(syllabus.id, module.id)}
                                                        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                                                    >
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Syllabus Modal */}
            {isSyllabusModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsSyllabusModalOpen(false)}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">{editingSyllabus ? 'Edit Syllabus' : 'Add New Syllabus'}</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Subject Name</label>
                                    <input
                                        type="text"
                                        value={syllabusFormData.subject}
                                        onChange={(e) => setSyllabusFormData({ ...syllabusFormData, subject: e.target.value })}
                                        placeholder="e.g. Emotional Intelligence"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Class Level</label>
                                    <select
                                        value={syllabusFormData.classLevel}
                                        onChange={(e) => setSyllabusFormData({ ...syllabusFormData, classLevel: e.target.value })}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                    >
                                        {['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'].map(lvl => (
                                            <option key={lvl} value={`${lvl} Standard`}>{lvl} Standard</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="mt-6 flex gap-3">
                                <button onClick={handleSaveSyllabus} className="flex-1 bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition">Save</button>
                                <button onClick={() => setIsSyllabusModalOpen(false)} className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-50 transition">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Module Modal */}
            {isModuleModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsModuleModalOpen(false)}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">{editingModule ? 'Edit Content Module' : 'Add Content Module'}</h3>
                            <div className="max-h-[70vh] overflow-y-auto pr-2 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Module Title</label>
                                    <input
                                        type="text"
                                        value={moduleFormData.title}
                                        onChange={(e) => setModuleFormData({ ...moduleFormData, title: e.target.value })}
                                        placeholder="e.g. Recognizing Social Cues"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 flex items-center">
                                        <VideoCameraIcon className="w-4 h-4 mr-1 text-gray-400" /> Video URL
                                    </label>
                                    <input
                                        type="text"
                                        value={moduleFormData.videoUrl}
                                        onChange={(e) => setModuleFormData({ ...moduleFormData, videoUrl: e.target.value })}
                                        placeholder="https://youtube.com/..."
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 flex items-center">
                                        <ListBulletIcon className="w-4 h-4 mr-1 text-gray-400" /> Learning Objectives (one per line)
                                    </label>
                                    <textarea
                                        value={moduleFormData.learningObjectives}
                                        onChange={(e) => setModuleFormData({ ...moduleFormData, learningObjectives: e.target.value })}
                                        rows="3"
                                        placeholder="Recognize facial expressions&#10;Understand body language"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 flex items-center">
                                        <DocumentTextIcon className="w-4 h-4 mr-1 text-gray-400" /> Content Summary
                                    </label>
                                    <textarea
                                        value={moduleFormData.summary}
                                        onChange={(e) => setModuleFormData({ ...moduleFormData, summary: e.target.value })}
                                        rows="2"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 flex items-center">
                                        <PhotoIcon className="w-4 h-4 mr-1 text-gray-400" /> Summary Image URL (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={moduleFormData.summaryImage}
                                        onChange={(e) => setModuleFormData({ ...moduleFormData, summaryImage: e.target.value })}
                                        placeholder="https://example.com/image.jpg"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                    />
                                </div>

                                {/* Quiz Builder */}
                                <div className="border border-purple-100 rounded-lg overflow-hidden">
                                    <div className="bg-purple-50 px-4 py-2 border-b border-purple-100 flex items-center justify-between">
                                        <h4 className="text-sm font-semibold text-purple-900 flex items-center">
                                            <QuestionMarkCircleIcon className="w-4 h-4 mr-1" /> Quiz Questions
                                        </h4>
                                        <button
                                            onClick={() => {
                                                const newQ = { id: Date.now(), question: '', image: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' };
                                                setModuleFormData({ ...moduleFormData, quiz: [...moduleFormData.quiz, newQ] });
                                            }}
                                            className="text-xs font-medium text-purple-600 hover:text-purple-800"
                                        >
                                            + Add Question
                                        </button>
                                    </div>
                                    <div className="p-4 space-y-4 bg-white">
                                        {moduleFormData.quiz.length === 0 ? (
                                            <p className="text-xs text-gray-500 text-center py-2">No quiz questions added. Click "+ Add Question" to start.</p>
                                        ) : (
                                            moduleFormData.quiz.map((q, qIdx) => (
                                                <div key={q.id} className="p-4 border border-gray-100 rounded-lg bg-gray-50 space-y-3">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Question {qIdx + 1}</span>
                                                        <button
                                                            onClick={() => {
                                                                const newQuiz = moduleFormData.quiz.filter((_, i) => i !== qIdx);
                                                                setModuleFormData({ ...moduleFormData, quiz: newQuiz });
                                                            }}
                                                            className="text-red-400 hover:text-red-600 transition-colors"
                                                        >
                                                            <TrashIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <div>
                                                        <input
                                                            type="text"
                                                            value={q.question}
                                                            onChange={(e) => {
                                                                const newQuiz = [...moduleFormData.quiz];
                                                                newQuiz[qIdx].question = e.target.value;
                                                                setModuleFormData({ ...moduleFormData, quiz: newQuiz });
                                                            }}
                                                            placeholder="Enter question text..."
                                                            className="block w-full border border-gray-200 rounded-md py-2 px-3 text-sm focus:ring-purple-500 shadow-sm mb-2"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={q.image || ''}
                                                            onChange={(e) => {
                                                                const newQuiz = [...moduleFormData.quiz];
                                                                newQuiz[qIdx].image = e.target.value;
                                                                setModuleFormData({ ...moduleFormData, quiz: newQuiz });
                                                            }}
                                                            placeholder="Question Image URL (Optional)"
                                                            className="block w-full border border-gray-200 rounded-md py-1.5 px-3 text-xs focus:ring-purple-500 shadow-sm text-gray-600"
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-1 gap-3">
                                                        <p className="text-xs font-medium text-gray-500">Options (Select the correct answer)</p>
                                                        {q.options.map((opt, oIdx) => (
                                                            <div key={oIdx} className={`flex items-start gap-2 p-3 rounded-lg border transition-all ${q.correctAnswer === oIdx ? 'bg-green-50 border-green-200 ring-1 ring-green-200' : 'bg-white border-gray-200'}`}>
                                                                <input
                                                                    type="radio"
                                                                    name={`correct-${q.id}`}
                                                                    checked={q.correctAnswer === oIdx}
                                                                    onChange={() => {
                                                                        const newQuiz = [...moduleFormData.quiz];
                                                                        newQuiz[qIdx].correctAnswer = oIdx;
                                                                        setModuleFormData({ ...moduleFormData, quiz: newQuiz });
                                                                    }}
                                                                    className="mt-1.5 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                                                                    title="Mark as correct answer"
                                                                />
                                                                <textarea
                                                                    value={opt}
                                                                    onChange={(e) => {
                                                                        const newQuiz = [...moduleFormData.quiz];
                                                                        newQuiz[qIdx].options[oIdx] = e.target.value;
                                                                        setModuleFormData({ ...moduleFormData, quiz: newQuiz });
                                                                    }}
                                                                    rows="2"
                                                                    placeholder={`Option ${oIdx + 1}`}
                                                                    className="flex-1 w-full border-gray-200 rounded-md text-sm focus:ring-purple-500 focus:border-purple-500 resize-y min-h-[60px]"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-500 mb-1">Explanation (shown after wrong answer)</label>
                                                        <textarea
                                                            value={q.explanation || ''}
                                                            onChange={(e) => {
                                                                const newQuiz = [...moduleFormData.quiz];
                                                                newQuiz[qIdx].explanation = e.target.value;
                                                                setModuleFormData({ ...moduleFormData, quiz: newQuiz });
                                                            }}
                                                            rows="2"
                                                            placeholder="Explain why the correct answer is right..."
                                                            className="block w-full border border-gray-200 rounded-md py-2 px-3 text-sm focus:ring-purple-500 shadow-sm"
                                                        />
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 flex gap-3">
                                <button onClick={handleSaveModule} className="flex-1 bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition">Save Module</button>
                                <button onClick={() => setIsModuleModalOpen(false)} className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-50 transition">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
