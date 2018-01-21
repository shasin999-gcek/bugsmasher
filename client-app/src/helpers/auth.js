import axios from 'axios';

const { host, protocol, hostname, port } = window.location;
const url = protocol + '//' + hostname + ':3000' + '/api';


function handleError(e) {
	console.error(e);
	return null;
}

export default {
	register(formData) {
		return axios.post(url + '/register', formData)
			.catch(e => handleError(e));
	},

	login(formData) {
		return axios.post(url + '/login', formData)
			.catch(e => handleError(e));
	},

	checkLoggedIn() {
		return axios.get(url + '/check/login')
			.then(response => response.data)
			.catch(e => handleError(e));
	} 
}
