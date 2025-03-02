// src/components/CsvUploader.jsx
import { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import Papa from 'papaparse';

function CsvUploader({ onUpload }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    // Check file type
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }

    setLoading(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      const csvData = e.target.result;

      Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setLoading(false);

          if (results.data && results.data.length > 0) {
            // Check if the CSV has the required title column
            const firstRow = results.data[0];
            if (
              !firstRow.title &&
              !firstRow.Title &&
              !firstRow.question &&
              !firstRow.Question
            ) {
              setError(
                'CSV must contain a column named "title", "Title", "question", or "Question"'
              );
              return;
            }

            // Process the imported questions with linked answer support
            processImportedQuestions(results.data);
          } else {
            setError('No data found in the CSV file');
          }
        },
        error: (error) => {
          setLoading(false);
          setError(`Error parsing CSV: ${error.message}`);
        },
      });
    };

    reader.onerror = () => {
      setLoading(false);
      setError('Error reading file');
    };

    reader.readAsText(file);
  };

  // Process imported questions, handling linked answers
  const processImportedQuestions = (data) => {
    // First pass: Create all questions
    const processedQuestions = data.map((row) => {
      const title = row.title || row.Title || row.question || row.Question;
      const content =
        row.content || row.Content || row.answer || row.Answer || '';

      // Store the linked question title if present
      const linkedQuestionTitle =
        row.linkedQuestionTitle || row.LinkedQuestionTitle || '';

      // Process tags - convert from semicolon-separated string to array
      let tags = [];
      const tagsString = row.tags || row.Tags || '';
      if (tagsString) {
        tags = tagsString
          .split(';')
          .map((tag) => tag.trim())
          .filter((tag) => tag);
      }

      return {
        title,
        content,
        tags,
        id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
        createdAt: new Date().toISOString(),
        // We'll resolve linkedAnswerId in the second pass
        _linkedQuestionTitle: linkedQuestionTitle, // Temporary field
      };
    });

    // Second pass: Resolve linked answers
    const questionsWithLinks = processedQuestions.map((question) => {
      // If this question doesn't have a linked question title, keep it as is
      if (!question._linkedQuestionTitle) {
        const { _linkedQuestionTitle, ...cleanQuestion } = question;
        return cleanQuestion;
      }

      // Find the question that matches the linked title
      const linkedQuestion = processedQuestions.find(
        (q) => q.title === question._linkedQuestionTitle
      );

      // If we found a matching question, link to it, otherwise keep original
      if (linkedQuestion) {
        const { _linkedQuestionTitle, content, ...rest } = question;
        return {
          ...rest,
          linkedAnswerId: linkedQuestion.id,
          content: '', // Clear content since it's using a linked answer
        };
      } else {
        // If we can't find the linked question, keep the content
        const { _linkedQuestionTitle, ...cleanQuestion } = question;
        return cleanQuestion;
      }
    });

    // Reset file input and pass the processed questions to the parent
    document.getElementById('csv-file-input').value = '';
    setFile(null);
    onUpload(questionsWithLinks);
  };

  return (
    <div>
      {error && (
        <Alert
          variant='danger'
          onClose={() => setError(null)}
          dismissible
          className='mb-3'
        >
          {error}
        </Alert>
      )}

      <div className='d-flex align-items-center'>
        <Form.Group className='me-2 flex-grow-1'>
          <Form.Control
            id='csv-file-input'
            type='file'
            accept='.csv'
            onChange={handleFileChange}
            disabled={loading}
          />
        </Form.Group>
        <Button onClick={handleUpload} disabled={loading || !file}>
          {loading ? (
            <>
              <Spinner
                as='span'
                animation='border'
                size='sm'
                role='status'
                aria-hidden='true'
                className='me-2'
              />
              Uploading...
            </>
          ) : (
            'Upload'
          )}
        </Button>
      </div>
    </div>
  );
}

export default CsvUploader;
