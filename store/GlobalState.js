import { createContext, useReducer, useEffect } from 'react';
import reducers from './Reducers';
import Cookie from 'js-cookie';
import axios from 'axios';
import { useRouter } from 'next/router';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {

    const router = useRouter();
    
    const initialState = {
        notify: {}, auth: {}, modal: [], orders: [], users: [], categories: [], loading: {}
    }

    const [state, dispatch] = useReducer(reducers, initialState);

    useEffect(() => {
    }, [])

    return (
        <DataContext.Provider value={{ state, dispatch }}>
            {children}
        </DataContext.Provider>
    )
}