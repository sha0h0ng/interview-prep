// src/components/KeyboardNavigation.jsx
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
  onHelpToggle,
  totalQuestions,
}) {
  const [showHelp, setShowHelp] = useState(false);

  const handleKeyDown = useCallback(
    (e) => {
      // Ctrl+F for search (common browser shortcut)
      if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        onFocusSearch();
        return;
      }

      // Don't capture keyboard events when user is typing in an input
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
      onFocusSearch,
      onClearFilters,
      onChangeSort,
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
                <td>Move to previous question</td>
              </tr>
              <tr>
                <td>
                  <kbd>Enter</kbd> or <kbd>Space</kbd>
                </td>
                <td>Expand/collapse the selected question's answer</td>
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
                  <kbd>Esc</kbd>
                </td>
                <td>Clear all filters</td>
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
          <div className='d-flex justify-content-center mt-3'>
            <Badge bg='secondary'>
              Tip: You can combine shortcuts for faster workflow
            </Badge>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default KeyboardNavigation;
