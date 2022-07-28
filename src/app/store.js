import {configureStore} from "@reduxjs/toolkit";
import livesSlice from "../features/lives/livesSlice";

export const store = configureStore({
    reducer: {
        lives: livesSlice
    },
})