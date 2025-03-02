// src/components/QuestionItem.jsx
import { useState } from 'react';
import { Card, Button, Alert, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

function QuestionItem({ question, getQuestion }) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/edit/${question.id}`);
  };

  // Check if this question has its own answer content or is linked to another question
  const isLinked = !!question.linkedAnswerId;

  // Get the linked question's content if needed
  const getContent = () => {
    if (isLinked) {
      const linkedQuestion = getQuestion(question.linkedAnswerId);
      return linkedQuestion ? linkedQuestion.content : '';
    }
    return question.content;
  };

  const content = getContent();
  const hasAnswer = content && content.trim().length > 0;

  // Get the linked question's title if needed
  const getLinkedQuestionTitle = () => {
    if (isLinked) {
      const linkedQuestion = getQuestion(question.linkedAnswerId);
      return linkedQuestion ? linkedQuestion.title : 'Unknown question';
    }
    return null;
  };

  const linkedQuestionTitle = isLinked ? getLinkedQuestionTitle() : null;
  const hasTags = question.tags && question.tags.length > 0;

  return (
    <Card className='mb-3'>
      <Card.Header>
        <div className='d-flex justify-content-between align-items-center'>
          <div>
            <h5 className='mb-0'>{question.title}</h5>
            <div className='mt-1 d-flex flex-wrap align-items-center'>
              {!hasAnswer && (
                <Badge bg='warning' className='me-2'>
                  No Answer
                </Badge>
              )}
              {isLinked && hasAnswer && (
                <Badge bg='info' className='me-2'>
                  Shared Answer
                </Badge>
              )}
              {hasTags &&
                question.tags.map((tag) => (
                  <Badge
                    key={tag}
                    bg='secondary'
                    className='me-1'
                    style={{ fontSize: '0.7rem' }}
                  >
                    {tag}
                  </Badge>
                ))}
            </div>
          </div>
          <Button variant='outline-secondary' size='sm' onClick={handleEdit}>
            Edit
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        <div className='d-flex justify-content-between align-items-center'>
          <small className='text-muted'>
            Created: {new Date(question.createdAt).toLocaleDateString()}
            {question.updatedAt && (
              <>
                {' '}
                | Updated: {new Date(question.updatedAt).toLocaleDateString()}
              </>
            )}
          </small>
          <Button
            variant='outline-primary'
            size='sm'
            onClick={() => setExpanded(!expanded)}
            disabled={!hasAnswer}
          >
            {expanded ? 'Hide Answer' : 'Show Answer'}
          </Button>
        </div>

        {expanded && hasAnswer && (
          <div className='mt-3'>
            {isLinked && (
              <Alert variant='info' className='mb-2'>
                <small>
                  This answer is shared with question:{' '}
                  <strong>{linkedQuestionTitle}</strong>
                </small>
              </Alert>
            )}
            <div className='p-3 bg-light rounded'>
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </div>
        )}

        {expanded && !hasAnswer && (
          <Alert variant='warning' className='mt-3'>
            No answer has been provided for this question yet. Click the Edit
            button to add an answer.
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
}

export default QuestionItem;
