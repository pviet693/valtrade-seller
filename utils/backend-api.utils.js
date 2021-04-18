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
    category: {
        getList: () => {
            return axios.get(url.category.getList(), config);
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
        },
        getQrCode: (id) => {
            return axios.get(url.seller.getQrCode().replace(":id", id));
        },
        postVerify: (body) => {
            return axios.post(url.seller.postVerify(), body);
        },
        postSignin: (body) => {
            return axios.post(url.seller.postSignin(), body);
        },
        postValidate: (body) => {
            return axios.post(url.seller.postValidate(), body);
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