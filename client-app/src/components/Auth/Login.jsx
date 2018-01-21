import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { bake_cookie, read_cookie } from 'sfcookies';
import axios from 'axios';

import { InputGroup, FormGroup, FormControl, Button,Alert } from 'react-bootstrap';
import { Header, Card, Content, Footer } from './Reusable';
import Loading from 'components/Loading/Loading';
import Navigation from 'components/Navigation';

import { logIn } from 'actions';
import auth from 'helpers/auth';

class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			team_name: '',
			password: '',
			error_msg: null,
			loading: false
		}
	}
	
	handleInputChange(e) {
		const { name, value } = e.target;
		this.setState({[name]: value});
	}
	
	validateForm() {
		if(!this.state.team_name.length) {
			alert("Team name is required");
			return false;
		} 
		
		if(!this.state.password.length) {
			alert("password is required");
			return false;
		} 
		return true;
	}

	handleSubmit() {
		if(this.validateForm()) {
			this.setState({ loading: true });

			auth.login(this.state)
			.then(res => {
				this.setState({ loading: false });
				
				if(res.data.status !== 200) {
					this.setState({ error_msg: res.data.message });
				} else {
					this.props.logIn(res.data.team_name, res.data.token);
					bake_cookie('token', res.data.token);
					axios.defaults.headers.common['Authorization'] = 'JWT ' + read_cookie('token');
					this.props.history.push('/app/language');
				}
			});
		}
	}
	
	render() {
		if(this.state.loading) {
			return <Loading loading={true} />
		}

		return (
			<div>
				<Navigation />
				{
					this.state.error_msg && (
						<Alert bsStyle="danger" style={{margin: 'auto', width: '500px'}}>
							<div className="container-fluid">
							  <div className="alert-icon">
									<i className="material-icons">warning</i>
							  </div>
						      <b>{this.state.error_msg}</b> 
						    </div>
						</Alert> 
				)}
				<Card style={{marginTop: "100px"}}>
					<Header style={{
				    fontFamily: 'Quicksand',
				    fontWeight: 'bold',
				    fontSize: '20px',
					}}>
						<h4>Login</h4>
					</Header>
					<Content style={{marginTop: "30px"}}>
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
							className="btn-round"
							onClick={this.handleSubmit.bind(this)}
						>
							Login
						</Button>
					</Footer>
				</Card>
			</div>
		);
	}
}

Login.defaultProps = {
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);


