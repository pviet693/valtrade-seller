import Head from 'next/head';
import * as cryptojs from 'crypto-js';
import Cookie from 'js-cookie';
import Link from 'next/link';

const RegisterDone = () => {
    const email = cryptojs.AES.decrypt(Cookie.get('email_register'), '1').toString(cryptojs.enc.Utf8);
    const hideEmail = (email) => {
        return email.replace(/(.{2})(.*)(?=@)/,
        function(gp1, gp2, gp3) { 
        for(let i = 0; i < gp3.length-1; i++) { 
            gp2+= "*"; 
        } return gp2; 
        });
    }
    return (
        <>
            <Head>
                Hoàn thành đăng kí
            </Head>
            <div className="registerdone-container">
                <div className="registerdone-content">
                    <div className="header text-center">
                        <p className="lead">Chúc mừng bạn đã đăng kí tài khoản thành công.</p>
                        <p className="notify-email">Chúng tôi đã gửi email xác thực đến email <a href="https://mail.google.com/mail/u/0" className="text-primary"> {hideEmail(email)} </a> </p>
                    </div>
                    <div className="img-done d-flex justify-content-center">
                        <img src="../static/assets/img/Done.gif" alt="" />
                    </div>
                    <div className="check-mail text-center">
                        Vui lòng kiểm tra email để tiến hành xác thực tài khoản.
                    </div>
                </div>
            </div>
        </>
    )
}

export default RegisterDone;