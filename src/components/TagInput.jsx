import { useState, useRef } from 'react';
import { Form, Badge, CloseButton } from 'react-bootstrap';

function TagInput({ tags = [], onChange }) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);

  const handleKeyDown = (e) => {
    // Submit tag on Enter, Tab, or comma
    if (e.key === 'Enter' || e.key === 'Tab' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const tagToAdd = inputValue.trim();

    if (tagToAdd && !tags.includes(tagToAdd)) {
      // Add the new tag
      onChange([...tags, tagToAdd]);
      setInputValue('');
    } else {
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    onChange(updatedTags);
  };

  const handleContainerClick = () => {
    // Focus the input when the container is clicked
    inputRef.current?.focus();
  };

  return (
    <div
      className='border rounded p-2 d-flex flex-wrap align-items-center'
      onClick={handleContainerClick}
      style={{ minHeight: '48px', cursor: 'text' }}
    >
      {tags.map((tag) => (
        <Badge
          key={tag}
          bg='primary'
          className='me-2 mb-1 d-flex align-items-center'
        >
          {tag}
          <CloseButton
            variant='white'
            onClick={() => removeTag(tag)}
            style={{ fontSize: '0.65rem', marginLeft: '5px' }}
          />
        </Badge>
      ))}

      <Form.Control
        ref={inputRef}
        type='text'
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder={
          tags.length === 0 ? 'Add tags (press Enter after each tag)' : ''
        }
        style={{
          flex: '1',
          minWidth: '120px',
          border: 'none',
          outline: 'none',
          boxShadow: 'none',
          padding: '0 5px',
          background: 'transparent',
        }}
      />
    </div>
  );
}

export default TagInput;
