// src/App.jsx
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toast, ToastContainer } from 'react-bootstrap';
import HomePage from './pages/HomePage';
import CreatePage from './pages/CreatePage';
import EditPage from './pages/EditPage';
import ImportPage from './pages/ImportPage';
import Navbar from './components/Navbar';
import ClearDataModal from './components/ClearDataModal';
import { Container } from 'react-bootstrap';
import { getQuestions, saveQuestions } from './services/questionService';
import {
  exportQuestionsToCsv,
  clearAllData,
} from './services/dataExportService';

function App() {
  const [questions, setQuestions] = useState([]);
  const [showClearModal, setShowClearModal] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success',
  });

  useEffect(() => {
    // Load questions from local storage on initial render
    const loadedQuestions = getQuestions();
    setQuestions(loadedQuestions);
  }, []);

  const addQuestion = (newQuestion) => {
    const updatedQuestions = [
      ...questions,
      {
        ...newQuestion,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      },
    ];
    setQuestions(updatedQuestions);
    saveQuestions(updatedQuestions);
  };

  const updateQuestion = (id, updatedQuestion) => {
    const updatedQuestions = questions.map((question) =>
      question.id === id
        ? {
            ...question,
            ...updatedQuestion,
            updatedAt: new Date().toISOString(),
          }
        : question
    );
    setQuestions(updatedQuestions);
    saveQuestions(updatedQuestions);
  };

  const deleteQuestion = (id) => {
    // Check if any questions are linked to this one
    const linkedQuestions = questions.filter((q) => q.linkedAnswerId === id);

    // First update any linked questions to remove the link
    const unlinkUpdates = linkedQuestions.map((q) => ({
      ...q,
      linkedAnswerId: null,
      updatedAt: new Date().toISOString(),
    }));

    // Then remove the question itself
    const remainingQuestions = questions.filter((q) => q.id !== id);

    // Combine unlinked questions with remaining questions
    const updatedQuestions = remainingQuestions.map((q) => {
      const unlinkedVersion = unlinkUpdates.find((u) => u.id === q.id);
      return unlinkedVersion || q;
    });

    setQuestions(updatedQuestions);
    saveQuestions(updatedQuestions);
  };

  const getQuestionById = (id) => {
    return questions.find((question) => question.id === id) || null;
  };

  const getAllQuestions = () => {
    return questions;
  };

  const handleCsvUpload = (csvQuestions) => {
    const updatedQuestions = [...questions, ...csvQuestions];
    setQuestions(updatedQuestions);
    saveQuestions(updatedQuestions);

    // Show success toast
    showToast(
      `Successfully imported ${csvQuestions.length} questions.`,
      'success'
    );
  };

  // New functions for export and clear features

  const handleExport = () => {
    if (questions.length === 0) {
      showToast('No questions to export.', 'warning');
      return;
    }

    exportQuestionsToCsv(questions, getQuestionById);
    showToast('Questions exported successfully.', 'success');
  };

  const handleOpenClearModal = () => {
    setShowClearModal(true);
  };

  const handleCloseClearModal = () => {
    setShowClearModal(false);
  };

  const handleClearData = () => {
    clearAllData();
    setQuestions([]);
    showToast('All data has been cleared.', 'success');
  };

  // Toast helper function
  const showToast = (message, type = 'success') => {
    setToast({
      show: true,
      message,
      type,
    });

    // Auto-hide after 5 seconds
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 5000);
  };

  return (
    <>
      <Navbar onExport={handleExport} onOpenClearModal={handleOpenClearModal} />
      <Container className='py-4'>
        <Routes>
          <Route
            path='/'
            element={
              <HomePage questions={questions} getQuestion={getQuestionById} />
            }
          />
          <Route
            path='/create'
            element={<CreatePage onAddQuestion={addQuestion} />}
          />
          <Route
            path='/edit/:id'
            element={
              <EditPage
                getQuestion={getQuestionById}
                getAllQuestions={getAllQuestions}
                onUpdateQuestion={updateQuestion}
                onDelete={deleteQuestion}
              />
            }
          />
          <Route
            path='/import'
            element={<ImportPage onCsvUpload={handleCsvUpload} />}
          />
        </Routes>
      </Container>

      {/* Clear Data Confirmation Modal */}
      <ClearDataModal
        show={showClearModal}
        handleClose={handleCloseClearModal}
        handleClearData={handleClearData}
      />

      {/* Toast Notifications */}
      <ToastContainer position='bottom-end' className='p-3'>
        <Toast
          show={toast.show}
          onClose={() => setToast((prev) => ({ ...prev, show: false }))}
          bg={toast.type}
          delay={5000}
          autohide
        >
          <Toast.Header>
            <strong className='me-auto'>Interview Prep</strong>
          </Toast.Header>
          <Toast.Body className={toast.type === 'success' ? 'text-white' : ''}>
            {toast.message}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}

export default App;
