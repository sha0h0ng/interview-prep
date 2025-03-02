// src/components/Navbar.jsx
import {
  Nav,
  Navbar as BootstrapNavbar,
  Container,
  NavDropdown,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Navbar({ onExport, onOpenClearModal }) {
  return (
    <BootstrapNavbar bg='dark' variant='dark' expand='lg'>
      <Container>
        <BootstrapNavbar.Brand as={Link} to='/'>
          Interview Star
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls='basic-navbar-nav' />
        <BootstrapNavbar.Collapse id='basic-navbar-nav'>
          <Nav className='ms-auto'>
            <Nav.Link as={Link} to='/'>
              Questions
            </Nav.Link>
            <Nav.Link as={Link} to='/create'>
              Create
            </Nav.Link>
            <Nav.Link as={Link} to='/import'>
              Import
            </Nav.Link>
            <NavDropdown title='Settings' id='settings-dropdown' align='end'>
              <NavDropdown.Item onClick={onExport}>
                Export Questions
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item
                onClick={onOpenClearModal}
                className='text-danger'
              >
                Clear All Data
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}

export default Navbar;
