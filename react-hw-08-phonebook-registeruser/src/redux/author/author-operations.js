import axios from 'axios';
// import {
//   registerUserRequest,
//   registerUserSuccess,
//   registerUserError,
// } from '../contacts/contacts-actions';
import { createAsyncThunk } from '@reduxjs/toolkit';
axios.defaults.baseURL = 'https://goit-phonebook-api.herokuapp.com';
const token = {
  set(token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  },
  unset() {
    axios.defaults.headers.common.Authorization = '';
  },
};
const register = createAsyncThunk('register', async credentials => {
  try {
    const { data } = await axios.post('/users/signup', credentials);
    token.set(data.token);
    return data;
  } catch (error) {
    console.log(error);
  }
});
const login = createAsyncThunk('login', async credentials => {
  try {
    const { data } = await axios.post('/users/login', credentials);
    token.set(data.token);
    return data;
  } catch (error) {
    console.log(error);
  }
});
const logout = createAsyncThunk('logout', async () => {
  try {
    await axios.post('/users/logout');
    token.unset();
  } catch (error) {
    console.log(error);
  }
});
const fetchCurrentUser = createAsyncThunk(
  'pageRefresh',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const persistedToken = state.auth.token;
    if (persistedToken === null) {
      return thunkAPI.rejectWithValue();
    }
    token.set(persistedToken);
    try {
      const { data } = await axios.get('/users/current');
      return data;
    } catch (error) {
      console.log(error);
    }
  },
);
export default { register, login, logout, fetchCurrentUser };
