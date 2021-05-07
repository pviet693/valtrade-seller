import Head from 'next/head';
import { Dropdown } from 'primereact/dropdown';
import LoadingBar from "react-top-loading-bar";
import { useRef, useState } from 'react';
import Switch from "react-switch";
import { Button } from '@material-ui/core';

const ShippingSetting = () => {
    const refLoadingBar = useRef(null);
    const [checked, setChecked] = useState(false);

    const handleChange = () => {
        const check = !checked;
        setChecked(check);
    }

    const onChangeProvince = () => {

    }

    return (
        <div className="shipping">
            <Head>
                <title>Thêm mới sản phẩm</title>
            </Head>
            <LoadingBar color="#00ac96" ref={refLoadingBar} onLoaderFinished={() => { }} />
            <div className="shipping-container">
                <div className="title">
                    Cài đặt vận chuyển
                </div>
                <hr />

                <div className="form-input">
                    <h4>Thiết lập kênh vận chuyển</h4>

                    <div className="option-shipping">
                        <div className="shipping-ghtk">
                            <label className="d-flex align-items-center col-md-8">
                                <span className="col-md-6">Giao hàng tiết kiệm</span>
                                <Switch onChange={handleChange} checked={checked}
                                onColor="#00AAFF" className="col-md-2"/>
                            </label>
                        </div>
                        <div className="shipping-ghn">
                            <label className="d-flex align-items-center col-md-8">
                                <span className="col-md-6">Giao hàng nhanh</span>
                                <Switch onChange={handleChange} checked={checked}
                                onColor="#00AAFF" className="col-md-2"/>
                            </label>
                        </div>
                        <div className="shipping-shop">
                            <label className="d-flex align-items-center col-md-8">
                                <span className="col-md-6">Xem, mua hàng tại địa chỉ bán</span>
                                <Switch onChange={handleChange} checked={checked}
                                onColor="#00AAFF" className="col-md-2"/>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="address-information col-md-8 d-flex flex-column">
                    <h4>Chỉnh sửa địa chỉ</h4>

                    <div className="address-information-content col-md-8">
                        <input type="text" className="form-control" id="name" name="name" defaultValue="Pham Van Viet" />
                        <div className="mb-3"></div>
                        <input type="text" className="form-control" id="phone" name="phone" defaultValue="(+84) 968250823" />
                        <div className="mb-3"></div>
                        <Dropdown value="TP. Hồ Chí Minh" onChange={onChangeProvince} optionLabel="province" filter showClear filterBy="province" placeholder="Chọn tỉnh, thành phố" id="province" style={{width: '100%'}}/>
                        <div className="mb-3"></div>
                        <Dropdown value="Quận Thủ Đức" onChange={onChangeProvince} optionLabel="district" filter showClear filterBy="district" placeholder="Chọn quận, huyện" id="district" style={{width: '100%'}}/>
                        <div className="mb-3"></div>
                        <Dropdown value="Phường Linh Trung" onChange={onChangeProvince} optionLabel="phuong" filter showClear filterBy="phuong" placeholder="Chọn phường" id="phuong" style={{width: '100%'}}/>
                        <div className="mb-3"></div>
                        <input type="text" className="form-control" id="address" name="address" defaultValue="KTX Khu B ĐHQG" />
                    </div>

                    <div className="address-footer d-flex flex-end">
                        <Button className="btn btn-back">TRỞ LẠI</Button>
                        <Button className="btn btn-complete">HOÀN THÀNH</Button>
                    </div>
                </div>

                
            </div>
        </div>
    )
}

export default ShippingSetting
