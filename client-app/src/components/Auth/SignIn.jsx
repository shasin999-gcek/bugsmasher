import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { InputGroup, FormGroup, FormControl, Button } from 'react-bootstrap';
import { Header, Card, Content, Footer } from './Reusable';

import { logIn } from 'actions';

class SignIn extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			team_name: '',
			password: ''
		}
	}
	
	handleInputChange(e) {
		const { name, value } = e.target;
		this.setState({[name]: value});
	}
	
	handleSubmit() {
		
	}
	
	render() {
		return (
			<Card style={{marginTop: "50px"}}>
				<Header>
					<h4>Sign In</h4>
				</Header>
				<Content>
					{this.props.formFields.map((formField, index) => {
						return (
							<InputGroup key={index}> 
								<InputGroup.Addon>
									<i className="material-icons">{formField.addonIcon}</i>
								</InputGroup.Addon>
								<FormGroup>
									<FormControl
										type={formField.type}
										name={formField.name}
										placeholder={formField.placeholder}
										value={this.state[formField.name]}
										onChange={this.handleInputChange.bind(this)}
										required
									/>
								</FormGroup>
							</InputGroup>
						);
					})}
				</Content>
				<Footer>
					<Button 
						type="button"
						bsStyle="success"
						onClick={this.handleSubmit.bind(this)}
					>
						Sign In
					</Button>
				</Footer>
			</Card>
		);
	}
}

SignIn.defaultProps = {
	formFields: [
		{
			name: 'team_name',
			type: 'text',
			addonIcon: '',
			placeholder: 'Team Name'
		},
		{
			name: 'password',
			type: 'password',
			addonIcon: '',
			placeholder: 'password'
		}
	]
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({ logIn }, dispatch);
} 

const mapStateToProps = (state) => {
	return {
		team: state
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);


