// src/components/QuestionList.jsx
import { Alert } from 'react-bootstrap';
import QuestionItem from './QuestionItem';

function QuestionList({ questions, getQuestion }) {
  if (questions.length === 0) {
    return (
      <Alert variant='info'>
        No questions found. Try adding some or adjusting your search.
      </Alert>
    );
  }

  return (
    <div className='question-list'>
      {questions.map((question) => (
        <QuestionItem
          key={question.id}
          question={question}
          getQuestion={getQuestion}
        />
      ))}
    </div>
  );
}

export default QuestionList;
