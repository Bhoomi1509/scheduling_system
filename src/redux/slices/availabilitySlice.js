import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  slots: [],
};

const availabilitySlice = createSlice({
  name: 'availability',
  initialState,
  reducers: {
    addSlot: (state, action) => {
      state.slots.push(action.payload);
    },
    removeSlot: (state, action) => {
      state.slots = state.slots.filter(slot => slot.id !== action.payload);
    },
    loadSlots: (state, action) => {
      state.slots = action.payload;
    }
  }
});

export const { addSlot, removeSlot, loadSlots } = availabilitySlice.actions;
export default availabilitySlice.reducer;