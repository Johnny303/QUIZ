import React, { useState, useEffect, useCallback } from 'react';
import SubmittedQuestion from './SubmittedQuestion';

function Questions() {
  const [submittedQuestions, setSubmittedQuestions] = useState([]);
  const [data, setData] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submittedData, setSubmittedData] = useState([]);
  const [randomizedQuestions, setRandomizedQuestions] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const questionsPerPage = 20;


  const getRandomQuestions = () => {
    if (data.length < questionsPerPage) {
      setRandomizedQuestions(data);
      setShowAll(true); // If fewer than 20, just show everything
      return;
    }
  
    const shuffled = [...data].sort(() => 0.5 - Math.random());
    setRandomizedQuestions(shuffled.slice(0, questionsPerPage));
    setShowAll(false); // Indicate we're in "randomized" mode
  };

  const showAllQuestions = () => {
    setRandomizedQuestions(data); // Show all questions
    setShowAll(true); // Track that we're showing all
  };

  const getAnswerClass = (questionIndex, answerIndex) => {
    if (!submittedQuestions.includes(questionIndex)) {
      return ''; // No styling before submission
    }
  
    const question = data[questionIndex];
    const isCorrect = question.answers[answerIndex].isCorrect;
    const isSelected = selectedAnswers[questionIndex]?.[answerIndex];
  
    if (isSelected) {
      return isCorrect ? 'correct-answer' : 'incorrect-answer'; // Green for correct, red for incorrect
    } 
  
    if (!isSelected && isCorrect) {
      return 'missed-correct-answer'; // Blue for correct but unselected answers
    }
  
    return ''; // No special styling for other unselected answers
  };

  const handleCheckboxChange = useCallback((questionIndex, answerIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: {
        ...prev[questionIndex],
        [answerIndex]: !prev[questionIndex]?.[answerIndex],
      },
    }));
  }, []);

  const handleEndQuiz = () => {
    console.log("Quiz Ended");
    // Add any additional logic for ending the quiz
  };

  const handleSubmit = (questionIndex) => {
    const selected = selectedAnswers[questionIndex] || {};
    const questionData = data[questionIndex];

    setSubmittedData((prev) => [
      ...prev,
      { question: questionData, selectedAnswers: selected },
    ]);

    setSubmittedQuestions((prev) => [...prev, questionIndex]);
  };

  const getData = () => {
    fetch('/questions.json', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then((response) => response.json())
    .then((myJson) => setData(myJson.questions))
    .catch((error) => console.error('Error fetching data:', error));
  };

  useEffect(() => {
    getData();
  }, []);

  const isSubmitDisabled = (index) => {
    return !Object.values(selectedAnswers[index] || {}).includes(true);
  };

  return (
    <div>
      <div className="button-container">
  <button onClick={getRandomQuestions} className="custom-button">
    Get 20 Random Questions
  </button>
  <button onClick={showAllQuestions} className="custom-button">
    Show All Questions
  </button>
</div>
<div className="cards-container">
  {randomizedQuestions.length > 0 &&
    randomizedQuestions.map((question, index) => (
      <div className="card" key={index}>
        <h2>{question.question}</h2>
        <div className="answers-container">
          {question.answers.map((answer, i) => (
            <div key={i} className={`answer ${getAnswerClass(index, i)}`}>
              <input
                type="checkbox"
                id={`answer-${index}-${i}`}
                aria-label={`Answer option ${i + 1}`}
                disabled={submittedQuestions.includes(index)}
                checked={selectedAnswers[index]?.[i] || false}
                onChange={() => handleCheckboxChange(index, i)}
              />
              <label htmlFor={`answer-${index}-${i}`}>{answer.text}</label>
            </div>
          ))}
        </div>
        <div className="submit-button-container">
          <button
            className="submit-button"
            onClick={() => handleSubmit(index)}
            disabled={submittedQuestions.includes(index) || isSubmitDisabled(index)}
          >
            {submittedQuestions.includes(index) ? "Answer Submitted" : "Submit"}
          </button>
        </div>
      </div>
    ))}
</div>


      
    </div>
  );
}

export default Questions;
