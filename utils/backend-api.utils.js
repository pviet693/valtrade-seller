import axios from 'axios';
import Cookie from 'js-cookie';
import url from './url-api.utils';
import * as common from './common.utils';

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
    },
    auction: {
        getList: (tokenServer) => {
            const newConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    Authorization: `Bearer ${token ? token : tokenServer}`,
                },
            }
            return axios.get(url.auction.getList(), newConfig);
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
                return axios.post(url.auction.postCreate(), body, newConfig);
            }
        },
        delete: (id) => {
            if (isEnable()) {
                return axios.delete(url.auction.delete().replace(':id', id), config);
            }
        },
        getDetail: (id, tokenSeller) => {
            if (isEnable(tokenSeller)) {
                return axios.get(url.auction.getDetail().replace(':id', id), config);
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
                return axios.put(url.auction.putUpdate().replace(':id', id), body, newConfig);
            }
        }
    },
    brand: {
        getList: (tokenSeller) => {
            if (isEnable(tokenSeller)) {
                return axios.get(url.brand.getList(), config);
            }
        }
    },
    deliverySetting: {
        postSetting: (body) => {
            if (isEnable()) {
                return axios.post(url.deliverySetting.postSetting(), body, config);
            }
        },
        getListShip: (tokenSeller) => {
            if (isEnable(tokenSeller)) {
                return axios.get(url.deliverySetting.getListShip(), config);
            }
        }
    },
    ghn: {
        getProvince: () => {
            const newConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'Token': `${common.tokenGHN}`,
                },
            }
            return axios.get(url.ghn.getProvince(), newConfig);
        },
        getDistrict: (provinceId) => {
            const newConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'token': `${common.tokenGHN}`,
                },
                params: {
                    province_id: provinceId
                }
            }
            return axios.get(url.ghn.getDistrict(), newConfig);
        },
        getWard: (districtId) => {
            const newConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'token': `${common.tokenGHN}`
                },
                params: {
                    district_id: districtId
                }
            }
            return axios.get(url.ghn.getWard(), newConfig);
        },
    }
};

export default api;