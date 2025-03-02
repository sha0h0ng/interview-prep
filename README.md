# Interview Prep App

A comprehensive React application for creating, organizing, and practicing interview questions with support for Markdown answers, tags, and shared content between questions.

## Features

- 📝 Create and edit interview questions with Markdown answers
- 🔍 Search and filter questions by text and tags
- 🏷️ Tag questions for better organization
- 🔄 Share answers between related questions
- 📥 Import and export questions via CSV
- 📱 Responsive design that works on desktop and mobile
- 🚀 Fast and lightweight with browser-based storage

## Technology Stack

- **React** - UI library
- **React Router** - Navigation
- **React Bootstrap** - UI components
- **React Markdown** - Markdown rendering
- **PapaParse** - CSV parsing and generation
- **localStorage** - Browser-based data persistence

## Installation

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/interview-prep-app.git
   cd interview-prep-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or with yarn
   yarn install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   # or with yarn
   yarn dev
   ```

4. **Build for production**
   ```bash
   npm run build
   # or with yarn
   yarn build
   ```

## Usage

### Managing Questions

- **View Questions**: The home page displays all your questions with search and tag filters
- **Create Question**: Click "Create" in the navigation bar to add a new question
- **Edit Question**: Click the "Edit" button on any question to modify it
- **Delete Question**: On the edit page, click "Delete" and confirm to remove a question

### Question Features

#### Markdown Support

Write answers in Markdown format with support for:

- **Bold** and _italic_ text
- Lists and sublists
- Code blocks and inline code
- Links and images (referenced from web)
- Tables and quotes

#### Tagging System

- Add tags to categorize questions (e.g., "react", "algorithms", "backend")
- Filter questions by clicking on tags in the home page
- Combine multiple tags to narrow your search
- Export and import tags via CSV

#### Shared Answers

Link questions to share the same answer:

1. Create a question with a complete answer
2. Create or edit another question
3. Click "Use Answer From Another Question"
4. Select the source question
5. Both questions now display the same answer content

### Data Management

#### Import/Export

- **Export**: Click "Settings" > "Export Questions" to download a CSV file
- **Import**: Click "Import" in the navigation bar to upload a CSV file
- **Format**: The CSV should include columns for title, content, linkedQuestionTitle, and tags

#### Data Storage

- All data is stored in your browser's localStorage
- Click "Settings" > "Clear All Data" to reset the application (after confirming)
- Export your data regularly for backup

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── ClearDataModal.jsx
│   ├── MarkdownEditor.jsx
│   ├── Navbar.jsx
│   ├── QuestionForm.jsx
│   ├── QuestionItem.jsx
│   ├── QuestionList.jsx
│   └── TagInput.jsx
├── pages/             # Page components
│   ├── CreatePage.jsx
│   ├── EditPage.jsx
│   ├── HomePage.jsx
│   └── ImportPage.jsx
├── services/          # Business logic
│   ├── dataExportService.js
│   └── questionService.js
├── App.jsx            # Main application component
└── main.jsx           # Entry point
```

## Features in Detail

### Search and Filtering

- **Text Search**: Filter questions by typing in the search box
- **Tag Filtering**: Click on tags to filter questions that have those tags
- **Combined Filtering**: Use both text search and tag filtering simultaneously

### Markdown Editor

- **Write/Preview Tabs**: Switch between writing and previewing your answer
- **Formatting Help**: Markdown syntax guidance in the placeholder text
- **Rich Preview**: Rendered Markdown with syntax highlighting for code

### CSV Import/Export

The CSV format supports:

- **Question Titles**: Required column for the interview question
- **Answer Content**: Optional Markdown content for the answer
- **Linked Questions**: Optional references to questions that share answers
- **Tags**: Optional semicolon-separated list of tags

Example CSV format:

```
title,content,linkedQuestionTitle,tags
"What is React?","React is a JavaScript library for building user interfaces.",,"react;javascript;frontend"
"Explain useState in React","The useState hook allows you to add state to functional components.",,"react;hooks;state"
"What are React Hooks?","","Explain useState in React","react;hooks"
```

### Data Persistence

- Questions are stored in browser localStorage
- Data persists between browser sessions
- Export regularly to backup your questions
- Import to restore or transfer to another device

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [React Bootstrap](https://react-bootstrap.github.io/)
- [React Markdown](https://github.com/remarkjs/react-markdown)
- [PapaParse](https://www.papaparse.com/)
- [Vite](https://vitejs.dev/)

---

Created with ❤️ for interview preparation
