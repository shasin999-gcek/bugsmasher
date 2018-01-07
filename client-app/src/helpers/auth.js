import axios from 'axios';

const { host, protocol, hostname, port } = window.location;
const url = protocol + '//' + hostname + ':3000' + '/api';


export default {
	register(formData) {
		return axios.post(url + '/register', formData);
	}
}
