import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import {
    FormBuilder,
    AbstractControl,
    Validators,
    FormGroup,
    FormArray,
    FieldGroup,
    FieldControl,
    FieldArray
} from "react-reactive-form";
import classNames from 'classnames';
import { useRouter } from 'next/router';
import * as common from '../utils/common.utils';
import api from '../utils/backend-api.utils';
import LoadingBar from 'react-top-loading-bar';


const Profile = () => {
    const router = useRouter();
    const [isEditPassword, setIsEditPassword] = useState(false);
    const [isEditEmail, setIsEditEmail] = useState(false);
    const [isEditPhone, setIsEditPhone] = useState(false);
    const [isEditName, setIsEditName] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showError, setShowError] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [newInfor, setNewInfor] = useState([]);
    const refLoadingBar = useRef(null);
    const [isLoading, setIsLoading] = useState(false);

    const passwordMatch = (formGroup) => {
        const confirmPasswordControl = formGroup.controls.confirm_password;
        const newPasswordControl = formGroup.controls.new_password;
        if (confirmPasswordControl.value !== newPasswordControl.value) {
            confirmPasswordControl.setErrors({ passwordMatch: true });
        } 
    }

    let updatePasswordForm = FormBuilder.group({
        current_password: ["", [Validators.required, Validators.minLength(8)]],
        new_password: ["", [Validators.required, Validators.minLength(8)]],
        confirm_password: ["", [Validators.required, Validators.minLength(8)]],

    }
    ,
        { validators: [Validators.required, Validators.minLength(8), passwordMatch] }
    );

    const updatePassword = async (e) => {
        e.preventDefault();
        
    }

    const getProfile = async () => {
        
    }

    const changeDisableInput = () =>{
        let disable = !disabled;
        setDisabled(disable);
    }

    const onChangeInput = (event) => {
        const { name, value } = event.target;

        setNewInfor({ ...newInfor, [name]: value });
    }

    const saveInformation = async (e) => {
        e.preventDefault();
    }

    return (
        <>
            <Head>
                <title>Tài khoản</title>
            </Head>
            <LoadingBar color="#00ac96" ref={refLoadingBar} />
            <div className="profile-container">
                <div className="d-flex row">
                    <div className="col-md-8 pr-1">
                        <div className="profile-content">
                            <div className="profile-content-row">
                                <h4 className="mt-0 mb-4">Thông tin cá nhân</h4>
                                <div className="d-flex row">
                                    <div className="col-md-12">
                                        {
                                            disabled ? (
                                                <div className="information-box">
                                            <div className="form-group row">
                                                <div className="d-flex align-items-center">
                                                    <label htmlFor="name" className="col-md-3 col-form-label">Tên người bán:</label>
                                                    <div className="col-md-9 d-flex align-items-center px-0">
                                                        <div className="col-md-10">
                                                            <input type="text" name="name" className="form-control" value="" disabled={disabled} placeholder="Tên người bán" />
                                                        </div>
                                                        {
                                                            disabled ? (
                                                                <div className="col-md-2">
                                                                <button type="button" className="btn btn-primary btn-edit" onClick={changeDisableInput}><i className="fa fa-edit" aria-hidden></i></button>
                                                                </div>
                                                                ) : (
                                                                <div className="col-md-2">
                                                                <button type="button" className="btn btn-primary btn-edit" onClick={saveInformation}><i className="fa fa-save" aria-hidden></i></button>
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
                                                            <input type="text" name="email" className="form-control" value="" disabled={disabled} placeholder="Email"/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group row">
                                                <div className="d-flex align-items-center">
                                                    <label htmlFor="phone" className="col-md-3 col-form-label">Số điện thoại:</label>
                                                    <div className="col-md-9 px-0">
                                                        <div className="col-md-10">
                                                            <input type="text" name="phone" className="form-control" value="" disabled={disabled} placeholder="Số điện thoại" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group row">
                                                <div className="d-flex align-items-center">
                                                    <label htmlFor="shop_name" className="col-md-3 col-form-label">Tên shop:</label>
                                                    <div className="col-md-9 px-0">
                                                        <div className="col-md-10">
                                                            <input type="text" name="shop_name" className="form-control" value="" disabled={disabled} placeholder="Tên shop" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group row">
                                                <div className="d-flex align-items-center">
                                                    <label htmlFor="address" className="col-md-3 col-form-label">Địa chỉ:</label>
                                                    <div className="col-md-9 px-0">
                                                        <div className="col-md-10">
                                                            <input type="text" name="address" className="form-control" value="" disabled={disabled} placeholder="Địa chỉ" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group row">
                                                <div className="d-flex align-items-center">
                                                    <label htmlFor="birthday" className="col-md-3 col-form-label">Ngày sinh:</label>
                                                    <div className="col-md-9 px-0">
                                                        <div className="col-md-10">
                                                            <input type="text" name="birthday" className="form-control" value="" disabled={disabled} placeholder="Ngày sinh" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        ):(
                                        <div className="information-box">
                                            <div className="form-group row">
                                                <div className="d-flex align-items-center">
                                                    <label htmlFor="name" className="col-md-3 col-form-label">Họ và tên:</label>
                                                    <div className="col-md-9 d-flex align-items-center px-0">
                                                        <div className="col-md-10">
                                                            <input type="text" name="name" className="form-control" value={newInfor.name} disabled={disabled} placeholder="Họ và tên" onChange={onChangeInput} />
                                                        </div>
                                                        {
                                                            disabled ? (
                                                                <div className="col-md-2">
                                                                <button type="button" className="btn btn-primary btn-edit" onClick={changeDisableInput}><i className="fa fa-edit" aria-hidden></i></button>
                                                                </div>
                                                                ) : (
                                                                <div className="col-md-2">
                                                                <button type="button" className="btn btn-primary btn-edit" onClick={saveInformation}><i className="fa fa-save" aria-hidden></i></button>
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
                                                            <input type="text" name="email" className="form-control" value={newInfor.email} disabled={disabled} placeholder="Email" onChange={onChangeInput}/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group row">
                                                <div className="d-flex align-items-center">
                                                    <label htmlFor="phone" className="col-md-3 col-form-label">Số điện thoại:</label>
                                                    <div className="col-md-9 px-0">
                                                        <div className="col-md-10">
                                                            <input type="text" name="phone" className="form-control" value={newInfor.phone} disabled={disabled} placeholder="Email" onChange={onChangeInput}/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group row">
                                                <div className="d-flex align-items-center">
                                                    <label htmlFor="shop_name" className="col-md-3 col-form-label">Tên shop:</label>
                                                    <div className="col-md-9 px-0">
                                                        <div className="col-md-10">
                                                            <input type="text" name="shop_name" className="form-control" value="" disabled={disabled} placeholder="Tên shop" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group row">
                                                <div className="d-flex align-items-center">
                                                    <label htmlFor="address" className="col-md-3 col-form-label">Địa chỉ:</label>
                                                    <div className="col-md-9 px-0">
                                                        <div className="col-md-10">
                                                            <input type="text" name="address" className="form-control" value="" disabled={disabled} placeholder="Địa chỉ" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group row">
                                                <div className="d-flex align-items-center">
                                                    <label htmlFor="birthday" className="col-md-3 col-form-label">Ngày sinh:</label>
                                                    <div className="col-md-9 px-0">
                                                        <div className="col-md-10">
                                                            <input type="text" name="birthday" className="form-control" value="" disabled={disabled} placeholder="Ngày sinh" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        )}
                                    </div>
                                
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 pl-1">
                        <div className="profile-content">
                            <div className="profile-content-row">
                                <h4 className="mt-0 mb-4">Bảo mật</h4>
                                <div className="form-group row">
                                    <div className="d-flex align-items-center">
                                        <label htmlFor="password" className="col-md-3 col-form-label">Mật khẩu:</label>
                                        <div className="col-md-7">
                                            <input type={showPassword ? 'password' : 'text'} name="password" className="form-control" value="" disabled placeholder="**********" />
                                        </div>
                                        <div className="col-md-2">
                                            {
                                                !isEditPassword
                                                    ?
                                                    <button type="button" className="btn btn-primary btn-edit" onClick={() => setIsEditPassword(!isEditPassword)}><i className="fa fa-edit" aria-hidden></i></button>
                                                    :
                                                    <button type="button" className="btn btn-danger btn-close" aria-label="Close" onClick={() => {setIsEditPassword(!isEditPassword); setShowError(false);}}></button>

                                            }
                                        </div>
                                    </div>
                                </div>
                                {
                                    isEditPassword &&
                                    <FieldGroup
                                        control={updatePasswordForm}
                                        render={({ get, invalid, dirty, reset, value }) => (
                                            <form className="form-edit-password" onSubmit={updatePassword}>
                                                {
                                                    <>
                                                        <FieldControl
                                                            name="current_password"
                                                            render={({ handler, touched, hasError, dirty, invalid }) => (
                                                                <div className="form-group">
                                                                    <label htmlFor="new-password" className="col-form-label">Mật khẩu hiện tại</label>
                                                                    <div>
                                                                        <input
                                                                            className={classNames("form-control", { 'is-invalid': invalid && showError })}
                                                                            placeholder="Mật khẩu hiện tại" type="password" name="current_password" id="current-password" {...handler()} />
                                                                        {
                                                                            hasError('required') && showError &&
                                                                            <div className="invalid-feedback text-left">
                                                                                Mật khẩu không được trống.
                                                                            </div>
                                                                        }
                                                                        {
                                                                            hasError('minLength') && showError &&
                                                                            <div className="invalid-feedback text-left">
                                                                                Mật khẩu phải ít nhất 8 kí tự.
                                                                            </div>
                                                                        }
                                                                    </div>
                                                                </div>
                                                            )}
                                                        />
                                                        <FieldControl
                                                            name="new_password"
                                                            render={({ handler, touched, hasError, dirty, invalid }) => (
                                                                <div className="form-group">
                                                                    <label htmlFor="new-password" className="col-form-label">Mật khẩu mới (ít nhất 8 kí tự)</label>
                                                                    <div>
                                                                        <input
                                                                            className={classNames("form-control", { 'is-invalid': invalid && showError })}
                                                                            placeholder="Mật khẩu mới" type="password" name="new_password" id="new-password" {...handler()} />
                                                                        {
                                                                            hasError('required') && showError &&
                                                                            <div className="invalid-feedback text-left">
                                                                                Mật khẩu không được trống.
                                                                            </div>
                                                                        }
                                                                        {
                                                                            hasError('minLength') && showError &&
                                                                            <div className="invalid-feedback text-left">
                                                                                Mật khẩu phải ít nhất 8 kí tự.
                                                                            </div>
                                                                        }
                                                                    </div>
                                                                </div>
                                                            )}
                                                        />
                                                        <FieldControl
                                                            name="confirm_password"
                                                            render={({ handler, touched, hasError, dirty, invalid }) => (
                                                                <div className="form-group mb-0">
                                                                    <label htmlFor="confirm-password" className="col-form-label">Xác nhận mật khẩu</label>
                                                                    <div>
                                                                        <input
                                                                            className={classNames("form-control", { 'is-invalid': invalid && showError })}
                                                                            placeholder="Xác nhận mật khẩu" type="password" name="confirm_password" id="confirm-password" {...handler()} />
                                                                        {
                                                                            hasError('required') && showError &&
                                                                            <div className="invalid-feedback text-left">
                                                                                Mật khẩu không được trống.
                                                                            </div>
                                                                        }
                                                                        {
                                                                            hasError('minLength') && showError &&
                                                                            <div className="invalid-feedback text-left">
                                                                                Mật khẩu phải ít nhất 8 kí tự.
                                                                            </div>
                                                                        }
                                                                        {
                                                                            !hasError('required') && !hasError('minLength') && showError && hasError('passwordMatch') &&
                                                                            <div className="invalid-feedback text-left">
                                                                                Mật khẩu không trùng.
                                                                            </div>
                                                                        }
                                                                    </div>
                                                                </div>
                                                            )}
                                                        />
                                                    </>
                                                }
                                                <button type="submit" className="btn btn-primary mt-4">Cập nhật</button>
                                            </form>
                                        )}
                                    />
                                }
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </>
    )
}

export default Profile;