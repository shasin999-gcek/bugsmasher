import React from 'react'
import { Row, Col } from 'react-bootstrap';

// importing stylesheets
import "assets/css/console.css";
import "assets/css/material-kit.css";
import "assets/css/bootstrap-overrides.css";


// importing necessary components
import Loading from 'components/Loading/Loading';
import Navigation from 'components/Navigation';
import Sidebar from 'components/Navigation/Sidebar';
import Editor from './Editor';
import Result from './Result';

import app from 'helpers/app';

class Main extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			questions: [],
			settings: {},
			selectedLevel: 1,
			loading: true
		};

		this.handleOnClick = this.handleOnClick.bind(this);
	}

	componentDidMount() {
		app.getAllInfo()
			.then(data => {
				this.setState({ 
					questions: data[0],
					settings: data[1],
					loading: false 
				})
			});
	}

	handleOnClick(level) {
		this.setState({ selectedLevel: level });
	}

  render () {
  	if(this.state.loading) {
  		return <Loading loading={true} />
  	}

    return (
			<div>
				<Navigation>
					<Sidebar 
						problems={this.state.questions} 
						selectLevel={this.handleOnClick} 
					/>
				</Navigation>
				<div className="body-content">
					<Row>
						<Col md={9}>
							<Editor
								problems={this.state.questions}
								selectedLevel={this.state.selectedLevel} 
							/>
						</Col>
						<Col md={3}>
							<Result selectedLevel={this.state.selectedLevel} />
						</Col>
					</Row>
				</div>
			</div>
    );
  }
}

export default Main;
