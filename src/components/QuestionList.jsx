import { useState, useRef, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import QuestionItem from './QuestionItem';
import KeyboardNavigation from './KeyboardNavigation';
import AnswerModal from './AnswerModal';
import { useNavigate } from 'react-router-dom';

function QuestionList({ questions, getQuestion, searchInputRef }) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [expandedStates, setExpandedStates] = useState({});
  const [showModal, setShowModal] = useState(false);
  const questionRefs = useRef({});
  const navigate = useNavigate();

  // Reset active index when questions change
  useEffect(() => {
    setActiveIndex(questions.length > 0 ? 0 : -1);

    // Initialize expanded states for questions
    const initialExpandedStates = {};
    questions.forEach((q, index) => {
      initialExpandedStates[index] = expandedStates[index] || false;
    });
    setExpandedStates(initialExpandedStates);

    // Reset refs
    questionRefs.current = {};
  }, [questions]);

  // Handle toggling answer visibility
  const handleToggleAnswer = (index) => {
    if (index >= 0 && index < questions.length) {
      setExpandedStates((prev) => ({
        ...prev,
        [index]: !prev[index],
      }));
    }
  };

  // Handle edit question
  const handleEditQuestion = (index) => {
    if (index >= 0 && index < questions.length) {
      navigate(`/edit/${questions[index].id}`);
    }
  };

  // Handle focusing search bar
  const handleFocusSearch = () => {
    if (searchInputRef && searchInputRef.current) {
      searchInputRef.current.focus();
      return;
    }

    // Fallback: Get the search input from the document
    const searchInput = document.querySelector(
      'input[placeholder="Search questions..."]'
    );
    if (searchInput) {
      searchInput.focus();
    }
  };

  // Handle clearing filters
  const handleClearFilters = () => {
    // Simulate click on clear filters button if it exists
    const clearButton = document.querySelector('button.p-0');
    if (clearButton) {
      clearButton.click();
    }
  };

  // Handle changing sort
  const handleChangeSort = () => {
    // Find and click the sort dropdown
    const sortDropdown = document.querySelector('#dropdown-sort');
    if (sortDropdown) {
      sortDropdown.click();
    }
  };

  // Handle showing modal
  const handleShowModal = (index) => {
    if (index >= 0 && index < questions.length) {
      setActiveIndex(index);
      setShowModal(true);
    }
  };

  // Handle hiding modal
  const handleHideModal = () => {
    setShowModal(false);
    // Refocus the active question after closing modal
    setTimeout(() => {
      questionRefs.current[activeIndex]?.focus();
    }, 10);
  };

  if (questions.length === 0) {
    return (
      <Alert variant='info'>
        No questions found. Try adding some or adjusting your search.
      </Alert>
    );
  }

  // Get the active question for the modal
  const activeQuestion =
    activeIndex >= 0 && activeIndex < questions.length
      ? questions[activeIndex]
      : null;

  return (
    <div className='question-list'>
      {questions.map((question, index) => (
        <div
          key={question.id}
          ref={(el) => (questionRefs.current[index] = el)}
          className={activeIndex === index ? 'keyboard-active' : ''}
          tabIndex={0}
          onFocus={() => setActiveIndex(index)}
        >
          <QuestionItem
            question={question}
            getQuestion={getQuestion}
            isExpanded={expandedStates[index] || false}
            onToggleExpand={() => handleToggleAnswer(index)}
            isActive={activeIndex === index}
          />
        </div>
      ))}

      <KeyboardNavigation
        questionRefs={questionRefs}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        onToggleAnswer={handleToggleAnswer}
        onEditQuestion={handleEditQuestion}
        onFocusSearch={handleFocusSearch}
        onClearFilters={handleClearFilters}
        onChangeSort={handleChangeSort}
        onShowModal={handleShowModal}
        onHideModal={handleHideModal}
        showModal={showModal}
        totalQuestions={questions.length}
        searchInputRef={searchInputRef}
      />

      {/* Answer Modal */}
      <AnswerModal
        show={showModal}
        onHide={handleHideModal}
        question={activeQuestion}
        getQuestion={getQuestion}
      />

      <style jsx>{`
        .keyboard-active {
          outline: 2px solid #4267b2;
          border-radius: 0.375rem;
        }
      `}</style>
    </div>
  );
}

export default QuestionList;
