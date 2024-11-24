import { createSlice } from "@reduxjs/toolkit";
import { allChProducts } from "../../../data";

const initialTotal = parseFloat(localStorage.getItem("totalValue")) || 0;

let initialState = {
  currency: 1,
  quantity:0,
  total: initialTotal,
};

const priceSlice = createSlice({
  name: "price",
  initialState,
  reducers: {
    addPrice: (state, action) => {
      const { productId} = action.payload;
      const sum = state.total + Number.parseFloat(Math.floor((Number(allChProducts.All[productId - 1].price ) * state.currency))* (state.quantity +1));
      localStorage.setItem("totalValue", sum);
      return {
        ...state,
        total: sum
      };
    },
    subtractPrice: (state, action) => {
      const { productId} = action.payload;
      const sum = state.total - Number.parseFloat(Math.floor((Number(allChProducts.All[productId - 1].price )* state.currency))*  (state.quantity +1)) ;
      localStorage.setItem("totalValue", sum);
      return {
        ...state,
        total: sum,
      };
    },
    clearTotal: (state) => {
      localStorage.setItem("totalValue", 0);
      return {
        ...state,
        total: 0,
      };
    },
    setCurrency: (state, action) => {
      return {
        ...state,
        currency: action.payload,
        total: state.total * action.payload,
      };
    },
  },
});

export default priceSlice.reducer;
export const { addPrice, subtractPrice, clearTotal, setCurrency } = priceSlice.actions;