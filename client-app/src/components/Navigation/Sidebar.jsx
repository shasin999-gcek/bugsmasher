import React from 'react'

class Sidebar extends React.Component {
  render () {
    return (
      <div id="sidebar-wrapper" className="sidebar-toggle">
        <ul className="sidebar-nav">
          <li>
              <a href="#item1"><i className="material-icons">description</i>Problem 1</a>
          </li>
          <li>
              <a href="#item1"><i className="material-icons">description</i>Problem 2</a>
          </li>
          <li>
              <a href="#item1"><i className="material-icons">description</i>Problem 3</a>
          </li>
        </ul>
      </div>
    );
  }
}

export default Sidebar;
