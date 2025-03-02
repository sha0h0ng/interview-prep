// src/pages/HomePage.jsx - Search Input Section
// This is just the search input part of the HomePage.jsx file

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
</Stack>;
