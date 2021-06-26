import Head from 'next/head';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import LoadingBar from "react-top-loading-bar";
import classNames from 'classnames';
import api from './../utils/backend-api.utils';
import * as validate from './../utils/validate.utils';
import * as common from './../utils/common.utils';
import Cookie from 'js-cookie';

const Verify = (props) => {
    const router = useRouter();
    const { id, qrCodeUrl } = props;
    const [formVerify, setFormVerify] = useState({ id: id, token: "" });
    const refLoadingBar = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showError, setShowError] = useState(false);
    const [viewQRCode, setViewQRCode] = useState(false);

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
            const res = await api.seller.postVerify(formVerify);
            setIsLoading(false);
            refLoadingBar.current.complete();
            if (res.status === 200) {
                if (res.data.code === 200) {
                    common.Toast('Xác thực thành công.', 'success')
                        .then(() => {
                            Cookie.remove('email_register');
                            router.push('/verify-done');
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
                <title>Cài đặt xác thực</title>
            </Head>
            <LoadingBar color="#00ac96" ref={refLoadingBar} />
            <div className="verify-email">
                <div className="container">
                    <div className="row content">
                        <div className="col-md-6">
                            <div className="img-verify">
                                <img src="/static/assets/img/security.svg" alt="Image verify" />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <h3 className="verify-text">Cài đặt xác thực</h3>
                            <div className="instruction-step-verify">
                                <h5 className="step-verify-title">Các bước thực hiện: </h5>
                                <ol>
                                    <li className="step-verify-row">Cài đặt phần mềm Google Authenticator vào điện thoại Smartphone.</li>
                                    <li className="step-verify-row">Nhấn vào "Xem mã" để hiện thị mã QR Code.</li>
                                    <li className="step-verify-row">Dùng Authenticator quét mã QR Code.</li>
                                    <li className="step-verify-row">Lấy mã nhận được để tiến hành xác thực.</li>
                                    <li className="step-verify-row">Giữ mã này để xác thực khi đăng nhập những lần sau.</li>
                                </ol>
                            </div>
                            <div className="d-flex align-items-center justify-content-center">
                                <div className="img-qr-code-box">
                                    {
                                        viewQRCode ?
                                        <>
                                            <img src={qrCodeUrl} alt="QR Code"/>
                                            <button type="button" className="btn btn-close" aria-label="Close" onClick={() => setViewQRCode(!viewQRCode)}></button>
                                        </>
                                        :
                                        <div className="qr-code-hidden">
                                            <button className="btn-primary" onClick={() => setViewQRCode(!viewQRCode)}>
                                                Xem mã
                                            </button>
                                        </div>
                                    }
                                </div>
                            </div>
                            <form onSubmit={handleVerify}>
                                <div className="form-group">
                                    <label className="mt-6" htmlFor="token">Mã xác thực</label>
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
                                
                                <div className="d-flex align-items-center">
                                    {
                                        !isLoading &&
                                        <button type="submit" className="btn btn-primary mt-2">Xác thực</button>
                                    }
                                    {
                                        isLoading &&
                                        <button type="button" className="btn btn-primary mt-2" disabled="disabled"><i className="fa fa-spinner fa-spin mr-2" aria-hidden></i>Xử lí...</button>
                                    }
                                    <div type="submit" className="btn btn-class mt-2 ml-4" onClick={() => router.push("/profile")}>Trở về</div>
                                </div>
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
    let qrCodeUrl = "";
    try {
        const res = await api.seller.getQrCode(id);
        if (res.status === 200) {
            if (res.data.code === 200) {
                qrCodeUrl = res.data.result || "";
            }
        }
    } catch(error) {
        console.log(error);
    }
    return {
        props: { id: id, qrCodeUrl: qrCodeUrl }
    }
}

export default Verify;