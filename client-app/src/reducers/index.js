import { SET_LOGGED_IN_TEAM } from 'constants';
import { logIn } from 'actions';

const team = {
	team_name: '',
	_token: ''
};

export const signInReducer = (state=team, action) => {
	let newTeam = {...state};
	switch(action.type) {
		case SET_LOGGED_IN_TEAM:
			newTeam.team_name = action.team_name;
			newTeam.password = action.password;
		default:
			return state;
	}
}