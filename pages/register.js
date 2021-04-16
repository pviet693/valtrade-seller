import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Calendar } from 'primereact/calendar';
import LoadingBar from "react-top-loading-bar";
import { useRef } from 'react';
import api from '../utils/backend-api.utils';
import * as common from './../utils/common.utils';
import * as validate from './../utils/validate.utils';
import classNames from 'classnames';
import { RegisterModel } from './../models/register.model';
import Cookie from 'js-cookie';
import * as cryptojs from 'crypto-js';

const Register = () => {
    const router = useRouter();
    const [register, setRegister] = useState(new RegisterModel());
    const identifiedFront = useRef(null);
    const identifiedRear = useRef(null);
    const refLoadingBar = useRef(null);
    const [isLoading, setLoading] = useState(false);
    const [showError, setShowError] = useState(false);
    const [link, setLink] = useState("");
    const [images, setImages] = useState({ identifiedFront: null, identifiedRear: null });
    const [urlImages, setUrlImages] = useState({ identifiedFront: '', identifiedRear: '' });

    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setRegister({ ...register, [name]: value });
    }

    const addIdentifiedFront = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (!file) return;
        let tempImages = images;
        tempImages.identifiedFront = file;
        setImages(tempImages);
        
        let tempUrl = urlImages;
        tempUrl.identifiedFront = URL.createObjectURL(file);
        setUrlImages({ ...tempUrl });
        URL.revokeObjectURL(file);
    }

    const addIdentifiedRear = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (!file) return;
        let tempImages = images;
        tempImages.identifiedRear = file;
        setImages(tempImages);

        let tempUrl = urlImages;
        tempUrl.identifiedRear = URL.createObjectURL(file);
        setUrlImages({...tempUrl});
        URL.revokeObjectURL(file);
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        setShowError(true);

        if (validate.checkEmptyInput(register.name)
            || validate.checkEmptyInput(register.phone)
            || validate.checkEmptyInput(register.nameShop)
            || validate.checkEmptyInput(register.password)
            || validate.checkEmptyInput(register.birthday)
            || validate.checkEmptyInput(register.address)
            || validate.checkEmptyInput(register.email)
            || validate.checkEmptyInput(urlImages.identifiedFront)
            || validate.checkEmptyInput(urlImages.identifiedRear)
            || !validate.validateEmail(register.email)
            || !validate.validatePassword(register.password)
            || !validate.validatePhone(register.phone)
        ) {
            return;
        }

        setLoading(true);
        refLoadingBar.current.continuousStart();
        try {
            let formData = new FormData();
            formData.append("image", images.identifiedFront);
            formData.append("image", images.identifiedRear);
            formData.append("nameOwner", register.name);
            formData.append("phone", register.phone);
            formData.append("birthday", register.birthday);
            formData.append("nameShop", register.nameShop);
            formData.append("password", register.password);
            formData.append("email", register.email);
            formData.append("address", register.address);
            formData.append("link", link);

            const res = await api.seller.postRegister(formData);
            console.log(res);
            setLoading(false);
            refLoadingBar.current.complete();
            if (res.status === 200) {
                if (res.data.code === 200) {
                    common.Toast("Đăng kí thành công.", 'success')
                        .then(() => {
                            Cookie.set('email_register', cryptojs.AES.encrypt(register.email, '1').toString(), {path: '/',expires: 30});
                            router.push(`/register-done`);
                        });
                } else {
                    common.Toast("Đăng kí thất bại.", 'error');
                }
            }
        } catch(error) {
            setLoading(false);
            refLoadingBar.current.complete();
            common.Toast(error, 'error');
        }
    }

    const renderPhotosFront = () => {
        return  (
            <>
                <img src={urlImages.identifiedFront} alt="Identified Front" />
                <i className="fa fa-trash" aria-hidden onClick={() => deleteIdentifiedFront()}></i>
            </>
        )
    };

    const renderPhotosRear = () => {
        return (
            <>
                <img src={urlImages.identifiedRear} alt="Identified Rear" />
                <i className="fa fa-trash" aria-hidden onClick={() => deleteIdentifiedRear()}></i>
            </>
        )
    };

    const deleteIdentifiedFront = () => {
        let tempImages = images;
        tempImages.identifiedFront = null;
        setImages({ ...tempImages });

        let tempUrl = urlImages;
        tempUrl.identifiedFront = "";
        setUrlImages({ ...tempUrl });
    }

    const deleteIdentifiedRear = () => {
        let tempImages = images;
        tempImages.identifiedRear = null;
        setImages({ ...tempImages });

        let tempUrl = urlImages;
        tempUrl.identifiedRear = "";
        setUrlImages({ ...tempUrl });
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setLink(`${window.location.protocol}//${window.location.host}`);
        }
    }, []);


    return (
        <>
            <Head>
                <title>Tạo tài khoản người bán</title>
            </Head>
            <LoadingBar color="#00ac96" ref={refLoadingBar} onLoaderFinished={() => { }} />
            <div className="register-container">
                <div className="register-content">
                    <div className="header text-center">
                        <div className="logo"><img src="/static/assets/img/VALTRADE.png" alt="Logo" /></div>
                        <h1 className="lead">TẠO TÀI KHOẢN</h1>
                    </div>
                    <form className="form-auth-small" onSubmit={handleRegister}>
                        <div className="form-group row align-items-center d-flex">
                            <label htmlFor="name" className="col-md-3 col-form-label">Tên người bán</label>
                            <div className="col-md-9">
                                <input type="text" 
                                    className={classNames("form-control", { "is-invalid": validate.checkEmptyInput(register.name) && showError })}
                                    id="name" placeholder="Tên người bán" 
                                    name="name" onChange={onChangeInput} 
                                    value={register.name} />
                                {
                                    validate.checkEmptyInput(register.name) && showError &&
                                    <div className="invalid-feedback">
                                        Tên không được trống.
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="form-group row align-items-center d-flex">
                            <label htmlFor="phone" className="col-md-3 col-form-label">Số điện thoại</label>
                            <div className="col-md-9">
                                <input type="phone" 
                                    className={classNames("form-control", { "is-invalid": (validate.checkEmptyInput(register.phone) || !validate.validatePhone(register.phone)) && showError })}
                                    id="phone" placeholder="Số điện thoại" 
                                    name="phone" onChange={onChangeInput} value={register.phone} />
                                {
                                    validate.checkEmptyInput(register.phone) && showError &&
                                    <div className="invalid-feedback">
                                        Số điện thoại không được trống.
                                    </div>
                                }
                                {
                                    !validate.validatePhone(register.phone) && showError &&
                                    <div className="invalid-feedback">
                                        Số điện thoại không hợp lệ.
                                    </div>
                                }
                            </div>
                        </div>

                        <div className="form-group row align-items-center d-flex">
                            <label htmlFor="nameShop" className="col-md-3 col-form-label">Tên shop</label>
                            <div className="col-md-9">
                                <input type="text" 
                                    className={classNames("form-control", { "is-invalid": validate.checkEmptyInput(register.nameShop) && showError })}
                                    id="nameShop" placeholder="Tên shop" 
                                    name="nameShop" onChange={onChangeInput} value={register.nameShop} />

                                {
                                    validate.checkEmptyInput(register.nameShop) && showError &&
                                    <div className="invalid-feedback">
                                        Tên shop không được trống.
                                    </div>
                                }
                            </div>
                        </div>


                        <div className="form-group row align-items-center d-flex">
                            <label htmlFor="password" className="col-md-3 col-form-label">Password</label>
                            <div className="col-md-9">
                                <input type="password" 
                                    className={classNames("form-control", { "is-invalid": (validate.checkEmptyInput(register.password) || !validate.validatePassword(register.password)) && showError })}
                                    id="password" placeholder="Mật khẩu" 
                                    name="password" onChange={onChangeInput} value={register.password} />
                                {
                                    validate.checkEmptyInput(register.password) && showError &&
                                    <div className="invalid-feedback">
                                        Mật khẩu không được trống.
                                    </div>
                                }
                                {
                                    !validate.validatePassword(register.password) && showError &&
                                    <div className="invalid-feedback">
                                        Mật khẩu không hợp lệ.
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="form-group row align-items-center d-flex">
                            <label htmlFor="email" className="col-md-3 col-form-label">Email</label>
                            <div className="col-md-9">
                                <input type="email" 
                                    className={classNames("form-control", { "is-invalid": (validate.checkEmptyInput(register.email) || !validate.validateEmail(register.email)) && showError })}
                                    id="email" placeholder="Email" 
                                    name="email" onChange={onChangeInput} value={register.email} />
                                {
                                    validate.checkEmptyInput(register.email) && showError &&
                                    <div className="invalid-feedback">
                                        Email không được trống.
                                    </div>
                                }
                                {
                                    !validate.validateEmail(register.email) && showError &&
                                    <div className="invalid-feedback">
                                        Email không hợp lệ.
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="form-group row align-items-center d-flex">
                            <label htmlFor="address" className="col-md-3 col-form-label">Địa chỉ</label>
                            <div className="col-md-9">
                                <input type="text" 
                                    className={classNames("form-control", { "is-invalid": validate.checkEmptyInput(register.address) && showError })}
                                    id="address" placeholder="Địa chỉ" 
                                    name="address" onChange={onChangeInput} value={register.address} />
                                {
                                    validate.checkEmptyInput(register.address) && showError &&
                                    <div className="invalid-feedback">
                                        Địa chỉ không được trống.
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="form-group row align-items-center d-flex">
                            <label htmlFor="birthday" className="col-md-3 col-form-label">Ngày sinh</label>
                            <div className="col-md-9">
                                <Calendar dateFormat="dd/mm/yy" 
                                    showIcon placeholder="dd/mm/yyyy" 
                                    readOnlyInput id="birthday" name="birthday"
                                    className={classNames({ "is-invalid": validate.checkEmptyInput(register.birthday) && showError })}
                                    onChange={onChangeInput} value={register.birthday} />
                                {
                                    validate.checkEmptyInput(register.birthday) && showError &&
                                    <div className="invalid-feedback">
                                        Ngày sinh không được trống.
                                    </div>
                                }
                            </div>
                        </div>

                        <div className="form-group row">
                            <label htmlFor="Identified" className="col-md-3 col-form-label">CMND</label>
                            <div className="col-md-9 d-flex flex-row flex-wrap justify-content-between">
                                <div className="d-flex flex-column add-image-container">
                                    <div className={classNames("add-image-box", { "invalid-image": validate.checkEmptyInput(urlImages.identifiedFront) && showError })}>
                                        {
                                            urlImages.identifiedFront === "" && 
                                            <>
                                                <div className={classNames("add-image-circle", { "invalid-image": validate.checkEmptyInput(urlImages.identifiedFront) && showError })}>
                                                    <input type="file" accept="image/*" ref={identifiedFront} onChange={addIdentifiedFront} />
                                                    <i className="fa fa-plus" aria-hidden onClick={() => identifiedFront.current.click()}></i>
                                                </div>
                                            </>
                                        }
                                        {
                                            urlImages.identifiedFront !== "" &&
                                            renderPhotosFront()
                                        }
                                    </div>
                                    {
                                        validate.checkEmptyInput(urlImages.identifiedFront) && showError &&
                                        <div className="invalid-feedback">
                                            CMND mặt trước không được trống.
                                        </div>
                                    }
                                    <div className="text-center mt-2">
                                        CMND mặt trước
                                    </div>
                                </div>
                                <div className="d-flex flex-column add-image-container">
                                    <div className={classNames("add-image-box", { "invalid-image": validate.checkEmptyInput(urlImages.identifiedRear) && showError })}>
                                        {
                                            urlImages.identifiedRear === "" &&
                                            <>
                                                <div className={classNames("add-image-circle", { "invalid-image": validate.checkEmptyInput(urlImages.identifiedRear) && showError })}>
                                                    <input type="file" accept="image/*" ref={identifiedRear} onChange={addIdentifiedRear} name="identifiedRear" />
                                                    <i className="fa fa-plus" aria-hidden onClick={() => identifiedRear.current.click()}></i>
                                                </div>
                                            </>
                                        }
                                        {
                                            urlImages.identifiedRear !== "" &&
                                            renderPhotosRear()
                                        }
                                    </div>
                                    {
                                        validate.checkEmptyInput(urlImages.identifiedRear) && showError &&
                                        <div className="invalid-feedback">
                                            CMND mặt sau không được trống.
                                        </div>
                                    }
                                    <div className="text-center mt-2">
                                        CMND mặt sau
                                    </div>
                                </div>
                            </div>
                        </div>

                        {
                            !isLoading && 
                            <button type="submit" className="btn btn-primary btn-lg btn-block mt-6">ĐĂNG KÍ</button>
                        }
                        {
                            isLoading &&
                            <button type="button" className="btn btn-primary btn-lg btn-block" disabled="disabled"><i className="fa fa-spinner fa-spin mr-2" aria-hidden></i>XỬ LÍ...</button>
                        }

                        <div className="policy-agreement d-flex justify-content-center mt-3">
                            <span>
                                Bằng cách ấn vào nút "ĐĂNG KÍ", tôi đồng ý với
                                <Link href="/">
                                    <a target="" rel="noopener noreferrer" className="ml-1 mr-1 text-primary">Điều Khoản Sử Dụng</a>
                                </Link>
                                và
                                <Link href="/">
                                    <a target="" rel="noopener noreferrer" className="mr-1 ml-1 text-primary">Chính Sách Bảo Mật của VALTRADE</a>
                                </Link>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Register;