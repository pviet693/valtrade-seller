import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import * as common from '../utils/common.utils';
import api from '../utils/backend-api.utils';
import LoadingBar from 'react-top-loading-bar';
import { useFormik } from 'formik';
import { Calendar } from 'primereact/calendar';
import cookie from 'cookie';
import { InputSwitch } from 'primereact/inputswitch';
import dynamic from "next/dynamic";
const PaypalBtn = dynamic(() => import("../components/Paypal"), {
    ssr: false,
  });
import Moment from 'moment';


const Profile = ({ profile, QRCode }) => {
    const router = useRouter();
    const [viewQRCode, setViewQRCode] = useState(false);
    const [isEditPassword, setIsEditPassword] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const refLoadingBar = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [secure, setSecure] = useState(profile.secure);
    const [addMoney, setAddMoney] = useState(false);
    const [cash, setCash] = useState(0);
    const [money, setMoney] = useState({
        moneyTransfer: 0,
        moneyWallet: 0
    });
    const [transactions, setTransactions] = useState([]);
    const formikInfo = useFormik({
        initialValues: {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            phone: profile.phone,
            address: profile.address,
            gender: profile.gender,
            birthday: new Date(profile.birthday),
        },
        validate: (data) => {
            let regexPhoneNumber = /(84|0[3|5|7|8|9])([0-9]{8})\b/g;
            let regexEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            let errors = {};

            if (!data.name) errors.name = "Họ và tên không được trống.";
            if (!data.email) errors.email = "Email không được trống.";
            if (!regexEmail.test(data.email)) errors.email = "Email không hợp lệ.";
            if (!data.phone) errors.phone = "Số điện thoại không được trống.";
            if (!regexPhoneNumber.test(data.phone)) errors.phone = "Số điện thoại không hợp lệ.";
            if (!data.address) errors.address = "Địa chỉ không được trống.";
            if (!data.gender) errors.gender = "Giới tính không được trống.";
            if (!data.birthday) errors.birthday = "Ngày sinh không được trống.";

            return errors;
        },
        onSubmit: (data) => {
            if (formikInfo.dirty || formikInfo.touched) saveInformation(data);
        }
    });

    const onChangeInput = () => {
        const { name, value } = event.target;
        setCash(Number(value));
    }

    const transactions1 = [
        { 
            transactionId: 'D2F32VDM7CL',
            total: 1000000,
            time: '23/07/2021',
            type: '-',
            content: 'chuyen tien thanh toan'
        },
        { 
            transactionId: 'HNA23CDM08',
            total: 2000000,
            time: '24/07/2021',
            type: '+',
            content: 'Nap tien vao tai khoan'
        }
    ];

    useEffect(async() => {
        try{
            const res = await api.transfer.getListTransfer();
            console.log(res);
            let lstTransaction = [];
            if (res.status === 200){
                if (res.data.code === 200){
                    setMoney({
                        moneyTransfer: res.data.result.moneyTransfer,
                        moneyWallet: res.data.result.moneyWallet
                    });
                    res.data.result.listHistory.map(x => {
                        let transaction = {
                            transactionId: x._id || "",
                            total: x.balance || "", 
                            time: x.timeTransfer.toLocaleString() || "",
                            type: x.isPay ? '-' : '+',
                            content: x.isPay? 'Chuyen tien thanh toan' : 'Nap tien vao tai khoan'
                        };
                        lstTransaction.push(transaction);
                    });
                    setTransactions(lstTransaction);
                }
            }
        }catch(err){
            console.log(err);
        }
    },[]);

    const formikPassword = useFormik({
        initialValues: {
            password: "",
            newPassword: "",
            confirmPassword: ""
        },
        validate: (data) => {
            let errors = {};

            if (!data.password) errors.password = "Mật khẩu không được trống.";
            if (data.password && data.password.length < 8)
                errors.password = "Mật khẩu không hợp lệ (ít nhất 8 kí tự).";
            if (!data.newPassword) errors.newPassword = "Mật khẩu không được trống.";
            if (data.newPassword && data.newPassword.length < 8)
                errors.newPassword = "Mật khẩu không hợp lệ (ít nhất 8 kí tự).";
            if (!data.confirmPassword) errors.confirmPassword = "Mật khẩu không được trống.";
            if (data.confirmPassword && data.confirmPassword.length < 8)
                errors.confirmPassword = "Mật khẩu không hợp lệ (ít nhất 8 kí tự).";

            return errors;
        },
        onSubmit: (data) => {
            updatePassword(data);
        }
    });


    const updatePassword = async (data) => {
        refLoadingBar.current.continuousStart();
        setIsLoading(true);

        try {
            const res = await api.seller.updatePassword(data);
            refLoadingBar.current.complete();
            setIsLoading(false);
            
            if (res.data.code === 200) {
                common.Toast("Cập nhật mật khẩu thành công.", "success");
            } else {
                common.Toast(res.data.message || "Cập nhật mật khẩu thất bại.", "error");
            }
        } catch (error) {
            refLoadingBar.current.complete();
            setIsLoading(false);
            common.Toast(error.message || error, "error");
        }
    }

    const saveInformation = async (data) => {
        refLoadingBar.current.continuousStart();
        try {
            let body = {
                ...data,
                birthday: data.birthday.toISOString()
            }
            const res = await api.seller.updateProfile(body);
            refLoadingBar.current.complete();

            if (res.data.code === 200) {
                common.Toast("Cập nhật thành công.", "success");
                setDisabled(!disabled);
            } else {
                common.Toast(res.data.message || "Cập nhật thất bại.", "error");
            }
        } catch (error) {
            refLoadingBar.current.complete();
            common.Toast(error.message || error, "error");
        }
    }

    const getCurrentYear = () => {
        const date = new Date();
        return date.getFullYear();
    }

    const getPastYear = () => {
        const date = new Date();
        date.setFullYear(getCurrentYear() - 100);
        return date.getFullYear();
    }

    const onUpdateSecure = async (e) => {
        const { value } = e;
        setSecure(value);
        try {
            refLoadingBar.current.continuousStart();
            try {
                let body = {
                    secure: value
                }
                const res = await api.seller.updateStatus2FA(body)
                refLoadingBar.current.complete();

                if (res.data.code === 200) {
                    common.Toast("Cập nhật thành công.", "success");
                } else {
                    common.Toast(res.data.message || "Cập nhật thất bại.", "error");
                }
            } catch (error) {
                refLoadingBar.current.complete();
                common.Toast(error.message || error, "error");
            }
        } catch (error) {

        }
    }

    const addMoneytoWallet = () => {
        setAddMoney(!addMoney);
    }


    const transactionSuccess = async () => {
        try{
            let transaction = {
                onUser: profile.id,
                onModel: 'Seller',
                typePay: 'paypal',
                isPay: false,
                balance: cash
            }
            const res = await api.transfer.postTransfer(transaction);
            if (res.status === 200) {
                if (res.data.code === 200) {
                    common.Toast("Nạp tiền thành công", 'success');
                    router.push('/profile');
                } else {
                    const message = res.data.message || "Nạp tiền thất bại.";
                    common.Toast(message, 'error');
                }
            }
    
        }catch(err){
            console.log(err);
        }
    };
    
    const transactionError = () => {
        console.log('Paypal error');
    }
    
    const transactionCanceled = () => {
        console.log('Transaction Canceled');
    }

    const currency_total = Math.round(cash/23000);

    return (
        <>
            <Head>
                <title>Tài khoản</title>
            </Head>
            <LoadingBar color="#00ac96" ref={refLoadingBar} />
            <div className="profile">
                <div className="profile-container">
                    <div className="d-flex">
                        <div className="col-md-8 pr-1 pl-0">
                            <div className="profile-content">
                                <div className="profile-content-row">
                                    <h4 className="mt-0 mb-4">Thông tin cá nhân</h4>
                                    <div className="d-flex row">
                                        <div className="col-md-12">
                                            <form onSubmit={formikInfo.handleSubmit}>
                                                <div className="information-box">
                                                    <div className="form-group row">
                                                        <div className="d-flex align-items-center">
                                                            <label htmlFor="name" className="col-md-3 col-form-label">Họ và tên:</label>
                                                            <div className="col-md-9 d-flex align-items-center px-0">
                                                                <div className="col-md-10">
                                                                    <input type="text" name="name"
                                                                        className={classNames("form-control",
                                                                            { "is-invalid": formikInfo.touched.name && formikInfo.errors.name }
                                                                        )}
                                                                        disabled={disabled}
                                                                        placeholder="Họ và tên"
                                                                        value={formikInfo.values.name}
                                                                        onChange={formikInfo.handleChange}
                                                                    />
                                                                    {
                                                                        formikInfo.touched.name && formikInfo.errors.name &&
                                                                        <small className="invalid-feedback">{formikInfo.errors.name}</small>
                                                                    }
                                                                </div>
                                                                {
                                                                    disabled ? (
                                                                        <div className="col-md-2">
                                                                            <div type="button" className="btn btn-primary btn-edit" onClick={() => setDisabled(!disabled)}><i className="fa fa-edit" aria-hidden></i></div>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="col-md-2">
                                                                            <button type="submit" className="btn btn-primary btn-edit"><i className="fa fa-save" aria-hidden></i></button>
                                                                        </div>
                                                                    )
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="form-group row">
                                                        <div className="d-flex align-items-center">
                                                            <label htmlFor="email" className="col-md-3 col-form-label">Email:</label>
                                                            <div className="col-md-9 px-0">
                                                                <div className="col-md-10">
                                                                    <input type="text" name="email"
                                                                        className={classNames("form-control",
                                                                            { "is-invalid": formikInfo.touched.email && formikInfo.errors.email }
                                                                        )}
                                                                        disabled={true}
                                                                        placeholder="Email"
                                                                        value={formikInfo.values.email}
                                                                        onChange={formikInfo.handleChange}
                                                                    />
                                                                    {
                                                                        formikInfo.touched.email && formikInfo.errors.email &&
                                                                        <small className="invalid-feedback">{formikInfo.errors.email}</small>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="form-group row">
                                                        <div className="d-flex align-items-center">
                                                            <label htmlFor="phone" className="col-md-3 col-form-label">Số điện thoại:</label>
                                                            <div className="col-md-9 px-0">
                                                                <div className="col-md-10">
                                                                    <input type="text"
                                                                        name="phone"
                                                                        className={classNames("form-control",
                                                                            { "is-invalid": formikInfo.touched.phone && formikInfo.errors.phone }
                                                                        )}
                                                                        disabled={disabled}
                                                                        placeholder="Số điện thoại"
                                                                        value={formikInfo.values.phone}
                                                                        onChange={formikInfo.handleChange}
                                                                    />
                                                                    {
                                                                        formikInfo.touched.phone && formikInfo.errors.phone &&
                                                                        <small className="invalid-feedback">{formikInfo.errors.phone}</small>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="form-group row">
                                                        <div className="d-flex align-items-center">
                                                            <label htmlFor="shop_name" className="col-md-3 col-form-label">Địa chỉ:</label>
                                                            <div className="col-md-9 px-0">
                                                                <div className="col-md-10">
                                                                    <input type="text"
                                                                        name="address"
                                                                        className={classNames("form-control",
                                                                            { "is-invalid": formikInfo.touched.address && formikInfo.errors.address }
                                                                        )}
                                                                        placeholder="Địa chỉ"
                                                                        disabled={disabled}
                                                                        value={formikInfo.values.address}
                                                                        onChange={formikInfo.handleChange}
                                                                    />
                                                                    {
                                                                        formikInfo.touched.address && formikInfo.errors.address &&
                                                                        <small className="invalid-feedback">{formikInfo.errors.address}</small>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="form-group row">
                                                        <div className="d-flex align-items-center">
                                                            <label htmlFor="address" className="col-md-3 col-form-label">Giới tính:</label>
                                                            <div className="col-md-9 px-0">
                                                                <div className="col-md-10">
                                                                    <div className="col-md-3 d-flex align-items-center px-0">
                                                                        <input type="radio"
                                                                            name="gender"
                                                                            value="male"
                                                                            disabled={disabled}
                                                                            checked={formikInfo.values.gender === "male"}
                                                                            onChange={formikInfo.handleChange}
                                                                        />
                                                                        <span className="col-form-label">Nam</span>
                                                                    </div>

                                                                    <div className="col-md-9 d-flex align-items-center">
                                                                        <input type="radio"
                                                                            name="gender"
                                                                            value="female"
                                                                            disabled={disabled}
                                                                            checked={formikInfo.values.gender === "female"}
                                                                            onChange={formikInfo.handleChange}
                                                                        />
                                                                        <span className="col-form-label">Nữ</span>
                                                                    </div>
                                                                    {
                                                                        formikInfo.touched.gender && formikInfo.errors.gender &&
                                                                        <small className="invalid-feedback">{formikInfo.errors.gender}</small>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="form-group row">
                                                        <div className="d-flex align-items-center">
                                                            <label htmlFor="birthday" className="col-md-3 col-form-label">Ngày sinh:</label>
                                                            <div className="col-md-9 px-0">
                                                                <div className="col-md-10">
                                                                    <Calendar dateFormat="dd/mm/yy"
                                                                        disabled={disabled}
                                                                        showIcon placeholder="Ngày sinh"
                                                                        readOnlyInput id="birthday"
                                                                        name="birthday"
                                                                        onChange={formikInfo.handleChange}
                                                                        value={formikInfo.values.birthday}
                                                                        monthNavigator yearNavigator
                                                                        showButtonBar
                                                                        yearRange={`${getPastYear()}:${getCurrentYear()}`}
                                                                    />
                                                                    {
                                                                        formikInfo.touched.birthday && formikInfo.errors.birthday &&
                                                                        <small className="invalid-feedback">{formikInfo.errors.birthday}</small>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <div className="transaction-container col-md-8">
                                    <div className="wallet-container">
                                        <h4 className="mt-0 mb-4">Ví của tôi</h4>
                                        
                                        <div className="wallet-money">
                                            <div className="row">
                                                <div className="col-md-6 d-flex">
                                                    <div><p><strong>Tổng tiền:</strong> {common.numberWithCommas(money.moneyWallet)}VND</p></div>
                                                    <div className="lnr lnr-plus-circle" style={{marginTop: '4px', marginLeft: '5px'}} onClick={addMoneytoWallet}></div>
                                                </div>
                                                <div className="col-md-6">
                                                    <p><strong>Đã sử dụng:</strong> {common.numberWithCommas(money.moneyTransfer)}VND</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <h4 className="mt-0 mb-4">Lịch sử giao dịch</h4>
                                    <table className="table border border-1">
                                        <thead className="thread-light">
                                            <tr>
                                                <th scope="col">Mã giao dịch</th>
                                                <th scope="col">Tổng giao dịch</th>
                                                <th scope="col">Thời gian giao dịch</th>
                                                <th scope="col">Nội dung giao dịch</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                transactions.map(x=> 
                                                    <tr key={x.transactionId}>
                                                        <td>{x.transactionId}</td>
                                                        <td>{x.type}{common.numberWithCommas(x.total)}</td>
                                                        <td>{Moment(new Date(x.time)).format("DD/MM/yyyy HH:mm:ss A")}</td>
                                                        <td>{x.content}</td>
                                                    </tr>
                                                )
                                            }
                                        </tbody>
                                        </table>
                                </div>
                            </div>  
                        </div>
                        <div className="col-md-4 pl-1 pr-0">
                            <div className="profile-content">
                                <div className="profile-content-row">
                                    <h4 className="mt-0 mb-4">Bảo mật</h4>
                                    <div className="form-group row">
                                        <div className="d-flex align-items-center">
                                            <label htmlFor="password" className="col-md-3 col-form-label">Mật khẩu:</label>
                                            <div className="col-md-7">
                                                <input type='password' name="password" className="form-control" value="" disabled placeholder="**********" />
                                            </div>
                                            <div className="col-md-2">
                                                {
                                                    !isEditPassword
                                                        ?
                                                        <button type="button" className="btn btn-primary btn-edit" onClick={() => setIsEditPassword(!isEditPassword)}><i className="fa fa-edit" aria-hidden></i></button>
                                                        :
                                                        <button type="button" className="btn btn-danger btn-close" aria-label="Close" onClick={() => setIsEditPassword(!isEditPassword)}></button>

                                                }
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        isEditPassword &&
                                        <form className="form-edit-password" onSubmit={formikPassword.handleSubmit}>
                                            <div className="form-group">
                                                <label htmlFor="new-password" className="col-form-label">Mật khẩu hiện tại</label>
                                                <div>
                                                    <input
                                                        className={classNames("form-control",
                                                            { 'is-invalid': formikPassword.touched.password && formikPassword.errors.password }
                                                        )}
                                                        placeholder="Mật khẩu hiện tại" type="password"
                                                        name="password"
                                                        value={formikPassword.values.password}
                                                        onChange={formikPassword.handleChange}
                                                    />
                                                    {
                                                        formikPassword.touched.password && formikPassword.errors.password &&
                                                        <small className="invalid-feedback">{formikPassword.errors.password}</small>
                                                    }
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="new-password" className="col-form-label">Mật khẩu mới</label>
                                                <div>
                                                    <input
                                                        className={classNames("form-control",
                                                            { 'is-invalid': formikPassword.touched.newPassword && formikPassword.errors.newPassword }
                                                        )}
                                                        placeholder="Mật khẩu mới" type="password"
                                                        name="newPassword"
                                                        value={formikPassword.values.newPassword}
                                                        onChange={formikPassword.handleChange}
                                                    />
                                                    {
                                                        formikPassword.touched.newPassword && formikPassword.errors.newPassword &&
                                                        <small className="invalid-feedback">{formikPassword.errors.newPassword}</small>
                                                    }
                                                </div>
                                            </div>

                                            <div className="form-group mb-0">
                                                <label htmlFor="confirm-password" className="col-form-label">Xác nhận mật khẩu</label>
                                                <div>
                                                    <input
                                                        className={classNames("form-control",
                                                            { 'is-invalid': formikPassword.touched.confirmPassword && formikPassword.errors.confirmPassword }
                                                        )}
                                                        placeholder="Xác nhận mật khẩu" type="password"
                                                        name="confirmPassword"
                                                        value={formikPassword.values.confirmPassword}
                                                        onChange={formikPassword.handleChange}
                                                    />
                                                    {
                                                        formikPassword.touched.confirmPassword && formikPassword.errors.confirmPassword &&
                                                        <small className="invalid-feedback">{formikPassword.errors.confirmPassword}</small>
                                                    }
                                                </div>
                                            </div>
                                            {
                                                isLoading &&
                                                <button type="button" className="btn button-primary mt-4" disabled="disabled"><i className="fa fa-spinner fa-spin mr-2" aria-hidden></i>Xử lí...</button>
                                            }
                                            {
                                                !isLoading &&
                                                <button type="submit" className="btn btn-primary mt-4">Cập nhật</button>
                                            }
                                        </form>
                                    }
                                    <div className="form-group row mb-2">
                                        <label htmlFor="settingAuthorize" className="col-md-5 col-form-label">Xác thực 2 yếu tố</label>
                                        <div className="col-md-7">
                                            <InputSwitch checked={secure} onChange={onUpdateSecure} />
                                        </div>
                                    </div>
                                    {
                                        secure && !QRCode &&
                                        <>
                                            <div className="font-italic mb-2">
                                                Lưu ý: Khi bật tính năng xác thực 2 yếu tố,
                                                bạn phải "Cài đặt xác thực" để có được mã dùng trong việc xác thực khi đăng nhập
                                                ở lần tiếp theo.
                                            </div>
                                            <div className="form-group row">
                                                <div className="col-md-12">
                                                    <button type="submit" className="btn btn-primary" onClick={() => router.push(`/verify?id=${formikInfo.values.id}`)}>Cài đặt xác thực</button>
                                                </div>
                                            </div>
                                        </>
                                    }
                                    {
                                        secure && QRCode &&
                                        <div className="d-flex align-items-center justify-content-center">
                                            <div className="img-qr-code-box">
                                                {
                                                    viewQRCode ?
                                                        <>
                                                            <img src={QRCode} alt="QR Code" />
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
                                    }
                                </div>
                            </div>
                            {
                                addMoney ? 
                                <div className="button-add-money">
                                    <div className="row d-flex">
                                        <div className="form-group row align-items-center d-flex col-md-11">
                                            <label htmlFor="cash" className="col-md-3 col-form-label">Số tiền</label>
                                            <div className="col-md-9">
                                                <input type="number" className="form-control" id="cash" placeholder="Nhập số tiền cần nạp" name="cash" defaultValue={cash} onChange={onChangeInput} />
                                            </div>
                                        </div>
                                        <button type="button" className="btn btn-danger btn-close col-md-1" aria-label="Close" onClick={() => setAddMoney(false)}></button>  
                                    </div>
                                    
                                    <div>
                                        <h4 className="mt-0 mb-4">Phương thức nạp tiền</h4>
                                    </div>
                                    <PaypalBtn 
                                        toPay = {currency_total}
                                        transactionSuccess={transactionSuccess}
                                        transactionError = {transactionError}
                                        transactionCanceled = {transactionCanceled}
                                        className="btn-paypal"
                                    />
                                </div>: 
                                <div></div>
                            }        
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export async function getServerSideProps(ctx) {
    const cookies = ctx.req.headers.cookie;
    let profile = {};
    let QRCode = "";
    if (cookies) {
        const token = cookie.parse(cookies).seller_token;
        if (token) {
            try {
                const res = await api.seller.getProfile(token);
                if (res.data.code === 200) {
                    const result = res.data.result;
                    profile.id = result._id || "";
                    profile.name = result.nameOwner || "";
                    profile.email = result.email || "";
                    profile.phone = result.phone || "";
                    profile.address = result.address || "";
                    profile.gender = result.gender || "";
                    profile.birthday = result.birthday || "";
                    profile.secure = result.secure || false;
                }

                const resQRCode = await api.seller.getQrCode(profile.id, token);
                if (res.data.code === 200) {
                    QRCode = resQRCode.data.result;
                }
            } catch (err) {
                console.log(err.message);
            }

            return {
                props: {
                    profile,
                    QRCode
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

export default Profile;