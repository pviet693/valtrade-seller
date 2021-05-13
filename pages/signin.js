import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import LoadingBar from "react-top-loading-bar";
import classNames from 'classnames';
import api from './../utils/backend-api.utils';
import * as validate from './../utils/validate.utils';
import * as common from './../utils/common.utils';
import { AuthModel } from './../models/login.model';

export default function SignIn() {

    const router = useRouter();
    const refLoadingBar = useRef(null);
    const [auth, setAuth] = useState(new AuthModel());
    const [showError, setShowError] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const login = async (e) => {
        e.preventDefault();
        setShowError(true);
        if (!validate.validateEmail(auth.email)
            || !validate.validatePassword(auth.password)
            || validate.checkEmptyInput(auth.email)
            || validate.checkEmptyInput(auth.password)
        ) {
            return;
        }

        setLoading(true);
        refLoadingBar.current.continuousStart();
        
        try {
            const res = await api.seller.postSignin(auth);
            setLoading(false);
            refLoadingBar.current.complete();
            if (res.status === 200) {
                if (res.data.code === 200) {
                    common.Toast("Đăng nhập thành công.", 'success')
                        .then(() => {
                            router.push(`/verify-account?id=${res.data.id}`);
                        })
                } else if (res.data.code === 300) {
                    common.Toast("Email không tồn tại", 'error')
                    setLoading(false);
                    refLoadingBar.current.complete();
                } 
                else {
                    const message = res.data.message || "Đăng nhập thất bại.";
                    common.Toast(message, 'error')
                    setLoading(false);
                    refLoadingBar.current.complete();
                }
            }
        } catch(error) {
            setLoading(false);
            refLoadingBar.current.complete();
            common.Toast(error, 'error');
        }
            router.push('/product');
        
    }

    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setAuth({...auth, [name]: value});
    }

    return (
        <>
            <Head>
                <title>Đăng nhập tài khoản</title>
            </Head>
            <LoadingBar color="#00ac96" ref={refLoadingBar} onLoaderFinished={() => { }} />
            <div id="wrapper">
                <div className="vertical-align-wrap">
                    <div className="vertical-align-middle">
                        <div className="auth-box ">
                            <div className="left">
                                <div className="content">
                                    <div className="header">
                                        <div className="logo text-center"><img src="/static/assets/img/logo-dark.png" alt="Logo" /></div>
                                        <p className="lead">Đăng nhập vào tài khoản của bạn</p>
                                    </div>
                                    <form className="form-auth-small" onSubmit={login}>
                                        <div className="form-group">
                                            <label htmlFor="signin-email" className="control-label sr-only">Email</label>
                                            <input type="email" id="signin-email" 
                                                placeholder="Email" value={auth.email}
                                                name="email"
                                                className={classNames("form-control", { "is-invalid": (validate.checkEmptyInput(auth.email) || !validate.validateEmail(auth.email)) && showError })}
                                                onChange={onChangeInput}
                                                />
                                            {
                                                validate.checkEmptyInput(auth.email) && showError &&
                                                <div className="invalid-feedback text-left">
                                                    Email không được trống.
                                                </div>
                                            }
                                            {
                                                !validate.validateEmail(auth.email) && showError &&
                                                <div className="invalid-feedback text-left">
                                                    Email không hợp lệ.
                                                </div>
                                            }
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="signin-password" className="control-label sr-only">Mật khẩu</label>
                                            <input type="password" 
                                                className={classNames("form-control", { "is-invalid": (validate.checkEmptyInput(auth.email) || !validate.validateEmail(auth.email)) && showError })}
                                                id="signin-password"
                                                placeholder="Mật khẩu" value={auth.password} 
                                                name="password"
                                                onChange={onChangeInput}
                                                />
                                            {
                                                validate.checkEmptyInput(auth.password) && showError &&
                                                <div className="invalid-feedback text-left">
                                                    Mật khẩu không được trống.
                                                </div>
                                            }
                                            {
                                                !validate.validatePassword(auth.password) && showError &&
                                                <div className="invalid-feedback text-left">
                                                    Mật khẩu không hợp lệ (ít nhất 8 ký tự).
                                                </div>
                                            }
                                        </div>
                                        {
                                            !isLoading && 
                                            <button type="submit" className="btn btn-primary btn-lg btn-block">ĐĂNG NHẬP</button>
                                        }
                                        {
                                            isLoading &&
                                            <button type="button" className="btn btn-primary btn-lg btn-block" disabled="disabled"><i className="fa fa-spinner fa-spin mr-2" aria-hidden></i>Xử lí...</button>
                                        }
                                        <div className="bottom">
                                            <span className="helper-text"><i className="fa fa-lock" aria-hidden></i> <a>Quên mật khẩu?</a></span>
                                        </div>
                                        <div className="bottom d-flex justify-content-center">
                                            <span className="helper-text d-flex">
                                                <p>Chưa có tài khoản người bán?</p>
                                                <Link href="/register">    
                                                    <a style={{color: '#00AAFF'}}>Tạo tài khoản</a>
                                                </Link>
                                            </span>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className="right">
                                <div className="overlay"></div>
                                <div className="content text">
                                    <h1 className="heading">Chào mừng bạn đến với website đồ cũ VALTRADE</h1>
                                </div>
                            </div>
                            <div className="clearfix"></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
