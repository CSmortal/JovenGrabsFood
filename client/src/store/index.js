import { configureStore, combineReducers } from '@reduxjs/toolkit'
import addFoodItemReducer from './addFoodItemSlice'
import merchantItemsReducer from './merchantItemsSlice'
import orderFoodItemReducer from './orderFoodItemSlice'
import cartReducer from './cartSlice'
import unacceptedOrderReducer from './unacceptedOrderSlice'
import acceptedOrderReducer from './acceptedOrderSlice'
import unassignedDeliveriesReducer from './unassignedDeliveriesSlice'
import assignedDeliveriesReducer from './assignedDeliveriesSlice'
import userDetailsReducer from './userDetailsSlice'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'root',
  storage
}

const reducer = combineReducers({
  userDetails: userDetailsReducer,
  addFoodItem: addFoodItemReducer,
  merchantItems: merchantItemsReducer,
  orderFoodItem: orderFoodItemReducer,
  cart: cartReducer,
  unacceptedOrder: unacceptedOrderReducer,
  acceptedOrder: acceptedOrderReducer,
  unassignedDeliveries: unassignedDeliveriesReducer,
  assignedDeliveries: assignedDeliveriesReducer,
})

const persistedReducer = persistReducer(persistConfig, reducer)

const store = configureStore({
  reducer: persistedReducer
})

export const Persistor = persistStore(store)

export default store