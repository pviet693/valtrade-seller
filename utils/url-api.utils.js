export const baseUrl = "https://valtrade-api.tech";

const url = {
    category: {
        getList: () => `${baseUrl}/api/category/list`,
        getDetail: () => `${baseUrl}/api/category/detail/:id`,
    },
    seller: {
        postRegister: () => `${baseUrl}/api/seller/register`,
        getQrCode: () => `${baseUrl}/api/seller/qrcode?id=:id`,
        postVerify: () => `${baseUrl}/api/seller/verify`,
        postSignin: () => `${baseUrl}/api/seller/login`,
        postValidate: () => `${baseUrl}/api/seller/validate`,
        getProfile: () => `${baseUrl}/api/seller/profile`,
        updateProfile: () => `${baseUrl}/api/seller/updateProfile`,
        updatePassword: () => `${baseUrl}/api/seller/changePassword`,
        updateStatus2FA: () => `${baseUrl}/api/seller/secure`,
    },
    product: {
        postCreate: () => `${baseUrl}/api/product/create`,
        getList: () => `${baseUrl}/api/product/getBySeller`,
        delete: () => `${baseUrl}/api/product/delete/:id`,
        getDetail: () => `${baseUrl}/api/product/detail/:id`,
        putUpdate: () => `${baseUrl}/api/product/update/:id`,
        // getListReport: () => `${baseUrl}/api/report/`
    },
    auction: {
        postCreate: () => `${baseUrl}/api/bid/createBid`,
        getList: () => `${baseUrl}/api/bid/getBySeller`,
        delete: () => `${baseUrl}/api/bid/delete/:id`,
        getDetail: () => `${baseUrl}/api/bid/detail/:id`,
        putUpdate: () => `${baseUrl}/api/bid/update/:id`,
    },
    brand: {
        getList: () => `${baseUrl}/api/brand/get`,
    },
    deliverySetting: {
        postSetting: () => `${baseUrl}/api/store/changeSettingStore`,
        getListShip: () => `${baseUrl}/api/store/getListShip`
    },
    ghn: {
        getProvince: () => "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province",
        getWard: () => "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward",
        getDistrict: () => "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district"
    },
    shop: {
        changeInfoStore: () => `${baseUrl}/api/store/changeInforStore`,
        getInfoStore: () => `${baseUrl}/api/store/detailShop`
    },
    transfer: {
        postTransfer: () => `${baseUrl}/api/transfer/createTransfer`,
        getListTransfer: () => `${baseUrl}/api/transfer/getListTransfer`
    },
    order: {
        getListOrder: () => `${baseUrl}/api/order/getBySeller`,
        getOrderDetail: () => `${baseUrl}/api/order/detail/:orderId`,
        approveOrder: (id) => `${baseUrl}/api/order/approOrder`,
    }
}

export default url;