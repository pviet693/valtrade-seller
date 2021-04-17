import Head from 'next/head';
import * as cryptojs from 'crypto-js';
import Cookie from 'js-cookie';
import { useEffect, useState } from 'react';
import * as common from './../utils/common.utils';
import { useRouter } from 'next/router';

const RegisterDone = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");

    const hideEmail = (email) => {
        return email.replace(/(.{2})(.*)(?=@)/,
            function(gp1, gp2, gp3) { 
                for(let i = 0; i < gp3.length - 1; i++) { 
                    gp2 += "*"; 
                } 
                return gp2; 
        });
    }

    const decryptEmail = () => {
        if (email) {
            return cryptojs.AES.decrypt(email, common.KeyEncrypt).toString(cryptojs.enc.Utf8);
        }
        return "";
    }

    useEffect(() => {
        const emailEncrypt = Cookie.get('email_register');
        if (emailEncrypt) {
            setEmail(emailEncrypt);
        } else {
            router.push('/register');
        }
    }, [])

    return (
        <>
            <Head>
                Hoàn thành đăng kí
            </Head>
            <div className="register-done-container">
                <div className="register-done-content">
                    <div className="header text-center">
                        <p className="lead">Chúc mừng bạn đã đăng kí tài khoản thành công.</p>
                        <p className="notify-email">Chúng tôi đã gửi email xác thực đến email <a href="https://mail.google.com/mail/u/0" className="text-primary"> {email ? hideEmail(decryptEmail()) : ""} </a> </p>
                    </div>
                    <div className="img-done d-flex justify-content-center">
                        <img src="../static/assets/img/Done.gif" alt="" />
                    </div>
                    <div className="check-mail text-center">
                        Vui lòng kiểm tra email thường xuyên để tiến hành xác thực tài khoản.
                    </div>
                </div>
            </div>
        </>
    )
}

export default RegisterDone;