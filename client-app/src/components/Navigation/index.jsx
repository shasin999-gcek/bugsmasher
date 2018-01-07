import React, { Component } from 'react';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';

import Sidebar from './Sidebar';

class Navigation extends Component{
  render() {
    return (
      <Navbar className="navbar-success" staticTop fluid>
        <Navbar.Header>
          <a className="navbar-brand">
            <i className="material-icons">bug_report</i>
             Bug Smash
          </a>
        </Navbar.Header>
        <Nav pullRight>
          <NavItem eventKey={1} href="#">
            <i className="material-icons">exit_to_app</i>
            Logout
          </NavItem>
        </Nav>
        <Sidebar />
      </Navbar>
    );
  }
}

export default Navigation;
