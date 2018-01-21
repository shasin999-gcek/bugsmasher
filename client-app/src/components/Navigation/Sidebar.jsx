import React from 'react'

class Sidebar extends React.Component {
  render () {
    return (
      <div id="sidebar-wrapper" className="sidebar-toggle">
        <ul className="sidebar-nav">
          {this.props.problems.map((problem, index) => (
            <li key={index}>
              <a 
                href="" 
                onClick={(e) => this.props.selectLevel(problem.info.level)}>
                <i className="material-icons">description</i>
                { 'Level ' + problem.info.level }
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Sidebar;
