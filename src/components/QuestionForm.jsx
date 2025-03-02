// src/components/QuestionForm.jsx
import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import MarkdownEditor from './MarkdownEditor';
import TagInput from './TagInput';

function QuestionForm({
  onSubmit,
  initialData = { title: '', content: '', tags: [] },
  onDelete,
  showDelete = false,
  readOnlyContent = false,
  editorPlaceholder,
}) {
  const [title, setTitle] = useState(initialData.title);
  const [content, setContent] = useState(initialData.content);
  const [tags, setTags] = useState(initialData.tags || []);
  const [validated, setValidated] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    // If content is read-only, we don't want to pass content in the update
    // as it might overwrite the linked content
    if (readOnlyContent) {
      onSubmit({ title, tags });
    } else {
      onSubmit({ title, content, tags });
    }
  };

  return (
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

      <Form.Group className='mb-3'>
        <Form.Label>Tags</Form.Label>
        <TagInput tags={tags} onChange={setTags} />
        <Form.Text className='text-muted'>
          Add tags to categorize your question (e.g., react, javascript,
          algorithms)
        </Form.Text>
      </Form.Group>

      <Form.Group className='mb-4'>
        <Form.Label>Answer (Markdown)</Form.Label>
        <MarkdownEditor
          value={content}
          onChange={setContent}
          required={!readOnlyContent}
          readOnly={readOnlyContent}
          placeholder={editorPlaceholder}
        />
        {!readOnlyContent && (
          <Form.Control.Feedback type='invalid'>
            Please provide an answer.
          </Form.Control.Feedback>
        )}
      </Form.Group>

      <div className='d-flex'>
        {showDelete && (
          <Button
            variant='danger'
            type='button'
            className='me-2'
            onClick={onDelete}
          >
            Delete
          </Button>
        )}
        <Button variant='primary' type='submit'>
          Save Question
        </Button>
      </div>
    </Form>
  );
}

export default QuestionForm;
