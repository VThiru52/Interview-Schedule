// QuizPage.js
import React, { useState, useEffect } from 'react';


import './QuizPage.css';
const QuizPage = ({ onSubmit }) => {
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [additionalOptions, setAdditionalOptions] = useState({
    id: '',
    name: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch questions from the backend when the component mounts
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);

      // Fetch questions from the backend API
      const response = await fetch('https://slopre-rate-exam-a315a351a951.herokuapp.com/quiz/all');
      const data = await response.json();

      console.log(data);

      if (!response.ok) {
        throw new Error(`Failed to fetch questions. Status: ${response.status}`);
      }

      // Take two attributes (name and client) from each question
      const formattedQuestions = data.slice(0, 10).map((question) => ({
        id: question.id, // Use 'name' as an id, change it if a different id is required
        quizQuestion: `${question.question}`, // Combine 'name' and 'client'
      }));

      // Jumble and set the first 2 questions
      const shuffledQuestions = formattedQuestions.sort(() => Math.random() - 0.5);
      console.log("shuffledQuestions", shuffledQuestions);
      setQuestions(shuffledQuestions);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const handleAdditionalOptionChange = (optionName, value) => {
    setAdditionalOptions((prevOptions) => ({
      ...prevOptions,
      [optionName]: value,
    }));
  };

  const handleSubmitNew = () => {
    // Combine selected answers and additional options
    const combinedAnswers = { ...selectedAnswers, ...additionalOptions };

    // Submit combined answers to the backend
    onSubmit(combinedAnswers);
  };

  const handleSubmit = () => {
    // Create an array to store question answers
    const answersArray = [];
  
    // Iterate through questions to gather answers along with question information
    questions.forEach((question) => {
      const answerData = {
        question: question.quizQuestion,
        answer: selectedAnswers[question.id] || '', // User's answer
      };
      answersArray.push(answerData);
    });
  
    // Additional user information
    const userData = {
      candidateId: additionalOptions.id || '',
      candidateName: additionalOptions.name || '',
    };
  
    // Combine user data and answers for submission
    const submissionData = {
      user: userData,
      questions: answersArray,
    };
  
    // Call the function to submit the data to the backend
    onSubmit(submissionData);
  };

  return (
    <div className='quiz-container'>
      <h2 className='quize-heading'>Quiz Page</h2>
      <div className='details-container'>
        <div className='input-label'>
          <label>
            Enter Your ID:
            <input
              type="text"
              onChange={(e) => handleAdditionalOptionChange('id', e.target.value)}
              value={additionalOptions.id || ''}
              className="answer_label"
            />
          </label>
        </div>
        <div>
          <label>
            Enter Your Name:
            <input
              type="text"
              onChange={(e) => handleAdditionalOptionChange('name', e.target.value)}
              value={additionalOptions.name || ''}
              className="answer_label"
            />
          </label>
        </div>
      </div>
      {loading ? (
        <p>Loading questions...</p>
      ) : (
        <>
          {questions.map((question) => (
            <div key={question.id}>
              <p>{question.quizQuestion}</p>
              <div>
                {/* Text input for entering answers */}
                <label>
                  <textarea
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    value={selectedAnswers[question.id] || ''}
                    className="answer_textarea"
                  />
                </label>
              </div>
            </div>
          ))}
          {/* Additional options */}
          <button onClick={handleSubmit} className='submit-button'>Submit Answers</button>
          </>
      )}
    </div>
  );

};

export default QuizPage;

