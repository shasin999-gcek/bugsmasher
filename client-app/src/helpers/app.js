import axios from 'axios';

const { host, protocol, hostname, port } = window.location;
const url = protocol + '//' + hostname + ':3000' + '/api';


function handleError(e) {
	console.error(e);
	return null;
}

function getSettings() {
	return axios.get(url + '/settings').catch(e => handleError(e));
}

function getQuestions() {
	return axios.get(url + '/questions').catch(e => handleError(e));
}


export default {
	set_language: function(language) {
		return axios.post(url + '/language', { language })
			.catch(e => handleError(e));
	},

	getAllInfo: function() {
		return axios.all([ getQuestions(), getSettings()])
			.then(axios.spread(function (ques, settgs) {
    		// Both requests are now complete
    		return [ ques.data, settgs.data ];
  		})).catch(e => handleError(e));
	}
}