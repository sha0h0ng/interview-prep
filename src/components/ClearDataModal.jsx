// src/components/ClearDataModal.jsx
import { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

function ClearDataModal({ show, handleClose, handleClearData }) {
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (confirmation.toLowerCase() === 'yes') {
      handleClearData();
      handleClose();
      setConfirmation('');
      setError('');
    } else {
      setError('Please type "yes" to confirm');
    }
  };

  const handleCancel = () => {
    setConfirmation('');
    setError('');
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleCancel} backdrop='static' keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title className='text-danger'>Clear All Data</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Alert variant='danger'>
          <Alert.Heading>Warning: This action cannot be undone!</Alert.Heading>
          <p>
            You are about to delete all your interview questions and answers.
            This will clear all data from local storage and reset the
            application.
          </p>
        </Alert>

        <p className='mb-3'>
          To confirm, please type <strong>yes</strong> in the field below:
        </p>

        <Form.Group className='mb-3'>
          <Form.Control
            type='text'
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            placeholder="Type 'yes' to confirm"
            isInvalid={!!error}
          />
          <Form.Control.Feedback type='invalid'>{error}</Form.Control.Feedback>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant='danger' onClick={handleConfirm}>
          Clear All Data
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ClearDataModal;
