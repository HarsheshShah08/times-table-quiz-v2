import React from 'react';
import './Settings.css'; // Import the updated CSS file

const Settings = ({ settings, setSettings, startQuiz }) => {
    const handleNumberOfQuestionsChange = (e) => {
        setSettings(prevSettings => ({
            ...prevSettings,
            numberOfQuestions: parseInt(e.target.value, 10),
        }));
    };

    const handleTimePerQuestionChange = (e) => {
        setSettings(prevSettings => ({
            ...prevSettings,
            timePerQuestion: parseInt(e.target.value, 10),
        }));
    };

    const handleTableChange = (table) => {
        setSettings(prevSettings => {
            const includedTables = prevSettings.includedTables.includes(table)
                ? prevSettings.includedTables.filter(t => t !== table)
                : [...prevSettings.includedTables, table];
            return { ...prevSettings, includedTables };
        });
    };

    const handleMultiplierChange = (multiplier) => {
        setSettings(prevSettings => {
            const includedMultipliers = prevSettings.includedMultipliers.includes(multiplier)
                ? prevSettings.includedMultipliers.filter(m => m !== multiplier)
                : [...prevSettings.includedMultipliers, multiplier];
            return { ...prevSettings, includedMultipliers };
        });
    };

    return (
        <div className="settings">
            <h2>Settings</h2>
            <div className="setting-group">
                <label htmlFor="num-questions">Number of Questions:</label>
                <input
                    id="num-questions"
                    type="number"
                    value={settings.numberOfQuestions}
                    onChange={handleNumberOfQuestionsChange}
                />
            </div>
            <div className="setting-group">
                <label htmlFor="time-per-question">Time Per Question (seconds):</label>
                <input
                    id="time-per-question"
                    type="number"
                    value={settings.timePerQuestion}
                    onChange={handleTimePerQuestionChange}
                />
            </div>
            <div className="setting-group">
                <h3>Select Tables</h3>
                <div className="checkbox-group">
                    {Array.from({ length: 20 }, (_, i) => i + 1).map(table => (
                        <div key={table} className="checkbox-item">
                            <input
                                type="checkbox"
                                id={`table-${table}`}
                                checked={settings.includedTables.includes(table)}
                                onChange={() => handleTableChange(table)}
                            />
                            <label htmlFor={`table-${table}`}>{table}</label>
                        </div>
                    ))}
                </div>
            </div>
            <div className="setting-group">
                <h3>Select Multipliers</h3>
                <div className="checkbox-group">
                    {Array.from({ length: 20 }, (_, i) => i + 1).map(multiplier => (
                        <div key={multiplier} className="checkbox-item">
                            <input
                                type="checkbox"
                                id={`multiplier-${multiplier}`}
                                checked={settings.includedMultipliers.includes(multiplier)}
                                onChange={() => handleMultiplierChange(multiplier)}
                            />
                            <label htmlFor={`multiplier-${multiplier}`}>{multiplier}</label>
                        </div>
                    ))}
                </div>
            </div>
            <button onClick={startQuiz}>Start Quiz</button>
        </div>
    );
};

export default Settings;
