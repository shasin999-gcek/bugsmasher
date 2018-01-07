import React from 'react'
import {Row, Col } from 'react-bootstrap';

// importing stylesheets
import "assets/css/console.css";
import "assets/css/material-kit.css";
import "assets/css/bootstrap-overrides.css";


// importing necessary components
import Navigation from 'components/Navigation';
import Editor from './Editor';
import Result from './Result';

class Main extends React.Component {
  render () {
    return (
			<div>
				<Navigation />
				<div className="body-content">
					<Row>
						<Col md={9}>
							<Editor />
						</Col>
						<Col md={3}>
							<Result />
						</Col>
					</Row>
				</div>
			</div>
    );
  }
}

export default Main;
