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
        getQrCode: (id, tokenSeller = '') => {
            if (isEnable(tokenSeller)) {
                return axios.get(url.seller.getQrCode().replace(":id", id));
            }
        },
        postVerify: (body) => {
            return axios.post(url.seller.postVerify(), body);
        },
        postSignin: (body) => {
            return axios.post(url.seller.postSignin(), body);
        },
        postValidate: (body) => {
            return axios.post(url.seller.postValidate(), body);
        },
        getProfile: (tokenServer = '') => {
            if (isEnable(tokenServer)) {
                return axios.get(url.seller.getProfile(), config);
            }
        },
        updateProfile: (body) => {
            return axios.put(url.seller.updateProfile(), body, config);
        },
        updatePassword: (body) => {
            return axios.put(url.seller.updatePassword(), body, config);
        },
        updateStatus2FA: (body) => {
            return axios.put(url.seller.updateStatus2FA(), body, config);
        }
    },
    product: {
        getList: (params, tokenServer = '') => {
            const newConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    Authorization: `Bearer ${token ? token : tokenServer}`,
                },
            }
            if (params) {
                let param = {};
                let queryDate = "";
                let queryPrice = "";
                param.limit = params.rows;
                param.page = params.page + 1;

                if (params.search) param.search = params.search.trim();
                if (params.status) param.status = params.status;
                if (params.category) param.categoryId = params.category;
                if (params.dateFrom && filters.dateTo) {
                    let start = new Date(filters.dateFrom);
                    let end = new Date(filters.dateTox);
                    start.setHours(0, 0, 0, 0);
                    start.setDate(start.getDate() + 1);
                    end.setHours(0, 0, 0, 0);
                    end.setDate(end.getDate() + 2);
                    queryDate = `&dateFilter=${start.toISOString()}&dateFilter=${end.toISOString()}`;
                }
                if (params.priceFrom && filters.priceTo) {
                    queryPrice = `&listKey=${params.priceFrom}&listKey=${filters.priceTo}`;
                }

                const query = new URLSearchParams(param);

                return axios.get(url.product.getList() + `?${query}${queryDate}${queryPrice}`, newConfig);
            } else {
                return axios.get(url.product.getList(), newConfig);
            }
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
        },
        getListReport: () => {
            return axios.get(url.product.getListReport(), config);
        },
        getDetailReport: (id) => {
            return axios.get(url.product.getDetailReport().replace(':id', id), config);
        }
    },
    auction: {
        getList: (params, tokenServer = '') => {
            const newConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    Authorization: `Bearer ${token ? token : tokenServer}`,
                },
            }
            
            if (params) {
                let param = {};
                let queryDate = "";
                let queryPrice = "";
                param.limit = params.rows;
                param.page = params.page + 1;

                if (params.search) param.search = params.search.trim();
                if (params.status) param.status = params.status;
                if (params.category) param.categoryId = params.category;
                if (params.dateFrom && filters.dateTo) {
                    let start = new Date(filters.dateFrom);
                    let end = new Date(filters.dateTox);
                    start.setHours(0, 0, 0, 0);
                    start.setDate(start.getDate() + 1);
                    end.setHours(0, 0, 0, 0);
                    end.setDate(end.getDate() + 2);
                    queryDate = `&dateFilter=${start.toISOString()}&dateFilter=${end.toISOString()}`;
                }
                if (params.priceFrom && filters.priceTo) {
                    queryPrice = `&listKey=${params.priceFrom}&listKey=${filters.priceTo}`;
                }

                const query = new URLSearchParams(param);

                return axios.get(url.auction.getList() + `?${query}${queryDate}${queryPrice}`, newConfig);
            } else {
                return axios.get(url.auction.getList(), newConfig);
            }
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
    },
    shop: {
        changeInfoStore: (body) => {
            return axios.put(url.shop.changeInfoStore(), body, config);
        },
        getInfoStore: (tokenSeller = '') => {
            if (isEnable(tokenSeller)) {
                return axios.get(url.shop.getInfoStore(), config);
            }
        }
    },
    transfer: {
        postTransfer: (body) => {
            return axios.post(url.transfer.postTransfer(), body, config);
        },
        getListTransfer: () => {
            return axios.get(url.transfer.getListTransfer(), config);
        } 
    },
    order: {
        getListOrder: () => {
            const newConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    Authorization: `Bearer ${token}`,
                },
            }
            return axios.get(url.order.getListOrder(), newConfig);
        },
        getOrderDetail: (id) => {
            return axios.get(url.order.getOrderDetail().replace(':orderId', id), config);
        },
        appoveOrder: (id) => {
            return axios.put(url.order.approveOrder(), {id:id}, config);
        }
    },
    chat: {
        postMessage: (body) => {
            return axios.post(url.chat.sendMessage(), body, config);
        },
        getListMessage: (userId) => {
            return axios.get(url.chat.getListMessage() + `?userId=${userId}`, config);
        },
        updateMessage: () => {
            return axios.get(url.chat.updateMessage(), config);
        },
        getListConversation: () => {
            return axios.get(url.chat.getListConversation(), config);
        }
    }
};

export default api;