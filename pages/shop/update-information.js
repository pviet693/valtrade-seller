import Head from 'next/head';
import LoadingBar from "react-top-loading-bar";
import { useEffect, useRef, useState } from 'react';
import { Button } from '@material-ui/core';
import api from './../../utils/backend-api.utils';
import * as common from './../../utils/common.utils';
import cookie from "cookie";
import * as validate from './../../utils/validate.utils';
import classNames from 'classnames';
import { useFormik } from 'formik';

const UpdateInformationShop = ({ shopInfo }) => {
    const refLoadingBar = useRef(null);
    const [loading, setLoading] = useState(false);

    const formikInfo = useFormik({
        initialValues: {
            nameShop: shopInfo.nameShop,
            phone: shopInfo.phone,
            address: shopInfo.address
        },
        validate: (data) => {
            let regexPhoneNumber = /(84|0[3|5|7|8|9])([0-9]{8})\b/g;
            let errors = {};

            if (!data.nameShop) errors.nameShop = "Tên shop không được trống.";
            if (!data.phone) errors.phone = "Số điện thoại không được trống.";
            if (!regexPhoneNumber.test(data.phone)) errors.phone = "Số điện thoại không hợp lệ.";
            if (!data.address) errors.address = "Địa chỉ không được trống.";


            return errors;
        },
        onSubmit: (data) => {
            if (formikInfo.dirty || formikInfo.touched) updateInfo(data);
        }
    });

    const updateInfo = async (data) => {
        refLoadingBar.current.continuousStart();
        setLoading(true);
        try {
            const res = await api.shop.changeInfoStore(data);
            refLoadingBar.current.complete();
            setLoading(false);

            if (res.data.code === 200) {
                common.Toast("Cập nhật thành công.", "success");
            } else {
                common.Toast(res.data.message || "Cập nhật thất bại.", "error");
            }
        } catch (error) {
            refLoadingBar.current.complete();
            setLoading(false);
            common.Toast(error.message || error, "error");
        }
    }

    return (
        <div className="shop">
            <Head>
                <title>Cập nhật thông tin shop</title>
            </Head>
            <LoadingBar color="#00ac96" ref={refLoadingBar} onLoaderFinished={() => { }} />
            <div className="shop-container">
                <div className="title">
                    Cập nhật thông tin shop
                </div>
                <hr />
                <form onSubmit={formikInfo.handleSubmit}>
                    <div className="shop-content">
                        <div className="form-group row align-items-center d-flex">
                            <label htmlFor="shop-name" className="col-md-3 col-form-label">Tên shop:</label>
                            <div className="col-md-9">
                                <input type="text"
                                    name="nameShop"
                                    className={classNames("form-control",
                                        { "is-invalid": formikInfo.touched.nameShop && formikInfo.errors.nameShop }
                                    )}
                                    placeholder="Nhập tên shop"
                                    name="nameShop"
                                    onChange={formikInfo.handleChange}
                                    value={formikInfo.values.nameShop} />
                                {
                                    formikInfo.touched.nameShop && formikInfo.errors.nameShop &&
                                    <small className="invalid-feedback">{formikInfo.errors.nameShop}</small>
                                }
                            </div>
                        </div>
                        <div className="form-group row align-items-center d-flex">
                            <label htmlFor="phone" className="col-md-3 col-form-label">Số điện thoại</label>
                            <div className="col-md-9">
                                <input type="text"
                                    name="phone"
                                    className={classNames("form-control",
                                        { "is-invalid": formikInfo.touched.phone && formikInfo.errors.phone }
                                    )}
                                    placeholder="Nhập số điện thoại"
                                    name="phone"
                                    onChange={formikInfo.handleChange}
                                    value={formikInfo.values.phone} />
                                {
                                    formikInfo.touched.phone && formikInfo.errors.phone &&
                                    <small className="invalid-feedback">{formikInfo.errors.phone}</small>
                                }
                            </div>
                        </div>
                        <div className="form-group row align-items-center d-flex">
                            <label htmlFor="address" className="col-md-3 col-form-label">Địa chỉ:</label>
                            <div className="col-md-9">
                                <input type="text"
                                    name="phone"
                                    className={classNames("form-control",
                                        { "is-invalid": formikInfo.touched.address && formikInfo.errors.address }
                                    )}
                                    placeholder="Nhập địa chỉ"
                                    name="address"
                                    onChange={formikInfo.handleChange}
                                    value={formikInfo.values.address} />
                                {
                                    formikInfo.touched.address && formikInfo.errors.address &&
                                    <small className="invalid-feedback">{formikInfo.errors.address}</small>
                                }
                            </div>
                        </div>

                        <div className="setting-row-button">
                            {
                                loading ? (
                                    <button type="button" className="btn btn-save" disabled="disabled"><i className="fa fa-spinner fa-spin mr-2" aria-hidden></i>Xử lí...</button>
                                ) : (
                                    <button className="btn btn-save" type="submit">Lưu lại</button>
                                )
                            }
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export async function getServerSideProps(ctx) {
    const cookies = ctx.req.headers.cookie;
    let shopInfo = {};
    if (cookies) {
        const token = cookie.parse(cookies).seller_token;
        if (token) {
            try {
                const res = await api.shop.getInfoStore(token);
                
                if (res.data.code === 200) {
                    const result = res.data.result;
                    shopInfo.id = result._id || "";
                    shopInfo.nameShop = result.nameShop || "";
                    shopInfo.phone = result.phone || "";
                    shopInfo.address = result.address || "";
                }
            } catch (err) {
                console.log(err.message);
            }

            return {
                props: {
                    shopInfo
                }
            }
        }
        else {
            return {
                redirect: {
                    destination: '/signin',
                    permanent: false,
                },
            }
        }
    } else {
        return {
            redirect: {
                destination: '/signin',
                permanent: false,
            },
        }
    }
}

export default UpdateInformationShop
