const baseUrl = "http://3.142.74.42:5000";

const url = {
    auth: {
        postSignin: () => `${baseUrl}/api/admin/login`,
        postValidate: () => `${baseUrl}/api/admin/validate`,
        postCreate: () => `${baseUrl}/api/admin/create`,
        postVerify: () => `${baseUrl}/api/admin/verify`,
    },
    category: {
        getList: () => `${baseUrl}/api/category/list`,
        getAttribute: () => `${baseUrl}/api/attribute/getAttribute/:id`,
        getDetail: () => `${baseUrl}/api/category/detail/:id`,
    },
    seller: {
        postRegister: () => `${baseUrl}/api/seller/register`,
    },
    product: {
        postCreate: () => `${baseUrl}/api/product/create`,
        getList: () => `${baseUrl}/api/product/get`,
        getList: () => `${baseUrl}/api/product/get`,
    }
}

export default url;