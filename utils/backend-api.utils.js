import axios from 'axios';
import Cookie from 'js-cookie';
import url from './url-api.utils';

const token = Cookie.get('admin_token');

const config = {
    headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    },
};

const api = {
    auth: {
        signin: (bodySignin) => {
            return axios.post(url.auth.postSignin(), bodySignin);
        },
        validate: (bodyValidate) => {
            return axios.post(url.auth.postValidate(), bodyValidate);
        },
        create: (bodyCreateNew) => {
            return axios.post(url.auth.postCreate(), bodyCreateNew);
        },
        verify: (bodyVerify) => {
            return axios.post(url.auth.postVerify(), bodyVerify);
        }
    },
    category: {
        getList: () => {
            return axios.get(url.category.getList(), config);
        },
        getAttribute: (id) => {
            return axios.get(url.category.getAttribute().replace(":id", id), config);
        },
        getDetail: (id) => {
            return axios.get(url.category.getDetail().replace(":id", id));
        }
    },
    seller: {
        postRegister: (body) => {
            const newConfig = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Access-Control-Allow-Origin': '*'
                },
            }
            return axios.post(url.seller.postRegister(), body, newConfig);
        }
    },
    product: {
        postCreate: (body) => {
            const newConfig = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Access-Control-Allow-Origin': '*'
                },
            }
            return axios.post(url.product.postCreate(), body, newConfig);
        },
        getList: () => {
            return axios.get(url.product.getList());
        }
    } 
};

export default api;