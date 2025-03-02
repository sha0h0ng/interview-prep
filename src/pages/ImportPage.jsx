// src/pages/ImportPage.jsx
import { useState } from 'react';
import { Card, Alert } from 'react-bootstrap';
import CsvUploader from '../components/CsvUploader';

function ImportPage({ onCsvUpload }) {
  const [importSuccess, setImportSuccess] = useState(false);
  const [importCount, setImportCount] = useState(0);

  const handleUpload = (questions) => {
    onCsvUpload(questions);
    setImportCount(questions.length);
    setImportSuccess(true);

    // Reset success message after a few seconds
    setTimeout(() => {
      setImportSuccess(false);
    }, 5000);
  };

  return (
    <div>
      <h1 className='mb-4'>Import Questions</h1>

      {importSuccess && (
        <Alert variant='success' className='mb-4'>
          Successfully imported {importCount} question
          {importCount !== 1 ? 's' : ''}!
        </Alert>
      )}

      <Card>
        <Card.Body>
          <Card.Title>Import from CSV</Card.Title>
          <Card.Text>
            Upload a CSV file with your interview questions. The file must have
            at least a "title" column. The "content" column is optional for
            answers.
          </Card.Text>
          <CsvUploader onUpload={handleUpload} />
        </Card.Body>
      </Card>

      <Card className='mt-4'>
        <Card.Body>
          <Card.Title>CSV Format Instructions</Card.Title>
          <Card.Text>Your CSV file should follow this format:</Card.Text>
          <pre className='bg-light p-3 border rounded'>
            title,content,linkedQuestionTitle,tags
            <br />
            "What is React?","React is a
            library...",,"react;frontend;javascript"
            <br />
            "Explain props in React","Props are read-only
            components...",,"react;props;components"
            <br />
            "What is JSX?","","Explain props in React","react;jsx"
          </pre>
          <ul>
            <li>
              The <code>title</code> column is required (can also be named{' '}
              <code>Title</code>, <code>question</code>, or{' '}
              <code>Question</code>)
            </li>
            <li>
              The <code>content</code> column is optional (can also be named{' '}
              <code>Content</code>, <code>answer</code>, or <code>Answer</code>)
            </li>
            <li>
              The <code>linkedQuestionTitle</code> column is optional - used to
              indicate which question's answer this question should share
            </li>
            <li>
              The <code>tags</code> column is optional - use semicolons (;) to
              separate multiple tags
            </li>
            <li>
              Empty content fields will be marked as "No Answer" in the UI
            </li>
            <li>
              If a question has a <code>linkedQuestionTitle</code>, its content
              will be ignored in favor of the linked question's content
            </li>
            <li>Quotes around text are recommended but not required</li>
          </ul>
        </Card.Body>
      </Card>

      <Card className='mt-4'>
        <Card.Body>
          <Card.Title>Shared Answers</Card.Title>
          <Card.Text>
            This app supports sharing answers between questions. When exporting,
            this structure is preserved using the{' '}
            <code>linkedQuestionTitle</code> column. When importing, questions
            will be automatically linked if the title in{' '}
            <code>linkedQuestionTitle</code> matches another question's title.
          </Card.Text>
          <Alert variant='info'>
            <strong>Example:</strong> If you have "What is setState?" linked to
            use the answer from "Explain React state management", the export
            will include a row with "What is setState?" as the title and
            "Explain React state management" in the linkedQuestionTitle column.
          </Alert>
        </Card.Body>
      </Card>

      <Card className='mt-4'>
        <Card.Body>
          <Card.Title>Using Tags</Card.Title>
          <Card.Text>
            Tags help you organize and filter your questions. In the CSV, use
            the <code>tags</code> column with semicolons (;) to separate
            multiple tags.
          </Card.Text>
          <Alert variant='info'>
            <strong>Example:</strong> For a JavaScript question about
            async/await, you might use tags like:{' '}
            <code>javascript;async;promises</code>
          </Alert>
          <p>
            On the Questions page, you can click on tags to filter the question
            list by specific tags.
          </p>
        </Card.Body>
      </Card>
    </div>
  );
}

export default ImportPage;
