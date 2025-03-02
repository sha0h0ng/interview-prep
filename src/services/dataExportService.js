import Papa from 'papaparse';

// Function to export questions to CSV format with linked answer support
export const exportQuestionsToCsv = (questions, getQuestionById) => {
  // Prepare data for export, preserving linked answers
  const exportData = questions.map((question) => {
    let linkedQuestionTitle = '';

    // If this question has a linked answer, get the title of the linked question
    if (question.linkedAnswerId) {
      const linkedQuestion = getQuestionById(question.linkedAnswerId);
      if (linkedQuestion) {
        linkedQuestionTitle = linkedQuestion.title;
      }
    }

    // Convert tags array to comma-separated string
    const tagsString =
      question.tags && Array.isArray(question.tags)
        ? question.tags.join(';')
        : '';

    return {
      title: question.title,
      content: question.content || '', // The actual content (empty for linked questions)
      linkedQuestionTitle: linkedQuestionTitle, // Title of the question it shares an answer with
      tags: tagsString, // Semicolon-separated tags
    };
  });

  // Convert to CSV using PapaParse
  const csv = Papa.unparse(exportData, {
    quotes: true, // Put quotes around all fields
    header: true, // Include header row
  });

  // Create a blob and download link
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  // Create a temporary link and trigger download
  const link = document.createElement('a');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

  link.href = url;
  link.setAttribute('download', `interview-questions-${timestamp}.csv`);
  document.body.appendChild(link);
  link.click();

  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Function to clear all data from localStorage
export const clearAllData = () => {
  localStorage.removeItem('interview-prep-questions');
  // You can add more items to clear if you add more features that use localStorage
};
