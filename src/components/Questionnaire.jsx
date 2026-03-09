import { useState, useEffect } from 'react'
import { ClipboardDocumentListIcon, ChevronRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export default function Questionnaire({ user }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showGrid, setShowGrid] = useState(true)
  const [gridNumbers] = useState([3, 7, 2, 9]) // Fixed numbers for consistency
  const [showReport, setShowReport] = useState(false)
  const [activeIntervention, setActiveIntervention] = useState(null)

  const questions = [
    {
      id: 1,
      text: "Is anything making you feel overwhelmed or confused these days? On a scale of 0–10, how would you rate your mood today?",
      options: [
        { value: 8, label: "Very good (8-10)" },
        { value: 6, label: "Okay (5-7)" },
        { value: 3, label: "Low (2-4)" },
        { value: 1, label: "Very low (0-1)" }
      ]
    },
    {
      id: 2,
      text: "What is the amount of freedom you think you have?",
      options: [
        { value: 8, label: "Very good (8-10)" },
        { value: 6, label: "Okay (5-7)" },
        { value: 3, label: "Low (2-4)" },
        { value: 1, label: "Very low (0-1)" }
      ]
    },
    {
      id: 3,
      text: "Do you feel pressured in any way by School?",
      options: [
        { value: 9, label: "Almost all the time (8-10)" },
        { value: 6, label: "Kind of [sometimes] (5-7)" },
        { value: 3, label: "A little bit [once in a while] (2-4)" },
        { value: 1, label: "Nope [not really] (0-1)" }
      ]
    },
    {
      id: 4,
      text: "Do you feel pressured in any way by Friends?",
      options: [
        { value: 9, label: "Almost all the time (8-10)" },
        { value: 6, label: "Kind of [sometimes] (5-7)" },
        { value: 3, label: "A little bit [once in a while] (2-4)" },
        { value: 1, label: "Nope [not really] (0-1)" }
      ]
    },
    {
      id: 5,
      text: "Do you feel pressured in any way by Self?",
      options: [
        { value: 9, label: "Almost all the time (8-10)" },
        { value: 6, label: "Kind of [sometimes] (5-7)" },
        { value: 3, label: "A little bit [once in a while] (2-4)" },
        { value: 1, label: "Nope [not really] (0-1)" }
      ]
    },
    {
      id: 6,
      text: "Do you feel pressured in any way by Home?",
      options: [
        { value: 9, label: "Almost all the time (8-10)" },
        { value: 6, label: "Kind of [sometimes] (5-7)" },
        { value: 3, label: "A little bit [once in a while] (2-4)" },
        { value: 1, label: "Nope [not really] (0-1)" }
      ]
    },
    {
      id: 7,
      text: "Memory Test: Look at the numbers for 2 seconds, then fill in the missing squares.",
      type: "memory",
      gridNumbers: [3, 7, 2, 9],
      options: []
    }
  ]

  const handleAnswerSelect = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value })
    
    // Auto-advance after 2 seconds (except for memory test)
    if (questions[currentQuestion].type !== 'memory') {
      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1)
        }
      }, 2000)
    }
  }

  // Handle memory test progression
  const handleMemoryTestStart = () => {
    setShowGrid(true)
    setTimeout(() => {
      setShowGrid(false)
    }, 2000)
  }

  // Start memory test when reaching question 7
  useEffect(() => {
    if (currentQuestion === 6 && questions[currentQuestion].type === 'memory') {
      handleMemoryTestStart()
    }
  }, [currentQuestion])

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = () => {
    console.log('Assessment answers:', answers)
    setShowReport(true)
  }

  const currentQ = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  // Assessment Report Component
  if (showReport) {
    return (
      <div className="font-lora max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <MagnifyingGlassIcon className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">Assessment Complete!</h1>
            <MagnifyingGlassIcon className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-gray-600">Here's your personalized emotional wellness report</p>
        </div>

        {/* Key Insights */}
        <div className="bg-white border-2 border-purple-200 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">💡 Key Insights</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Strengths</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Good emotional awareness</li>
                <li>• Positive self-perception</li>
                <li>• Strong memory skills</li>
              </ul>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Areas to Focus</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Managing school pressure</li>
                <li>• Building confidence</li>
                <li>• Stress management</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Interventions */}
        <div className="bg-white border-2 border-purple-200 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">🎆 Recommended Interventions</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-red-100 to-orange-100 p-4 rounded-lg text-center">
              <span className="text-3xl mb-2 block">🔥</span>
              <h4 className="font-semibold text-gray-900 mb-2">Feelings Release Space</h4>
              <p className="text-sm text-gray-600 mb-3">Safe space to express and release difficult emotions</p>
              <button 
                onClick={() => setActiveIntervention('feelings')}
                className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800"
              >
                Start Activity
              </button>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-4 rounded-lg text-center">
              <span className="text-3xl mb-2 block">🧩</span>
              <h4 className="font-semibold text-gray-900 mb-2">Chunking Practice</h4>
              <p className="text-sm text-gray-600 mb-3">Step-by-step memory enhancement exercises</p>
              <button 
                onClick={() => setActiveIntervention('chunking')}
                className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800"
              >
                Begin Practice
              </button>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-teal-100 p-4 rounded-lg text-center">
              <span className="text-3xl mb-2 block">💬</span>
              <h4 className="font-semibold text-gray-900 mb-2">Box Breathing</h4>
              <p className="text-sm text-gray-600 mb-3">Guided breathing exercise with visual timer</p>
              <button 
                onClick={() => setActiveIntervention('breathing')}
                className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800"
              >
                Start Breathing
              </button>
            </div>
          </div>
        </div>
        {/* Intervention Modals */}
        {activeIntervention && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white border-2 border-purple-200 rounded-2xl shadow-xl p-8 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setActiveIntervention(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
              
              {activeIntervention === 'feelings' && <FeelingsRelease />}
              {activeIntervention === 'chunking' && <ChunkingPractice />}
              {activeIntervention === 'breathing' && <BoxBreathing />}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Feelings Release Modal Component
  function FeelingsRelease() {
    const [currentStep, setCurrentStep] = useState(0)
    const [feelings, setFeelings] = useState('')
    
    const steps = [
      "Take a deep breath and find a comfortable position",
      "Think about what's bothering you right now",
      "Write down your feelings in the space below",
      "Read your feelings out loud (or in your mind)",
      "Take another deep breath and let it go"
    ]

    return (
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">🔥 Feelings Release Space</h3>
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">Step {currentStep + 1} of {steps.length}</p>
          <div className="bg-gray-200 rounded-full h-2 mb-4">
            <div className="bg-green-600 h-2 rounded-full transition-all" style={{width: `${((currentStep + 1) / steps.length) * 100}%`}}></div>
          </div>
          <p className="text-lg text-gray-800 mb-4">{steps[currentStep]}</p>
          
          {currentStep === 2 && (
            <textarea
              value={feelings}
              onChange={(e) => setFeelings(e.target.value)}
              placeholder="Write your feelings here... It's safe to express yourself."
              className="w-full h-32 p-4 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          )}
        </div>
        
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
          >
            Previous
          </button>
          {currentStep < steps.length - 1 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              Next
            </button>
          ) : (
            <button
              onClick={() => setActiveIntervention(null)}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              Complete
            </button>
          )}
        </div>
      </div>
    )
  }

  // Chunking Practice Modal Component
  function ChunkingPractice() {
    const [currentStep, setCurrentStep] = useState(0)
    const [userInput, setUserInput] = useState('')
    const [chunks, setChunks] = useState([])
    
    const examples = [
      { original: "9876543210", chunked: "987-654-3210" },
      { original: "ABCDEFGHIJ", chunked: "ABC-DEF-GHI-J" },
      { original: "Remember to study math science english", chunked: "Remember to study | math science english" }
    ]

    const handleChunk = () => {
      const newChunks = userInput.match(/.{1,3}/g) || []
      setChunks(newChunks)
    }

    return (
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">🧩 Chunking Practice</h3>
        
        {currentStep === 0 && (
          <div>
            <p className="text-gray-700 mb-4">Chunking helps you remember information by breaking it into smaller, manageable pieces.</p>
            <div className="bg-purple-50 p-4 rounded-lg mb-4 border border-purple-200">
              <h4 className="font-semibold mb-2">Examples:</h4>
              {examples.map((ex, i) => (
                <div key={i} className="mb-2">
                  <span className="text-gray-600">Original: </span><span className="font-mono">{ex.original}</span><br/>
                  <span className="text-purple-600">Chunked: </span><span className="font-mono font-bold">{ex.chunked}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setCurrentStep(1)} className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800">
              Try It Yourself
            </button>
          </div>
        )}
        
        {currentStep === 1 && (
          <div>
            <p className="text-gray-700 mb-4">Enter some text or numbers to practice chunking:</p>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Enter text to chunk..."
              className="w-full p-3 border-2 border-purple-200 rounded-lg mb-4 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
            <button onClick={handleChunk} className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 mb-4">
              Create Chunks
            </button>
            
            {chunks.length > 0 && (
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h4 className="font-semibold mb-2">Your Chunks:</h4>
                <div className="flex flex-wrap gap-2">
                  {chunks.map((chunk, i) => (
                    <span key={i} className="bg-purple-200 px-3 py-1 rounded-full text-sm font-mono">{chunk}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  // Box Breathing Modal Component
  function BoxBreathing() {
    const [isActive, setIsActive] = useState(false)
    const [phase, setPhase] = useState('Inhale')
    const [count, setCount] = useState(4)
    
    useEffect(() => {
      let interval
      if (isActive) {
        interval = setInterval(() => {
          setCount(prev => {
            if (prev === 1) {
              setPhase(current => {
                switch(current) {
                  case 'Inhale': return 'Hold'
                  case 'Hold': return 'Exhale'
                  case 'Exhale': return 'Hold'
                  default: return 'Inhale'
                }
              })
              return 4
            }
            return prev - 1
          })
        }, 1000)
      }
      return () => clearInterval(interval)
    }, [isActive])

    return (
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">💬 Box Breathing</h3>
        <p className="text-gray-700 mb-6">Follow the rhythm: Inhale (4s) → Hold (4s) → Exhale (4s) → Hold (4s)</p>
        
        <div className="mb-8">
          <div className={`w-32 h-32 mx-auto rounded-lg border-4 transition-all duration-1000 ${
            phase === 'Inhale' ? 'bg-blue-200 border-blue-500 scale-110' :
            phase === 'Exhale' ? 'bg-green-200 border-green-500 scale-90' :
            'bg-yellow-200 border-yellow-500 scale-100'
          }`}>
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-2xl font-bold text-gray-800">{phase}</div>
              <div className="text-4xl font-bold text-gray-900">{count}</div>
            </div>
          </div>
        </div>
        
        <div className="space-x-4">
          <button
            onClick={() => setIsActive(!isActive)}
            className={`px-6 py-2 rounded-lg text-white ${
              isActive ? 'bg-black hover:bg-gray-800' : 'bg-black hover:bg-gray-800'
            }`}
          >
            {isActive ? 'Stop' : 'Start'} Breathing
          </button>
          <button
            onClick={() => {
              setIsActive(false)
              setPhase('Inhale')
              setCount(4)
            }}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Reset
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="font-lora max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <MagnifyingGlassIcon className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Feelings Explorer</h1>
          <MagnifyingGlassIcon className="w-8 h-8 text-purple-600" />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-black">Question {currentQuestion + 1} of {questions.length}</span>
          <span className="text-sm font-bold text-black">{Math.round(progress)}% Complete</span>
        </div>
        <div className="bg-gray-200 rounded-full h-2">
          <div className="bg-green-600 h-2 rounded-full transition-all duration-300" style={{width: `${progress}%`}}></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white border-2 border-purple-200 rounded-xl p-8 shadow-lg">
        <div className="flex items-start space-x-4 mb-6">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
            <ClipboardDocumentListIcon className="w-6 h-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {currentQ.text}
            </h3>
            
            {/* Memory Test Grid */}
            {currentQ.type === 'memory' ? (
              <div className="space-y-6">
                {showGrid ? (
                  <div className="flex flex-col items-center">
                    <p className="text-sm text-gray-600 mb-4">Memorize these numbers:</p>
                    <div className="grid grid-cols-2 gap-4">
                      {gridNumbers.map((number, index) => (
                        <div key={index} className="w-16 h-16 bg-purple-100 border-2 border-purple-300 rounded-lg flex items-center justify-center">
                          <span className="text-2xl font-bold text-purple-700">{number}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <p className="text-sm text-gray-600 mb-4">Fill in the numbers you remember:</p>
                    <div className="grid grid-cols-2 gap-4">
                      {[0, 1, 2, 3].map((index) => (
                        <input
                          key={index}
                          type="number"
                          min="0"
                          max="9"
                          placeholder="?"
                          className="w-16 h-16 border-2 border-purple-300 rounded-lg text-center text-2xl font-bold focus:border-purple-500 focus:outline-none bg-white"
                          onChange={(e) => {
                            const newAnswers = { ...answers }
                            if (!newAnswers[currentQ.id]) newAnswers[currentQ.id] = []
                            newAnswers[currentQ.id][index] = parseInt(e.target.value) || 0
                            setAnswers(newAnswers)
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {currentQ.options.map((option, index) => (
                  <label key={index} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-purple-300 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name={`question-${currentQ.id}`}
                      value={option.value}
                      checked={answers[currentQ.id] === option.value}
                      onChange={() => handleAnswerSelect(currentQ.id, option.value)}
                      className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-gray-900">{option.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          
          <div className="flex space-x-2">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === currentQuestion 
                    ? 'bg-purple-600' 
                    : answers[questions[index].id] 
                      ? 'bg-green-600' 
                      : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={!answers[currentQ.id]}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <span>Submit Assessment</span>
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!answers[currentQ.id]}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <span>Next</span>
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Assessment Info */}
      <div className="mt-6 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-2">📋 About this Assessment</h4>
        <p className="text-sm text-gray-600">
          This questionnaire helps us understand your emotional well-being and provide personalized support. 
          Your responses are confidential and will be used to create a supportive learning environment.
        </p>
      </div>
    </div>
  )
}