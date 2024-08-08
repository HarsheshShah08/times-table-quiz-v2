import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [settings, setSettings] = useState({
        numQuestions: 10,
        timePerQuestion: 15,
        tables: Array.from({ length: 20 }, (_, i) => i + 1),
        excludedTables: [1, 2, 3, 4, 5, 10, 11, 20],
        multipliers: Array.from({ length: 20 }, (_, i) => i + 1),
        excludedMultipliers: [1, 2, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
    });

    const [quizStarted, setQuizStarted] = useState(false);
    const [quizEnded, setQuizEnded] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [remainingTime, setRemainingTime] = useState(settings.timePerQuestion);
    const [showCountdown, setShowCountdown] = useState(false);
    const [countdown, setCountdown] = useState(5); // Countdown time in seconds
    const [timeTaken, setTimeTaken] = useState([]);
    const [feedback, setFeedback] = useState('');
    const [animationClass, setAnimationClass] = useState('');

    useEffect(() => {
        if (quizStarted && !quizEnded) {
            if (remainingTime <= 0) {
                handleAnswer(''); // Handle timeout
                return;
            }
            const timer = setInterval(() => {
                setRemainingTime((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [remainingTime, quizStarted, quizEnded]);

    useEffect(() => {
        if (showCountdown) {
            if (countdown <= 0) {
                setShowCountdown(false);
                setQuizStarted(true);
                setQuestions(generateQuestions());
                setTimeTaken((prev) => [...prev, Date.now()]);
                return;
            }
            const countdownTimer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(countdownTimer);
        }
    }, [showCountdown, countdown]);

    const generateQuestions = () => {
        const tables = settings.tables.filter(table => !settings.excludedTables.includes(table));
        const multipliers = settings.multipliers.filter(multiplier => !settings.excludedMultipliers.includes(multiplier));
        const questions = [];
        for (let i = 0; i < settings.numQuestions; i++) {
            const table = tables[Math.floor(Math.random() * tables.length)];
            const multiplier = multipliers[Math.floor(Math.random() * multipliers.length)];
            questions.push({
                question: `${table} x ${multiplier}`,
                answer: table * multiplier
            });
        }
        return questions;
    };

    const handleStartQuiz = () => {
        setShowCountdown(true);
    };

    const handleAnswer = (answer) => {
        const currentTime = Date.now();
        const timeTakenForQuestion = ((currentTime - timeTaken[timeTaken.length - 1]) / 1000).toFixed(2);
        const correct = parseInt(answer) === questions[currentQuestionIndex].answer;
        setUserAnswers((prevAnswers) => [...prevAnswers, { question: questions[currentQuestionIndex].question, answer, correct, timeTaken: timeTakenForQuestion }]);
        setAnimationClass(correct ? 'correct-animation' : 'incorrect-animation');
        setFeedback(correct ? 'Correct!' : 'Wrong answer!');
        
        setTimeout(() => {
            setFeedback('');
            setAnimationClass('');
            if (currentQuestionIndex + 1 < questions.length) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setRemainingTime(settings.timePerQuestion);
                setTimeTaken((prev) => [...prev, Date.now()]);
            } else {
                setQuizEnded(true);
            }
        }, 3000);
    };

    const handleStopQuiz = () => {
        setQuizEnded(true);
    };

    const handleReset = () => {
        setQuizStarted(false);
        setQuizEnded(false);
        setCurrentQuestionIndex(0);
        setUserAnswers([]);
        setRemainingTime(settings.timePerQuestion);
        setShowCountdown(false);
        setCountdown(5);
    };

    const handleSettingChange = (e) => {
        const { name, value, checked, type } = e.target;
        if (type === 'checkbox') {
            const newExcludedTables = checked
                ? settings.excludedTables.filter((table) => table !== parseInt(value))
                : [...settings.excludedTables, parseInt(value)];
            setSettings((prevSettings) => ({
                ...prevSettings,
                excludedTables: newExcludedTables,
            }));
        } else {
            setSettings((prevSettings) => ({
                ...prevSettings,
                [name]: type === 'number' ? parseInt(value) : value,
            }));
        }
    };

    const handleSettingChangeMultiplier = (e) => {
        const { value, checked } = e.target;
        const newExcludedMultipliers = checked
            ? settings.excludedMultipliers.filter((multiplier) => multiplier !== parseInt(value))
            : [...settings.excludedMultipliers, parseInt(value)];
        setSettings((prevSettings) => ({
            ...prevSettings,
            excludedMultipliers: newExcludedMultipliers,
        }));
    };

    const handleSubmitAnswer = (e) => {
        e.preventDefault();
        const answer = e.target.elements.answer.value;
        handleAnswer(answer);
        e.target.elements.answer.value = '';
    };

    const calculateAverageTime = () => {
        const total = userAnswers.reduce((acc, curr) => acc + parseFloat(curr.timeTaken), 0);
        return (total / userAnswers.length).toFixed(2);
    };

    return (
        <div className="container">
            {!quizStarted && !showCountdown && (
                <div className="settings-section">
                    <h1>Quiz Settings</h1>
                    <div className="settings-group">
                        <label>
                            Number of Questions:
                            <input
                                type="number"
                                name="numQuestions"
                                value={settings.numQuestions}
                                onChange={handleSettingChange}
                            />
                        </label>
                        <label>
                            Time Per Question (seconds):
                            <input
                                type="number"
                                name="timePerQuestion"
                                value={settings.timePerQuestion}
                                onChange={handleSettingChange}
                            />
                        </label>
                    </div>
                    <div className="settings-group">
                        <h2>Select Tables</h2>
                        <div className="checkbox-container">
                            {settings.tables.map((table) => (
                                <label key={table}>
                                    <input
                                        type="checkbox"
                                        value={table}
                                        checked={!settings.excludedTables.includes(table)}
                                        onChange={handleSettingChange}
                                    />
                                    {table}
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="settings-group">
                        <h2>Select Multipliers</h2>
                        <div className="checkbox-container">
                            {settings.multipliers.map((multiplier) => (
                                <label key={multiplier}>
                                    <input
                                        type="checkbox"
                                        value={multiplier}
                                        checked={!settings.excludedMultipliers.includes(multiplier)}
                                        onChange={handleSettingChangeMultiplier}
                                    />
                                    {multiplier}
                                </label>
                            ))}
                        </div>
                    </div>
                    <button onClick={handleStartQuiz}>Start Quiz</button>
                </div>
            )}
            {showCountdown && (
                <div className="countdown">
                    <h1>Get Ready! Quiz Starts in {countdown}...</h1>
                </div>
            )}
            {quizStarted && !quizEnded && questions.length > 0 && (
                <div className="quiz-section">
                    <div className={`question ${animationClass}`}>
                        <h2>{questions[currentQuestionIndex]?.question}</h2>
                        <p>Time Remaining: {remainingTime}s</p>
                        <form onSubmit={handleSubmitAnswer}>
                            <input
                                type="number"
                                name="answer"
                                className="answer-input"
                                autoComplete="off"
                                required
                            />
                            <button type="submit" className="submit-button">Submit</button>
                        </form>
                        {feedback && <div className="feedback"><p>{feedback}</p></div>}
                    </div>
                    <button onClick={handleStopQuiz} className="stop-button">Stop Quiz</button>
                </div>
            )}
            {quizEnded && (
                <div className="summary">
                    <h2>Quiz Summary</h2>
                    <ul>
                        {userAnswers.map((answer, index) => (
                            <li key={index}>
                                Q: {answer.question}, Your Answer: {answer.answer}, Correct: {answer.correct ? 'Yes' : 'No'}, Time Taken: {answer.timeTaken}s
                            </li>
                        ))}
                    </ul>
                    <p>Average Time Taken: {calculateAverageTime()}s</p>
                    <div className="button-group">
                        <button onClick={handleReset}>Restart Quiz</button>
                        <button onClick={() => setQuizStarted(false)}>Go to Settings</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
