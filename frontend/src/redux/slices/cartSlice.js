import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import i18n from '../../i18n';

const cartItems = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : [];

const cartSlice = createSlice({
  name: 'cart',
  initialState: { cartItems, coupon: null },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const exist = state.cartItems.find((x) => x._id === item._id);
      if (exist) {
        if (exist.qty < item.countInStock) {
          exist.qty += 1;
          toast.success(i18n.t('cart.qtyUpdated'));
        } else {
          toast.error(i18n.t('cart.maxStock'));
        }
      } else {
        state.cartItems.push({ ...item, qty: 1 });
        toast.success(i18n.t('cart.added'));
      }
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      toast.success(i18n.t('cart.removed'));
    },
    updateCartQty: (state, action) => {
      const { id, qty } = action.payload;
      const item = state.cartItems.find((x) => x._id === id);
      if (item) {
        item.qty = qty;
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      }
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.coupon = null;
      localStorage.removeItem('cartItems');
    },
    setCoupon: (state, action) => {
      state.coupon = action.payload;
    },
  },
});

export const { addToCart, removeFromCart, updateCartQty, clearCart, setCoupon } = cartSlice.actions;
export default cartSlice.reducer;
