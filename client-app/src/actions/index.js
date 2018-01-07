import { SET_LOGGED_IN_TEAM } from 'constants';

export const logIn = ({ team_name, password }) => {
	return {
		type: SET_LOGGED_IN_TEAM,
		team_name,
		password
	}
}
