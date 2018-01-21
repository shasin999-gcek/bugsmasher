import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

import app from 'helpers/app';
import { setLanguage } from 'actions'; 

import Loading from 'components/Loading/Loading';

const styles = {
	modal: {
		display: 'block',
		textAlign: 'center',
		fontSize: '25px'
	},
	button: {
		fontSize: '20px',
		fontWeight: 'bold'
	}
}
class Language extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false
		}
	}

	handleClick(language) {
		this.setState({ loading: true });
		app.set_language(language)
			.then(res => {
				if(res.data.message === 'ok') {
					this.setState({ loading: false });
					this.props.setLanguage(language);
					this.props.history.push('/app/console');
				}
			})
	}

	render() {
		if(this.state.loading) {
			return <Loading loading={true} />
		}

		return (
			<div className="modal" style={styles.modal}>
			  <div className="modal-dialog">
			    <div className="modal-content">
			      <div className="modal-header">
			        <h4 className="modal-title" id="myModalLabel">Choose Programming Language</h4>
			      </div>
			      <div className="modal-body">
			       <button 
			       	className="btn btn-success btn-lg"
			       	style={styles.button}
			       	onClick={this.handleClick.bind(this, 'C')}>
			       	C
			       </button>&nbsp;&nbsp;
			        <button 
				       	className="btn btn-success btn-lg"
				       	style={styles.button}
				       	onClick={this.handleClick.bind(this, 'CPP')}>
			       		C++
			       </button>&nbsp;&nbsp;
			       
			      </div>
			    </div>
			  </div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		language: state.language
	}
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({ setLanguage }, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(Language);