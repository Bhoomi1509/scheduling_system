import { configureStore } from '@reduxjs/toolkit';
import availabilityReducer from '../slices/availabilitySlice'
import localStorageMiddleware from './middleware/localStorageMiddleware';

export default configureStore({
  reducer: {
    availability: availabilityReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware)
});