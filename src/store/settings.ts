import { EventEmitter } from "events";
import { createSlice, createAsyncThunk, } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { GetThunkAPI } from "@reduxjs/toolkit/dist/createAsyncThunk";
import store, { AsyncThunkConfig } from "./index";
import { useDispatch } from "react-redux";

const { log, error, warn } = console

interface InitialState {
    [name: string]: any,
}


export const importSetting = createAsyncThunk(
    "importSetting",
    async (_settings: any, thunkAPI) => {
        if (_settings && typeof _settings === 'object') {
            let Settings = await thunkAPI.getState;
            let after = { ...Settings, ..._settings }
            localStorage.setItem("settings", JSON.stringify(after))
            return { before: Settings, after }
        }
    }
)

/**
 * "changed" | "loaded" | 
 */
export var settingsEvent = new EventEmitter();

/**
 * loadSettingss: Tự động lấy settings từ localStorage, nếu không có thì lấy từ settings.json, nếu không có thì báo lỗi
 */
// Tự động lấy settings từ localStorage, nếu không có thì lấy từ settings.json, nếu không có thì báo lỗi
async function _loadSettings() {
    let settings = localStorage.getItem("settings")
    if (!settings) {
        let r: { [name: string | number]: any } = await axios.get("/settings.json")
        return JSON.parse(r.data)
    }
    if (settings)
        return JSON.parse(settings)
    else throw new Error("SETTING_NOT_FOUND")
}
export const loadSettings = createAsyncThunk(
    "loadSettingss",
    () => _loadSettings()
)

/**
 * change sẽ lưu cài đặt vào localStorage
 */
export const change = createAsyncThunk(
    "change",
    async (args: any, thunkAPI): Promise<any> => {
        let { key, value } = args
        let { settings } = await thunkAPI.getState() as any
        let _settings = JSON.parse(JSON.stringify(settings));

        let keys = key.split('.');
        let lastkey = keys[keys.length - 1].trim();
        let obj = keys.slice(0, keys.length - 1).reduce((acc: any, key: string | number) => acc[key], _settings)
        console.warn(obj, lastkey)
        obj[lastkey] = value;

        localStorage.setItem("settings", JSON.stringify(_settings))
        return { key, value, before: settings, after: _settings };
    }
)

const initialState: InitialState = {
    lang: "en",
    telegram: {
        chat1: "-chat1",
        chat2: "-chat2",
    }
};

const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        reset: (state) => {
            state = initialState;
        },
    },


    extraReducers: (builder) => {
        builder.addCase(loadSettings.fulfilled, (state: any, action: any) => {
            for (const key in action.payload) {
                state[key] = action.payload[key];
            }

            setTimeout(() => {
                settingsEvent.emit("loaded", action.payload)
            }, 100);
        })
        builder.addCase(loadSettings.rejected, (state, action) => {
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

        builder.addCase(change.fulfilled, (state: any, action: any) => {
            log(action.payload)

            for (const key in action.payload.after) {
                state[key] = action.payload.after[key];
            }

            setTimeout(() => {
                settingsEvent.emit("changed", action.payload)
            }, 100);
        })
    },
})
export const { reset, } = settingsSlice.actions;
export default settingsSlice.reducer;