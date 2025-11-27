import {PayloadAction, createSlice} from '@reduxjs/toolkit';

export interface IUserObject {
  name?: string;
  email?: string;
  topics?: [];
}
interface SettingsState {
  isDarkMode: boolean;
  authlesslogin: boolean;
  isLoggedIn: boolean;
  user: {};
  token: string;
}

const initialState: SettingsState = {
  isDarkMode: false,
  authlesslogin: false,
  isLoggedIn: false,
  user: {},
  token: '',
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleTheme: state => {
      state.isDarkMode = !state.isDarkMode;
    },
    setAuthlessLogin: (state, action: PayloadAction<boolean>) => {
      state.authlesslogin = action.payload;
    },
    setIsLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
    setUser: (state, action: PayloadAction<{}>) => {
      state.user = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    signOut: () => {
      return initialState;
    },
  },
});

export const {
  toggleTheme,
  setAuthlessLogin,
  setIsLoggedIn,
  setUser,
  setToken,
  signOut,
} = settingsSlice.actions;
