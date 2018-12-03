import { SET_CURRENT_USER } from '../actions/types';
import isEmpty from '../utils/is-empty';

const initailState = {
	isAuthenticated: false,
	user: {}
};

const authReducer = (state = initailState, action) => {
	switch (action.type) {
		case SET_CURRENT_USER:
			return {
				...state,
				isAuthenticated: !isEmpty(action.payload),
				user: action.payload
			};
		default:
			return state;
	}
};

export default authReducer;
