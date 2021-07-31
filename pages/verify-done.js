import Head from 'next/head';
import { useRouter } from 'next/router';


const VerifyDone = () => {
    const router = useRouter();

    const navigateToProfile = () => {
        router.push('/profile');
    }
    
    return (
        <>
            <Head>
                <title>
                    Cài đặt xác thực thành công
                </title>
            </Head>
            <div className="verify-done-container">
                <div className="verify-done-content">
                    <h3>CHÚC MỪNG</h3>
                    <h4>Cài đặt xác thực thành công.</h4>
                    <div className="img-verify">
                        <img src="/static/assets/img/done.svg" alt="Image verify done"/>
                    </div>
                    <button className="btn btn-login" onClick={navigateToProfile}><i className="lnr lnr-arrow-left mr-2" aria-hidden></i> Đăng nhập</button>
                </div>
            </div>
        </>
    )
}

export default VerifyDone;