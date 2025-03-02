const STORAGE_KEY = 'interview-prep-questions';

export const getQuestions = () => {
  try {
    const savedQuestions = localStorage.getItem(STORAGE_KEY);
    return savedQuestions ? JSON.parse(savedQuestions) : [];
  } catch (error) {
    console.error('Error loading questions:', error);
    return [];
  }
};

export const saveQuestions = (questions) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
    return true;
  } catch (error) {
    console.error('Error saving questions:', error);
    return false;
  }
};
