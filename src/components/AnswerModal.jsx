import { Modal, Button, Alert, Badge } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';

function AnswerModal({ show, onHide, question, getQuestion }) {
  // No need to continue if no question is selected
  if (!question) return null;

  // Check if this question has a linked answer
  const isLinked = !!question.linkedAnswerId;

  // Get content to display
  const getContent = () => {
    if (isLinked) {
      const linkedQuestion = getQuestion(question.linkedAnswerId);
      return linkedQuestion ? linkedQuestion.content : '';
    }
    return question.content;
  };

  const content = getContent();
  const hasAnswer = content && content.trim().length > 0;

  // Get linked question title if needed
  const getLinkedQuestionTitle = () => {
    if (isLinked) {
      const linkedQuestion = getQuestion(question.linkedAnswerId);
      return linkedQuestion ? linkedQuestion.title : 'Unknown question';
    }
    return null;
  };

  const linkedQuestionTitle = isLinked ? getLinkedQuestionTitle() : null;

  return (
    <Modal
      show={show}
      onHide={onHide}
      size='lg'
      centered
      scrollable
      keyboard={true}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {question.title}
          <div className='mt-1'>
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
            {question.tags &&
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
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='answer-modal-body'>
        {hasAnswer ? (
          <>
            {isLinked && (
              <Alert variant='info' className='mb-3'>
                <small>
                  This answer is shared with question:{' '}
                  <strong>{linkedQuestionTitle}</strong>
                </small>
              </Alert>
            )}
            <div className='markdown-content'>
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </>
        ) : (
          <Alert variant='warning'>
            No answer has been provided for this question yet. Click the Edit
            button to add an answer.
          </Alert>
        )}
      </Modal.Body>
      <Modal.Footer className='d-flex justify-content-between'>
        <div>
          <small className='text-muted'>
            Created: {new Date(question.createdAt).toLocaleDateString()}
            {question.updatedAt && (
              <>
                {' '}
                | Updated: {new Date(question.updatedAt).toLocaleDateString()}
              </>
            )}
          </small>
        </div>
        <div>
          <Button variant='outline-secondary' onClick={onHide} className='me-2'>
            Close{' '}
            <small className='ms-1'>
              <kbd>Esc</kbd>
            </small>
          </Button>
          <Button
            variant='primary'
            onClick={() => (window.location.href = `/edit/${question.id}`)}
          >
            Edit{' '}
            <small className='ms-1'>
              <kbd>e</kbd>
            </small>
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default AnswerModal;
