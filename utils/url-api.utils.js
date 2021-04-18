const baseUrl = "http://3.142.74.42:5000";

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
    },
    product: {
        postCreate: () => `${baseUrl}/api/product/create`,
        getList: () => `${baseUrl}/api/product/getBySeller`,
    }
}

export default url;