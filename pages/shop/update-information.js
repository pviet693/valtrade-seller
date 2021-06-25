import Head from 'next/head';
import { Dropdown } from 'primereact/dropdown';
import LoadingBar from "react-top-loading-bar";
import { useEffect, useRef, useState } from 'react';
import Switch from "react-input-switch";
import { Button } from '@material-ui/core';
import api from './../../utils/backend-api.utils';
import * as common from './../../utils/common.utils';
import cookie from "cookie";
import * as validate from './../../utils/validate.utils';
import classNames from 'classnames';

const UpdateInformationShop = () => {
    const refLoadingBar = useRef(null);
    const [showError, setShowError] = useState(false);

    const [authentication, setAuthentication] = useState("");
    const [shopInfor, setShopInfor] = useState("");

    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setRegister({ ...shopInfor, [name]: value });
    }

    const save = () => {
        
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
                <div className="shop-content">
                    <div className="form-group row align-items-center d-flex">
                        <label htmlFor="shop-name" className="col-md-3 col-form-label">Tên shop:</label>
                        <div className="col-md-9">
                            <input type="text" 
                                className={classNames("form-control", { "is-invalid": (validate.checkEmptyInput("abd")) && showError })}
                                id="shop-name" placeholder="Tên shop" 
                                name="shop-name" onChange={onChangeInput} value="" />
                        </div>
                    </div>
                    <div className="form-group row align-items-center d-flex">
                        <label htmlFor="phone" className="col-md-3 col-form-label">Số điện thoại</label>
                        <div className="col-md-9">
                            <input type="phone" 
                                className={classNames("form-control", { "is-invalid": (validate.checkEmptyInput("abc") || !validate.validatePhone("1234")) && showError })}
                                id="phone" placeholder="Số điện thoại" 
                                name="phone" onChange={onChangeInput} value="" />
                        </div>
                    </div>
                    <div className="form-group row align-items-center d-flex">
                        <label htmlFor="address" className="col-md-3 col-form-label">Địa chỉ:</label>
                        <div className="col-md-9">
                            <input type="text" 
                                className={classNames("form-control", { "is-invalid": (validate.checkEmptyInput("avd") ) && showError })}
                                id="address" placeholder="Địa chỉ" 
                                name="address" onChange={onChangeInput} value="" />
                        </div>
                    </div>
                    <div className="form-group row align-items-center d-flex">
                        <label htmlFor="settingAuthorize" className="col-md-3 col-form-label">Xác thực 2 yếu tố</label>
                        <div className="col-md-9">
                            <Switch
                                id="settingAuthorize"
                                onChange={setAuthentication}
                                value={authentication}
                                styles={{
                                    track: {
                                        backgroundColor: 'gray'
                                    },
                                    trackChecked: {
                                        backgroundColor: '#00a23b'
                                    },
                                    button: {
                                        backgroundColor: '#fff'
                                    },
                                    buttonChecked: {
                                        backgroundColor: '#fff'
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div className="setting-row-button">
                        <button className="btn btn-save" onClick={save}>Lưu lại</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

// export async function getServerSideProps(ctx) {
    
// }

export default UpdateInformationShop
