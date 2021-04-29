const baseUrl = "http://3.142.207.62:5000";

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
        delete: () => `${baseUrl}/api/product/delete/:id`,
        getDetail: () => `${baseUrl}/api/product/detail/:id`,
        putUpdate: () => `${baseUrl}/api/product/update/:id`,
    },
    brand: {
        getList: () => `${baseUrl}/api/brand/get`,
    }
}

export default url;