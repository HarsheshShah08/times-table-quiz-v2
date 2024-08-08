import React, { useState, useEffect } from 'react';

function Question({ question, handleAnswer, remainingTime }) {
    const [userAnswer, setUserAnswer] = useState('');
    
    const handleSubmit = (e) => {
        e.preventDefault();
        handleAnswer(userAnswer);
    };

    useEffect(() => {
        setUserAnswer(''); // Reset the answer on new question
    }, [question]);

    return (
        <div className="question-container">
            <h2 className="question">{question.question}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    autoFocus
                />
                <button type="submit">Submit</button>
            </form>
            <div className="feedback">Remaining Time: {remainingTime}s</div>
        </div>
    );
}

export default Question;
