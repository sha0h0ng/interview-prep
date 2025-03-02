// src/pages/EditPage.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Alert, Spinner, Modal, Button, Form, Card } from 'react-bootstrap';
import QuestionForm from '../components/QuestionForm';

function EditPage({
  getQuestion,
  getAllQuestions,
  onUpdateQuestion,
  onDelete,
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState('');
  const [otherQuestions, setOtherQuestions] = useState([]);

  useEffect(() => {
    // Fetch the question by ID
    const questionData = getQuestion(id);
    const allQuestions = getAllQuestions();

    if (questionData) {
      setQuestion(questionData);
      // Filter out the current question and questions without content
      const filteredQuestions = allQuestions.filter(
        (q) =>
          q.id !== id &&
          q.content &&
          q.content.trim().length > 0 &&
          !q.linkedAnswerId // Only show questions with their own answers
      );
      setOtherQuestions(filteredQuestions);
      setLoading(false);
    } else {
      setError('Question not found');
      setLoading(false);
    }
  }, [id, getQuestion, getAllQuestions]);

  const handleSubmit = (updatedData) => {
    // If currently linked, remove the link when editing the content directly
    const updatedFields = { ...updatedData };
    if (question.linkedAnswerId && updatedData.content) {
      updatedFields.linkedAnswerId = null;
    }

    onUpdateQuestion(id, updatedFields);
    navigate('/');
  };

  const handleOpenDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleConfirmDelete = () => {
    onDelete(id);
    setShowDeleteModal(false);
    navigate('/');
  };

  const handleOpenLinkModal = () => {
    setShowLinkModal(true);
  };

  const handleCloseLinkModal = () => {
    setShowLinkModal(false);
  };

  const handleLinkAnswer = () => {
    if (selectedQuestionId) {
      // Link to the selected question's answer and clear this question's content
      onUpdateQuestion(id, {
        linkedAnswerId: selectedQuestionId,
        content: '', // Clear own content when linking
      });
      setShowLinkModal(false);
      navigate('/');
    }
  };

  const handleUnlinkAnswer = () => {
    onUpdateQuestion(id, {
      linkedAnswerId: null,
      content: '', // Reset content to empty
    });
  };

  // Function to get the linked question data if this question has a linkedAnswerId
  const getLinkedQuestion = () => {
    if (question && question.linkedAnswerId) {
      return getQuestion(question.linkedAnswerId);
    }
    return null;
  };

  const linkedQuestion = question?.linkedAnswerId ? getLinkedQuestion() : null;

  if (loading) {
    return (
      <div className='text-center my-5'>
        <Spinner animation='border' role='status'>
          <span className='visually-hidden'>Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <Alert variant='danger'>{error}</Alert>;
  }

  return (
    <div>
      <h1 className='mb-4'>Edit Question</h1>

      {/* Linked Answer Section */}
      {linkedQuestion && (
        <Card className='mb-4 border-primary'>
          <Card.Header className='bg-primary text-white d-flex justify-content-between align-items-center'>
            <span>This question uses a shared answer</span>
            <Button variant='light' size='sm' onClick={handleUnlinkAnswer}>
              Unlink Answer
            </Button>
          </Card.Header>
          <Card.Body>
            <p>
              <strong>Linked to question:</strong> {linkedQuestion.title}
            </p>
            <div className='bg-light p-3 rounded'>
              <p className='mb-0 font-italic'>Preview of shared answer:</p>
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    linkedQuestion.content.substring(0, 150) +
                    (linkedQuestion.content.length > 150 ? '...' : ''),
                }}
              />
            </div>
          </Card.Body>
        </Card>
      )}

      <div className='d-flex justify-content-end mb-3'>
        {!question.linkedAnswerId && otherQuestions.length > 0 && (
          <Button variant='outline-primary' onClick={handleOpenLinkModal}>
            Use Answer From Another Question
          </Button>
        )}
      </div>

      <QuestionForm
        initialData={{
          title: question.title,
          content: question.content,
        }}
        onSubmit={handleSubmit}
        onDelete={handleOpenDeleteModal}
        showDelete={true}
        readOnlyContent={!!question.linkedAnswerId} // Make content readonly if it's linked
        editorPlaceholder={
          question.linkedAnswerId
            ? 'This question is using a shared answer. Unlink to edit directly.'
            : 'Write your answer in markdown format. You can use **bold**, *italic*, lists, code blocks, and more.'
        }
      />

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this question?
          <p className='text-danger mt-2'>
            <strong>"{question.title}"</strong>
          </p>
          <p className='mb-0'>This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleCloseDeleteModal}>
            Cancel
          </Button>
          <Button variant='danger' onClick={handleConfirmDelete}>
            Delete Question
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Link Answer Modal */}
      <Modal show={showLinkModal} onHide={handleCloseLinkModal}>
        <Modal.Header closeButton>
          <Modal.Title>Link to Existing Answer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Select another question whose answer you want to use for this
            question. Both questions will share the same answer.
          </p>

          <Form.Group className='mb-3'>
            <Form.Label>Select a question with an answer</Form.Label>
            <Form.Select
              value={selectedQuestionId}
              onChange={(e) => setSelectedQuestionId(e.target.value)}
            >
              <option value=''>-- Select a question --</option>
              {otherQuestions.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.title}
                </option>
              ))}
            </Form.Select>

            {selectedQuestionId && (
              <div className='mt-3 p-2 bg-light rounded'>
                <p className='mb-1'>
                  <strong>Preview:</strong>
                </p>
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      otherQuestions
                        .find((q) => q.id === selectedQuestionId)
                        ?.content.substring(0, 100) + '...',
                  }}
                />
              </div>
            )}
          </Form.Group>

          <Alert variant='info'>
            Note: When you link to another question's answer, this question will
            use that answer. Any existing answer for this question will be
            removed.
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleCloseLinkModal}>
            Cancel
          </Button>
          <Button
            variant='primary'
            onClick={handleLinkAnswer}
            disabled={!selectedQuestionId}
          >
            Link Answer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default EditPage;
