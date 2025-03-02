// src/components/MarkdownEditor.jsx
import { useState } from 'react';
import { Form, Nav, Tab, Alert } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';

function MarkdownEditor({
  value,
  onChange,
  required,
  readOnly = false,
  placeholder,
}) {
  const [activeTab, setActiveTab] = useState(readOnly ? 'preview' : 'write');

  return (
    <div className='markdown-editor'>
      <Tab.Container
        activeKey={activeTab}
        onSelect={!readOnly ? setActiveTab : undefined}
      >
        <Nav variant='tabs' className='mb-2'>
          <Nav.Item>
            <Nav.Link
              eventKey='write'
              disabled={readOnly}
              className={readOnly ? 'text-muted' : ''}
            >
              Write
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey='preview'>Preview</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey='write'>
            {readOnly ? (
              <Alert variant='info'>
                This content is linked from another question and cannot be
                edited directly.
              </Alert>
            ) : (
              <Form.Control
                as='textarea'
                rows={10}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required={required}
                placeholder={
                  placeholder ||
                  'Write your answer in markdown format. You can use **bold**, *italic*, lists, code blocks, and more.'
                }
                readOnly={readOnly}
              />
            )}
          </Tab.Pane>
          <Tab.Pane eventKey='preview'>
            <div className='p-3 border rounded bg-light markdown-preview'>
              {value ? (
                <ReactMarkdown>{value}</ReactMarkdown>
              ) : (
                <em className='text-muted'>
                  {readOnly
                    ? 'This question uses a shared answer from another question.'
                    : 'No content to preview'}
                </em>
              )}
            </div>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
}

export default MarkdownEditor;
