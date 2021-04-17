import Head from 'next/head';
import { useRouter } from 'next/router';


const VerifyDone = () => {
    const router = useRouter();

    const signin = () => {
        router.push('/signin');
    }
    return (
        <>
            <Head>
                <title>
                    Xác thực thành công
                </title>
            </Head>
            <div className="verify-done-container">
                <div className="verify-done-content">
                    <h3>CHÚC MỪNG</h3>
                    <h4>Tài khoản của bạn đã được xác thực.</h4>
                    <div className="img-verify">
                        <img src="/static/assets/img/done.svg" alt="Image verify done"/>
                    </div>
                    <button className="btn btn-login" onClick={signin}><i className="lnr lnr-arrow-left mr-2" aria-hidden></i> Đăng nhập</button>
                </div>
            </div>
        </>
    )
}

export default VerifyDone;