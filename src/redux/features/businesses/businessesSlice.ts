import {PayloadAction, createSlice} from '@reduxjs/toolkit';

export interface IUserObject {
  name?: string;
  email?: string;
  topics?: [];
}

interface SettingsState {
  favouriteBusiness: string[]; // Updated type for better clarity
  searchHistory: [];
}

const initialState: SettingsState = {
  favouriteBusiness: [],
  searchHistory: [],
};

export interface Business {
  _id: string;
  name: string;
  category: {name: string};
  rating: string;
  searchedText?: string;
  matched?: boolean;
}

export const businessesSlice = createSlice({
  name: 'businesses',
  initialState,
  reducers: {
    toggleFavouriteBusiness: (state, action: PayloadAction<Business>) => {
      const business = action.payload;
      const index = state.favouriteBusiness.findIndex(
        fav => fav._id === business._id,
      );

      if (index !== -1) {
        // Remove the business if it already exists
        state.favouriteBusiness.splice(index, 1);
      } else {
        // Add the business if it does not exist
        state.favouriteBusiness.push(business);
      }
    },
    searchedBusiness: (
      state,
      action: PayloadAction<Business | {name: string}>,
    ) => {
      const business = action.payload;
      console.log('Business', business);
      // Extract the name of the business
      const searchName = business.name;

      // Ensure `searchHistory` is defined
      if (!Array.isArray(state.searchHistory)) {
        state.searchHistory = [];
      }

      // Remove any existing item with the same name
      state.searchHistory = state.searchHistory.filter(
        item => item.name !== searchName,
      );

      // Add the new business to the top of the history
      state.searchHistory.unshift(business);

      // Limit the history to 15 items
      if (state.searchHistory.length > 15) {
        state.searchHistory = state.searchHistory.slice(0, 15);
      }
    },
  },
});

export const {toggleFavouriteBusiness, searchedBusiness} =
  businessesSlice.actions;

export default businessesSlice.reducer;
