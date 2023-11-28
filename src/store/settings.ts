import { EventEmitter } from "events";
import { createSlice, createAsyncThunk, } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const { log, error, warn } = console

interface InitialState {
    [name: string]: any,
}


/**
 * "changed" | "loaded" | "saved" | "NameTokenChaged"
 */
export var settingsEvent = new EventEmitter();

/**
 * loadSettings: Tự động lấy settings từ localStorage, nếu không có thì lấy từ settings.json, nếu không có thì báo lỗi
 */
export const loadSetting = createAsyncThunk(
    "loadSettings",
    async (args, thunkAPI) => {
        // Tự động lấy settings từ localStorage, nếu không có thì lấy từ settings.json, nếu không có thì báo lỗi
        let settings = localStorage.getItem("setting")
        if (!settings) {
            let r = await axios.get("/settings.json")
            return r.data
        }
        if (settings)
            return JSON.parse(settings)
        else throw new Error("SETTING_NOT_FOUND")
    }
)

/**
 * saveSettings sẽ lưu cài đặt vào localStorage
 */
export const saveSettings = createAsyncThunk(
    "saveSettings",
    async (args: any, thunkAPI): Promise<any> => {
        let { key, value } = args
        log(args)
        let { settings } = await thunkAPI.getState() as any
        let _setting = JSON.parse(JSON.stringify(settings));

        console.warn(key, value)

        let keys = key.split('.');
        let lastkey = keys[keys.length - 1].trim();
        let obj = keys.slice(0, keys.length - 1).reduce((acc: any, key: string | number) => acc[key], _setting)

        console.warn(obj, lastkey)
        obj[lastkey] = value;

        localStorage.setItem("settings", JSON.stringify(_setting))
        settingsEvent.emit("saveSettings", ({ key, value }))
        return _setting;
    }
)


const initialState: InitialState = {
    lang: "vi",
};

const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        change: (state, action) => {
            state.key = action.payload.key;
        },
        reset: (state) => {
            state = initialState;
        }
    },

    
    extraReducers: (builder) => {
        builder.addCase(loadSetting.fulfilled, (state: any, action: any) => {
            for (const key in action.payload.after) {
                if (Object.hasOwnProperty.call(action.payload.after, key))
                    state[key] = action.payload.after[key];
            }

            setTimeout(() => {
                settingsEvent.emit("loaded", action.payload)
            }, 100);
        })
        builder.addCase(loadSetting.rejected, (state, action) => {
            settingsEvent.emit("loadFailed", action.payload)
        })

        builder.addCase(importSetting.fulfilled, (state: any, action: any) => {
            for (const key in action.payload.after) {
                if (Object.hasOwnProperty.call(action.payload.after, key))
                    state[key] = action.payload.after[key];
            }

            setTimeout(() => {
                settingsEvent.emit("imported", action.payload)
                settingsEvent.emit("loaded", action.payload)
            }, 100);
        })

        builder.addCase(saveSetting.fulfilled, (state: any, action: any) => {
            for (const key in action.payload.after) {
                if (Object.hasOwnProperty.call(action.payload.after, key))
                    state[key] = action.payload.after[key];
            }

            setTimeout(() => {
                settingsEvent.emit("saved", action.payload)
            }, 100);
        })
    },
})
export const settings = settingsSlice.actions;
export default settingsSlice.reducer;