import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import MarkdownEditor from '../components/MarkdownEditor';

function CreatePage({ onAddQuestion }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    onAddQuestion({ title, content });
    navigate('/');
  };

  return (
    <div>
      <h1 className='mb-4'>Create Question</h1>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group className='mb-3'>
          <Form.Label>Question Title</Form.Label>
          <Form.Control
            required
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Enter the interview question'
          />
          <Form.Control.Feedback type='invalid'>
            Please provide a question title.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='mb-4'>
          <Form.Label>Answer (Markdown)</Form.Label>
          <MarkdownEditor
            value={content}
            onChange={setContent}
            required={true}
          />
          <Form.Control.Feedback type='invalid'>
            Please provide an answer.
          </Form.Control.Feedback>
        </Form.Group>

        <Button variant='primary' type='submit'>
          Save Question
        </Button>
      </Form>
    </div>
  );
}

export default CreatePage;
