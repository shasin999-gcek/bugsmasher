import React from 'react';
import { Nav, NavItem, Alert, Well, Label } from 'react-bootstrap';

class Result extends React.Component {
  render () {
    return (
      <div className="result-section">
        <Nav bsStyle="pills" justified activeKey={2} onSelect={this.handleSelect}>
           <NavItem eventKey={2} title="Item">
             <i className="material-icons">timer</i>
              00:30:29 sec
           </NavItem>
         </Nav>
         <Alert bsStyle="danger" className="submit-status">
            <div className="container-fluid">
              <div className="alert-icon">
                <i className="material-icons">error_outline</i>
              </div>
              <button type="button" className="close">
                <span><i className="material-icons">clear</i></span>
              </button>
              <strong>Submission Rejected</strong>
            </div>
          </Alert>
          <Well>
            <table class="table">
              <thead>
                <tr>
                  <th>Problem</th>
                  <th>Last sub. time</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>sssss</td>
                  <td>Shasin</td>
                </tr>
              </tbody>
            </table>
          </Well>
      </div>
    );
  }
}

export default Result;
