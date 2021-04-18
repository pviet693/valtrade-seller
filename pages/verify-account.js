import Head from 'next/head';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import LoadingBar from "react-top-loading-bar";
import Cookie from 'js-cookie';
import classNames from 'classnames';
import api from './../utils/backend-api.utils';
import * as validate from './../utils/validate.utils';
import * as common from './../utils/common.utils';

const VerifyAccount = (props) => {

    const router = useRouter();
    const { id } = props;
    const [formVerify, setFormVerify] = useState({ id: id, token: "" });
    const refLoadingBar = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showError, setShowError] = useState(false);

    const onChangeVerify = (event) => {
        const { name, value } = event.target;
        setFormVerify({ ...formVerify, [name]: value });
    }

    const handleVerify = async (event) => {
        event.preventDefault();
        setShowError(true);
        if (validate.checkEmptyInput(formVerify.token) || !formVerify.id) return;

        setIsLoading(true);
        refLoadingBar.current.continuousStart();

        try {
            const res = await api.seller.postValidate(formVerify);
            setIsLoading(false);
            refLoadingBar.current.complete();
            if (res.status === 200) {
                if (res.data.code === 200) {
                    common.Toast('Xác thực thành công.', 'success')
                        .then(() => {
                            Cookie.set('seller_token', res.data.token, { path: '/', expires: 30 });
                            router.push('/product');
                        });
                } else {
                    const message = res.data.message || "Mã xác thực không đúng.";
                    common.Toast(message, 'error');
                }
            }
        } catch (error) {
            setIsLoading(false);
            refLoadingBar.current.complete();
            common.Toast(error, 'error');
        }
    }

    return (
        <>
            <Head>
                <title>Xác thực tài khoản</title>
            </Head>
            <LoadingBar color="#00ac96" ref={refLoadingBar} />
            <div className="verify-account-container">
                <div className="container">
                    <div className="row verify-account-content">
                        <div className="col-md-6 mb-3">
                            <img src="/static/assets/img/security.svg" className="img-verify" alt="Image verify" />
                        </div>
                        <div className="col-md-6">
                            <h3 className="verify-text mb-3">Xác thực tài khoản</h3>
                            <form onSubmit={handleVerify}>
                                <div className="form-group">
                                    <label className="mt-6 mb-3" htmlFor="token">Mã xác thực</label>
                                    <input
                                        type="text"
                                        name="token"
                                        className="form-control"
                                        className={classNames("form-control", { "is-invalid": validate.checkEmptyInput(formVerify.token) && showError })}
                                        value={formVerify.token}
                                        onChange={onChangeVerify}
                                    >
                                    </input>
                                    {
                                        validate.checkEmptyInput(formVerify.token) && showError &&
                                        <div className="invalid-feedback">
                                            Mã xác thực không được rỗng.
                                        </div>
                                    }
                                </div>

                                {
                                    !isLoading &&
                                    <button type="submit" className="btn btn-class mt-2">Xác thực</button>
                                }
                                {
                                    isLoading &&
                                    <button type="button" className="btn btn-class mt-2" disabled="disabled"><i className="fa fa-spinner fa-spin mr-2" aria-hidden></i>Xử lí...</button>
                                }
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export async function getServerSideProps(ctx) {
    const id = ctx.query.id;

    return {
        props: { id: id }
    }
}

export default VerifyAccount;