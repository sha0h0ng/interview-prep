// src/pages/HomePage.jsx
import { useState, useEffect } from 'react';
import { Form, InputGroup, Badge, Button } from 'react-bootstrap';
import QuestionList from '../components/QuestionList';

function HomePage({ questions, getQuestion }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);

  // Extract all unique tags from questions
  useEffect(() => {
    const tags = new Set();
    questions.forEach((question) => {
      if (question.tags && Array.isArray(question.tags)) {
        question.tags.forEach((tag) => tags.add(tag));
      }
    });
    setAvailableTags(Array.from(tags).sort());
  }, [questions]);

  // Filter questions based on search term and selected tags
  const filteredQuestions = questions.filter((question) => {
    // Filter by search term
    const matchesSearch = question.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Filter by selected tags (if any)
    const matchesTags =
      selectedTags.length === 0 ||
      (question.tags &&
        selectedTags.every((tag) => question.tags.includes(tag)));

    return matchesSearch && matchesTags;
  });

  // Toggle tag selection
  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Clear all selected tags
  const clearTagFilter = () => {
    setSelectedTags([]);
  };

  return (
    <div>
      <h1 className='mb-4'>Interview Questions</h1>

      <InputGroup className='mb-3'>
        <Form.Control
          placeholder='Search questions...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>

      {availableTags.length > 0 && (
        <div className='mb-4'>
          <div className='d-flex justify-content-between align-items-center mb-2'>
            <small className='text-muted'>Filter by tags:</small>
            {selectedTags.length > 0 && (
              <Button
                variant='link'
                size='sm'
                onClick={clearTagFilter}
                className='p-0'
              >
                Clear filters
              </Button>
            )}
          </div>
          <div>
            {availableTags.map((tag) => (
              <Badge
                key={tag}
                bg={selectedTags.includes(tag) ? 'primary' : 'secondary'}
                className='me-1 mb-1'
                style={{
                  cursor: 'pointer',
                  opacity: selectedTags.includes(tag) ? 1 : 0.6,
                }}
                onClick={() => toggleTag(tag)}
              >
                {tag} {selectedTags.includes(tag) && '✓'}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <QuestionList questions={filteredQuestions} getQuestion={getQuestion} />
    </div>
  );
}

export default HomePage;
