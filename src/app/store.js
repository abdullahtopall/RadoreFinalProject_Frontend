import {configureStore} from "@reduxjs/toolkit";
import productsReducer from "./slices/product";
import settingsReducer from "./slices/settings";
import userReducer from "./slices/user";

export const store = configureStore ( {
    reducer :
     {
        products : productsReducer,
        user : userReducer,
        settings : settingsReducer

     }
});
export default store;