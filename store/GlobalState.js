import React, { createContext, useReducer, useEffect, useState } from 'react';
import reducers from './Reducers';
import Cookie from 'js-cookie';
import axios from 'axios';
import { useRouter } from 'next/router';
import * as common from "../utils/common.utils";
import api from "../utils/backend-api.utils";
import { io } from "socket.io-client";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const router = useRouter();
    
    const initialState = {
        notify: {}, auth: {}, modal: [], orders: [], users: [], categories: [], loading: {}
    }

    const [state, dispatch] = useReducer(reducers, initialState);

    useEffect(async () => {
        const socket = io.connect("https://valtrade-api.tech", {
            transports: ["websocket", "polling"]
        });
        setSocket(socket);

        if (Cookie.get("seller_token")) {
            try {
                const profileRes = await api.seller.getProfile();
                let user = {};
                if (profileRes.data.code === 200) {
                    user = profileRes.data.result;
                }

                dispatch({ type: "AUTH", payload: { user } });
            } catch (error) {
                common.Toast(error.response ? error.response.data.message : error.message, "error");
            }
        }
    }, [])

    return (
        <DataContext.Provider value={{ state, dispatch, socket }}>
            {children}
        </DataContext.Provider>
    )
}