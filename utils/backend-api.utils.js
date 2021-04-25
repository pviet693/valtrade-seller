import axios from 'axios';
import Cookie from 'js-cookie';
import url from './url-api.utils';

let token = Cookie.get('seller_token');

let config = {
    headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    },
};

const isEnable = (tokenSeller = '') => {
    token = tokenSeller || Cookie.get('seller_token');
    if (!token) {
        return false;
    } else {
        config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        }
        return true;
    }
}

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
        getList: (tokenServer) => {
            const newConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    Authorization: `Bearer ${token ? token : tokenServer}`,
                },
            }
            return axios.get(url.product.getList(), newConfig);
        },
        postCreate: (body) => {
            if (isEnable()) {
                const newConfig = {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Access-Control-Allow-Origin': '*',
                        Authorization: `Bearer ${token}`,
                    },
                }
                return axios.post(url.product.postCreate(), body, newConfig);
            }
        },
        delete: (id) => {
            if (isEnable()) {
                return axios.delete(url.product.delete().replace(':id', id), config);
            }
        },
        getDetail: (id, tokenSeller) => {
            if (isEnable(tokenSeller)) {
                return axios.get(url.product.getDetail().replace(':id', id), config);
            }
        },
        putUpdate: (body, id) => {
            if (isEnable()) {
                const newConfig = {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Access-Control-Allow-Origin': '*',
                        Authorization: `Bearer ${token}`,
                    },
                }
                return axios.put(url.product.putUpdate().replace(':id', id), body, newConfig);
            }
        }
    } 
};

export default api;