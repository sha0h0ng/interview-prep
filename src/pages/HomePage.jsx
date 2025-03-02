import { useState, useEffect, useRef } from 'react';
import {
  Form,
  InputGroup,
  Badge,
  Button,
  Dropdown,
  Stack,
} from 'react-bootstrap';
import QuestionList from '../components/QuestionList';

function HomePage({ questions, getQuestion }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [sortOption, setSortOption] = useState('answersFirst');
  const searchInputRef = useRef(null);
  const sortDropdownRef = useRef(null);

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

  // Helper function to check if a question has an answer
  const hasAnswer = (question) => {
    if (question.linkedAnswerId) {
      const linkedQuestion = getQuestion(question.linkedAnswerId);
      return (
        linkedQuestion &&
        linkedQuestion.content &&
        linkedQuestion.content.trim().length > 0
      );
    }
    return question.content && question.content.trim().length > 0;
  };

  // Sort questions based on the selected option
  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    switch (sortOption) {
      case 'answersFirst':
        // Questions with answers come first
        const aHasAnswer = hasAnswer(a);
        const bHasAnswer = hasAnswer(b);
        if (aHasAnswer && !bHasAnswer) return -1;
        if (!aHasAnswer && bHasAnswer) return 1;
        // If both have or don't have answers, sort by created date (newest first)
        return new Date(b.createdAt) - new Date(a.createdAt);

      case 'newest':
        // Sort by created date, newest first
        return new Date(b.createdAt) - new Date(a.createdAt);

      case 'oldest':
        // Sort by created date, oldest first
        return new Date(a.createdAt) - new Date(b.createdAt);

      case 'lastUpdated':
        // Sort by updated date if available, otherwise created date (newest first)
        const aDate = a.updatedAt
          ? new Date(a.updatedAt)
          : new Date(a.createdAt);
        const bDate = b.updatedAt
          ? new Date(b.updatedAt)
          : new Date(b.createdAt);
        return bDate - aDate;

      default:
        return 0;
    }
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

      <Stack direction='horizontal' gap={3} className='mb-4'>
        <InputGroup className='search-container'>
          <Form.Control
            placeholder='Search questions...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            ref={searchInputRef}
            aria-label='Search questions'
            autoComplete='off'
            className='search-input'
          />
          <InputGroup.Text className='search-shortcut'>
            <div className='d-flex align-items-center'>
              <kbd>/</kbd>
              <span className='mx-1'>or</span>
              <kbd>Ctrl</kbd>+<kbd>F</kbd>
            </div>
          </InputGroup.Text>
        </InputGroup>

        <Dropdown align='end' ref={sortDropdownRef}>
          <Dropdown.Toggle
            variant='outline-secondary'
            id='dropdown-sort'
            data-keyboard-shortcut='s'
          >
            {sortOption === 'answersFirst' && 'Answers First'}
            {sortOption === 'newest' && 'Newest First'}
            {sortOption === 'oldest' && 'Oldest First'}
            {sortOption === 'lastUpdated' && 'Last Updated'}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              active={sortOption === 'answersFirst'}
              onClick={() => setSortOption('answersFirst')}
            >
              Answers First
            </Dropdown.Item>
            <Dropdown.Item
              active={sortOption === 'newest'}
              onClick={() => setSortOption('newest')}
            >
              Newest First
            </Dropdown.Item>
            <Dropdown.Item
              active={sortOption === 'oldest'}
              onClick={() => setSortOption('oldest')}
            >
              Oldest First
            </Dropdown.Item>
            <Dropdown.Item
              active={sortOption === 'lastUpdated'}
              onClick={() => setSortOption('lastUpdated')}
            >
              Last Updated
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Stack>

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
                aria-label='Clear tag filters'
                data-keyboard-shortcut='Esc'
              >
                Clear filters{' '}
                <small>
                  <kbd>Esc</kbd>
                </small>
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

      <QuestionList
        questions={sortedQuestions}
        getQuestion={getQuestion}
        searchInputRef={searchInputRef}
      />

      <div
        className='search-tip mt-4 p-3 bg-light rounded'
        style={{ display: filteredQuestions.length > 0 ? 'block' : 'none' }}
      >
        <div className='d-flex align-items-center'>
          <Badge bg='info' className='me-2'>
            Tip
          </Badge>
          <small>
            When in search: Press <kbd>Enter</kbd> or <kbd>↓</kbd> to jump
            directly to the first question. Use <kbd>↑</kbd> from the first
            question to return to search.
          </small>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
