import React, { Component } from 'react';

// importing components
import { FormGroup, FormControl, InputGroup, Button, Alert } from 'react-bootstrap';
import { Card, Footer, Content } from './Reusable';
import Loading from 'components/Loading/Loading';
import Navigation from 'components/Navigation';

// import auth helper
import auth from 'helpers/auth';

class Register extends Component {
	constructor(props) {
		super(props);
		this.state = {
			no_of_players: 0,
			player_one_name: '',
			player_two_name: '',
			mobile_number: '',
			team_name: '',
			password: '',
			re_password: '',
			error_msgs: [],
			loading: false
		}
	}
	

  handleInputChange(e) {
		const { name, value } = e.target;
    this.setState({ [name]: value });
  }
	
	validateForm() {
		if(this.state.no_of_players === 2 
			 && !this.state.player_two_name.length) {
			alert("Player two name is required");
			return false;
		} 
		
		if( /[^a-zA-Z0-9]/.test(this.state.team_name) ) {
       alert('Team name consist of letters and numbers' + 
						 '(special characters not allowed)');
       return false;
    }
		
		if(this.state.password.length < 6) {
			alert("password too weak (more than 6 character required)");
			return false;
		}
		
		if(this.state.password !== this.state.re_password) {
			alert("password does not match. try again..");
			return false;
		}
		
		return true;
	}
	
	handleSubmit(e) {
		if(this.validateForm()) {

			// change view to loading state
			this.setState({ loading: true });

			// spread operator tto filter out re_password
			const {re_password, loading, ...rest} = this.state;

			// API call to register end point
			auth.register({...rest})
				.then(res => {
					// stop laoding
					this.setState({loading: false});

					// TODO: avoid logging and display to users
					if(res.data.err) {
						// handle Validation errors
						if(res.data.err.code === 11000) {
							console.log("Team name already taken.choose another name");
						} 

						if(res.data.errors) {
							this.setState({ error_msgs: res.data.errors });
						} 

					} else if(res.data.statusText === "OK") {
						this.props.history.push('/login');
					}

				})
				.catch(e => console.error(e));

		}
	}
	
	getValidationState(name) {
		if(!this.state[name].length) {
			return "error";
		}
		return null;
	}
	
	render() {
		if(this.state.loading) {
			return <Loading loading={true} />
		}

 		return (
			<div style={{overflowY: true}}>
				<Navigation />
				{
					this.state.error_msgs.map(msg => {
						return (
							<Alert bsStyle="danger" style={{margin: 'auto', width: '500px'}}>
								<div className="container-fluid">
								  <div className="alert-icon">
										<i className="material-icons">warning</i>
								  </div>
							      <b>{msg.message}</b> 
							    </div>
							</Alert> 
						)
					})
				}
				<Card style={{marginTop: "20px"}}>
					<Content>
						<InputGroup>
							<InputGroup.Addon>
								<i className="material-icons">group</i>
							</InputGroup.Addon>
							<FormGroup>
								<FormControl
									componentClass="select" 
									name="no_of_players"
									value={this.state.no_of_players}
									onChange={this.handleInputChange.bind(this)}
								 >
								 	<option value={0}>Choose Number of players</option>
								 	<option value={1}>One</option>
								 	<option value={2}>Two</option>
								</FormControl>
							</FormGroup>
						</InputGroup>
						{this.props.formFields.map(({ addonIcon, props }, index) => {
							if(this.state.no_of_players === '1' && props.name === 'player_two_name')
								return null; 	
							return (
								<InputGroup key={index}>
									<InputGroup.Addon>
										<i className="material-icons">{addonIcon}</i>
									</InputGroup.Addon>
									<FormGroup validationState={this.getValidationState(props.name)}>
										<FormControl 
											value={this.state[props.name]}
											onChange={this.handleInputChange.bind(this)}
											{...props}
										/>
										<FormControl.Feedback />
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
							Sign Up
						</Button>
					</Footer>
				</Card>
			</div>
		);
	}
}

Register.defaultProps = {
	formFields: [
		{
			props: {
				name: 'player_one_name',
				type: 'text',
				placeholder: 'Player One Name'
			},
			addonIcon: 'face',
		},
		{
			props: {
				name: 'player_two_name',
				type: 'text',
				placeholder: 'Player Two Name'
			},
			addonIcon: 'face'
		},
		{
			props: {
				name: 'mobile_number',
				type: 'number',
				placeholder: 'Contact Number'
			},
			addonIcon: 'phone'
		},
		{
			props: {
				name: 'team_name',
				type: 'text',
				placeholder: 'Team Name'
			},
			addonIcon: 'group'
		},
		{
			props: {
				name: 'password',
				type: 'password',
				placeholder: 'Password'
			},
			addonIcon: 'lock'
		},
		{
			props: {
				name: 're_password',
				type: 'password',
				placeholder: 'Confirm Password'
			},
			addonIcon: 'lock'
		}
	] 
}


export default Register;