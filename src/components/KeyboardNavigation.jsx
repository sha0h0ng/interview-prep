import { useEffect, useCallback, useState } from 'react';
import { Modal, Table, Badge } from 'react-bootstrap';

function KeyboardNavigation({
  questionRefs,
  activeIndex,
  setActiveIndex,
  onToggleAnswer,
  onEditQuestion,
  onClearFilters,
  onFocusSearch,
  onChangeSort,
  onShowModal,
  onHideModal,
  showModal,
  totalQuestions,
  searchInputRef,
}) {
  const [showHelp, setShowHelp] = useState(false);

  const handleKeyDown = useCallback(
    (e) => {
      // If modal is open, only handle Escape and e (Edit)
      if (showModal) {
        if (e.key === 'Escape') {
          e.preventDefault();
          onHideModal();
          return;
        }

        if (e.key === 'e') {
          e.preventDefault();
          onHideModal();
          if (activeIndex >= 0 && activeIndex < totalQuestions) {
            onEditQuestion(activeIndex);
          }
          return;
        }

        // Let other keypresses be handled by the modal
        return;
      }

      // Ctrl+F for search (common browser shortcut)
      if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        onFocusSearch();
        return;
      }

      // Special handling for when in search box
      if (
        document.activeElement === searchInputRef.current ||
        (document.activeElement &&
          document.activeElement.getAttribute('placeholder') ===
            'Search questions...')
      ) {
        // Enter, Down Arrow, or Tab keys in search box - jump to first question
        if (
          (e.key === 'Enter' || e.key === 'ArrowDown' || e.key === 'Tab') &&
          !e.shiftKey
        ) {
          e.preventDefault();

          // Jump to first question if there are questions
          if (totalQuestions > 0) {
            setActiveIndex(0);
            questionRefs.current[0]?.focus();
            questionRefs.current[0]?.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest',
            });
          }
          return;
        }

        // Escape in search box - clear search and jump to first question
        if (e.key === 'Escape') {
          onClearFilters();
          if (totalQuestions > 0) {
            setActiveIndex(0);
            questionRefs.current[0]?.focus();
          }
          return;
        }

        // Allow '?' for help dialog even in search box
        if (e.key === '?' && e.shiftKey) {
          e.preventDefault();
          setShowHelp(true);
          return;
        }

        // Let other keypresses be handled normally in the search box
        return;
      }

      // Don't capture keyboard events when user is typing in other inputs
      if (
        e.target.tagName === 'INPUT' ||
        e.target.tagName === 'TEXTAREA' ||
        e.target.isContentEditable
      ) {
        // But still capture '?' for help dialog
        if (e.key === '?' && e.shiftKey) {
          e.preventDefault();
          setShowHelp(true);
        }
        return;
      }

      switch (e.key) {
        case 'j':
        case 'ArrowDown':
          // Navigate to next question
          e.preventDefault();
          if (activeIndex < totalQuestions - 1) {
            setActiveIndex(activeIndex + 1);
            questionRefs.current[activeIndex + 1]?.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest',
            });
          }
          break;

        case 'k':
        case 'ArrowUp':
          // Navigate to previous question
          e.preventDefault();
          if (activeIndex > 0) {
            setActiveIndex(activeIndex - 1);
            questionRefs.current[activeIndex - 1]?.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest',
            });
          } else {
            // If at the first question, go back to search box
            onFocusSearch();
          }
          break;

        case 'Enter':
        case ' ': // Space
          // Toggle answer
          e.preventDefault();
          if (activeIndex >= 0 && activeIndex < totalQuestions) {
            onToggleAnswer(activeIndex);
          }
          break;

        case 'e':
          // Edit current question
          e.preventDefault();
          if (activeIndex >= 0 && activeIndex < totalQuestions) {
            onEditQuestion(activeIndex);
          }
          break;

        case 'm':
          // Show answer in modal
          e.preventDefault();
          if (activeIndex >= 0 && activeIndex < totalQuestions) {
            onShowModal(activeIndex);
          }
          break;

        case '/':
          // Focus search
          e.preventDefault();
          onFocusSearch();
          break;

        case 'Escape':
          // Clear filters
          e.preventDefault();
          onClearFilters();
          break;

        case 's':
          // Open sort dropdown
          e.preventDefault();
          onChangeSort();
          break;

        case '?':
          // Show help
          e.preventDefault();
          setShowHelp(true);
          break;

        default:
          break;
      }
    },
    [
      activeIndex,
      totalQuestions,
      questionRefs,
      setActiveIndex,
      onToggleAnswer,
      onEditQuestion,
      onShowModal,
      onHideModal,
      showModal,
      onFocusSearch,
      onClearFilters,
      onChangeSort,
      searchInputRef,
    ]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <>
      <div className='position-fixed bottom-0 end-0 m-3 p-2 bg-dark text-white rounded opacity-75'>
        <small>
          Press <kbd>?</kbd> for keyboard shortcuts
        </small>
      </div>

      <Modal show={showHelp} onHide={() => setShowHelp(false)} size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>Keyboard Shortcuts</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered>
            <thead>
              <tr>
                <th>Key</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <kbd>j</kbd> or <kbd>↓</kbd>
                </td>
                <td>Move to next question</td>
              </tr>
              <tr>
                <td>
                  <kbd>k</kbd> or <kbd>↑</kbd>
                </td>
                <td>
                  Move to previous question (or to search box if at first
                  question)
                </td>
              </tr>
              <tr>
                <td>
                  <kbd>Enter</kbd> or <kbd>Space</kbd>
                </td>
                <td>Expand/collapse the selected question's answer</td>
              </tr>
              <tr>
                <td>
                  <kbd>m</kbd>
                </td>
                <td>Show the answer in a modal window</td>
              </tr>
              <tr>
                <td>
                  <kbd>e</kbd>
                </td>
                <td>Edit the selected question</td>
              </tr>
              <tr>
                <td>
                  <kbd>/</kbd> or <kbd>Ctrl</kbd>+<kbd>F</kbd>
                </td>
                <td>Focus the search box</td>
              </tr>
              <tr>
                <td>
                  <kbd>Enter</kbd> or <kbd>↓</kbd> (in search box)
                </td>
                <td>Jump from search to the first question</td>
              </tr>
              <tr>
                <td>
                  <kbd>Esc</kbd>
                </td>
                <td>Close modal / Clear filters</td>
              </tr>
              <tr>
                <td>
                  <kbd>s</kbd>
                </td>
                <td>Open the sort dropdown</td>
              </tr>
              <tr>
                <td>
                  <kbd>?</kbd>
                </td>
                <td>Show this help dialog</td>
              </tr>
            </tbody>
          </Table>
          <div className='d-flex flex-column align-items-center mt-3'>
            <Badge bg='info' className='mb-2'>
              Modal View Tip
            </Badge>
            <small className='text-center'>
              Use <kbd>m</kbd> to open any question in a modal window for better
              readability, then <kbd>Esc</kbd> to close it
            </small>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default KeyboardNavigation;
