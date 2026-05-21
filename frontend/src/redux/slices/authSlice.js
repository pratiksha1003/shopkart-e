import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import i18n from '../../i18n';

const userInfo = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/users/login', credentials);
    localStorage.setItem('userInfo', JSON.stringify(data));
    toast.success(i18n.t('auth.welcomeBack', { name: data.name }));
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/users/register', userData);
    localStorage.setItem('userInfo', JSON.stringify(data));
    toast.success(i18n.t('auth.accountCreated'));
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const updateProfile = createAsyncThunk('auth/profile', async (profile, { rejectWithValue }) => {
  try {
    const { data } = await api.put('/users/profile', profile);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const updated = { ...userInfo, ...data };
    localStorage.setItem('userInfo', JSON.stringify(updated));
    toast.success(i18n.t('profile.updated'));
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userInfo,
    loading: false,
    error: null,
    profile: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('userInfo');
      state.userInfo = null;
      state.profile = null;
      toast.success(i18n.t('auth.loggedOut'));
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(login.fulfilled, (s, a) => { s.loading = false; s.userInfo = a.payload; })
      .addCase(login.rejected, (s, a) => { s.loading = false; s.error = a.payload; toast.error(a.payload); })
      .addCase(register.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(register.fulfilled, (s, a) => { s.loading = false; s.userInfo = a.payload; })
      .addCase(register.rejected, (s, a) => { s.loading = false; s.error = a.payload; toast.error(a.payload); });
  },
});

export const { logout, setProfile } = authSlice.actions;
export default authSlice.reducer;
