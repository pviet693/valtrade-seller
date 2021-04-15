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
        // if (Cookie.get("admin_token")) {
            // dispatch({ type: 'LOADING', payload: { loading: true } });
            // const token = Cookie.get("admin_token");
            // axios.get("https://valtrade-api.herokuapp.com/api/buyer/profile", {
            //     headers: {
            //         'Authorization': `Bearer ${token}`
            //     }
            // }).then(res => {
            //     let user = {};
            //     if (res.status === 200) {
            //         user = res.data.information;
            //     }
            //     dispatch({
            //         type: 'AUTH', payload: {
            //             token: token,
            //             user: user
            //         }
            //     });
            //     dispatch({ type: 'LOADING', payload: {} });
            // })
        // } else {
            // router.push('signin');
        // }
    }, [])

    return (
        <DataContext.Provider value={{ state, dispatch }}>
            {children}
        </DataContext.Provider>
    )
}