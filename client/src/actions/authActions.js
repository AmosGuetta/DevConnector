import axios from 'axios';
import jwt_decode from 'jwt-decode';
import setAuthToken from '../utils/setAuthToken';

import { GET_ERRORS, SET_CURRENT_USER } from './types';

export const registerUser = (userData, history) => (dispatch) => {
	axios.post('/api/users/register', userData).then((res) => history.push('/login')).catch((err) =>
		dispatch({
			type: GET_ERRORS,
			payload: err.response.data
		})
	);
};

export const loginUser = (userData) => (dispatch) => {
	axios
		.post('/api/users/login', userData)
		.then((res) => {
			// Save user data to loaclstorage
			const { token } = res.data;
			// Set token to loaclstorage
			localStorage.setItem('jwtToken', token);
			// Set token to Auth header
			setAuthToken(token);
			// Decode token to get user data
			const decode = jwt_decode(token);
			//Set current user
			dispatch({
				type: SET_CURRENT_USER,
				payload: decode
			});
		})
		.catch((err) =>
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			})
		);
};
