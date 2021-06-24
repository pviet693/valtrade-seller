import Head from 'next/head';
import { Dropdown } from 'primereact/dropdown';
import LoadingBar from "react-top-loading-bar";
import { useEffect, useRef, useState } from 'react';
import Switch from "react-input-switch";
import { Button } from '@material-ui/core';
import api from './../../utils/backend-api.utils';
import * as common from './../../utils/common.utils';
import cookie from "cookie";

const UpdateInformationShop = () => {
    const refLoadingBar = useRef(null);

    return (
        <div className="shop">
            <Head>
                <title>Cài đặt vận chuyển</title>
            </Head>
            <LoadingBar color="#00ac96" ref={refLoadingBar} onLoaderFinished={() => { }} />
            <div className="shop-container">
                <div className="title">
                    Cập nhật thông tin shop
                </div>
                <hr />

                {/* <div className="shipping-setting-row">
                    <div className="setting-row-header">Giao hàng nhanh</div>
                    <div className="setting-row-container">
                        <Switch
                            id="active-ghn"
                            onChange={setActiveGHN}
                            value={activeGHN}
                            styles={{
                                track: {
                                    backgroundColor: 'gray'
                                },
                                trackChecked: {
                                    backgroundColor: '#00a23b'
                                },
                                button: {
                                    backgroundColor: '#fff'
                                },
                                buttonChecked: {
                                    backgroundColor: '#fff'
                                }
                            }}
                        />

                        {
                            disableGHN
                                ?
                                <>
                                    <div className="setting-row">
                                        <label className="row-title" htmlFor="province-ghn">Tỉnh/Thành phố: </label>
                                        <input
                                            type="text" className="form-control"
                                            id="province-ghn" name="province-ghn"
                                            placeholder="Tỉnh/thành phố"
                                            defaultValue={province.ProvinceName}
                                            disabled={disableGHN}
                                        />
                                    </div>
                                    <div className="setting-row">
                                        <label className="row-title" htmlFor="district-ghn">Quận/Huyện: </label>
                                        <input
                                            type="text" className="form-control"
                                            id="district-ghn" name="district-ghn"
                                            placeholder="Quận/huyện"
                                            defaultValue={district.DistrictName}
                                            disabled={disableGHN}
                                        />
                                    </div>
                                    <div className="setting-row">
                                        <label className="row-title" htmlFor="ward-ghn">Phường/Xã: </label>
                                        <input
                                            type="text" className="form-control"
                                            id="ward-ghn" name="ward-ghn"
                                            placeholder="Phường/xã"
                                            defaultValue={ward.WardName}
                                            disabled={disableGHN}
                                        />
                                    </div>

                                    <div className="setting-row">
                                        <label className="row-title" htmlFor="street-ghn">Tòa nhà, tên đường: </label>
                                        <input
                                            type="text" className="form-control"
                                            id="street-ghn" name="street_name"
                                            placeholder="Tòa nhà, Tên đường..."
                                            defaultValue={street}
                                            disabled={disableGHN}
                                        />
                                    </div>
                                </>
                                :
                                <>
                                    <div className="setting-row">
                                        <label className="row-title" htmlFor="province-ghn">Tỉnh/Thành phố: </label>
                                        <Dropdown
                                            id="province-ghn"
                                            value={province}
                                            onChange={onChangeProvince}
                                            options={provinces}
                                            optionLabel="ProvinceName"
                                            filter showClear
                                            filterBy="ProvinceName"
                                            placeholder="Chọn tỉnh/thành phố"
                                            disabled={disableGHN}
                                        />
                                    </div>
                                    <div className="setting-row">
                                        <label className="row-title" htmlFor="district-ghn">Quận/Huyện: </label>
                                        <Dropdown
                                            id="district-ghn"
                                            value={district}
                                            onChange={onChangeDistrict}
                                            options={districts}
                                            optionLabel="DistrictName"
                                            filter showClear
                                            filterBy="DistrictName"
                                            placeholder="Chọn quận/huyện"
                                            disabled={!province || disableGHN}
                                        />
                                    </div>
                                    <div className="setting-row">
                                        <label className="row-title" htmlFor="ward-ghn">Phường/Xã: </label>
                                        <Dropdown
                                            id="ward-ghn"
                                            value={ward}
                                            onChange={e => setWard(e.value)}
                                            options={wards}
                                            optionLabel="WardName"
                                            filter showClear
                                            filterBy="WardName"
                                            placeholder="Chọn phường/xã"
                                            disabled={!district || disableGHN}
                                        />
                                    </div>
                                    <div className="setting-row">
                                        <label className="row-title" htmlFor="street">Tòa nhà, tên đường: </label>
                                        <input
                                            type="text" className="form-control"
                                            id="street" name="street_name"
                                            placeholder="Tòa nhà, Tên đường..."
                                            value={street} onChange={e => setStreet(e.target.value)}
                                            disabled={disableGHN}
                                        />
                                    </div>
                                </>
                        }

                        <div className="setting-row-button">
                            <button className="btn btn-cancel mr-4" onClick={initValue}>Hủy bỏ</button>
                            {
                                loading
                                    ?
                                    <button type="button" className="btn btn-save" disabled="disabled"><i className="fa fa-spinner fa-spin mr-2" aria-hidden></i>Xử lí...</button>
                                    :
                                    <button className="btn btn-save" onClick={saveGHN}>Lưu lại</button>
                            }
                        </div>
                    </div>
                </div>

                <div className="shipping-setting-row">
                    <div className="setting-row-header">Giao hàng nhanh</div>
                    <div className="setting-row-container">
                        <Switch
                            id="active-ghtk"
                            onChange={setActiveGHTK}
                            value={activeGHTK}
                            styles={{
                                track: {
                                    backgroundColor: 'gray'
                                },
                                trackChecked: {
                                    backgroundColor: '#00a23b'
                                },
                                button: {
                                    backgroundColor: '#fff'
                                },
                                buttonChecked: {
                                    backgroundColor: '#fff'
                                }
                            }}
                        />
                        {
                            disableGHTK
                                ?
                                <>
                                    <div className="setting-row">
                                        <label className="row-title" htmlFor="province-ghtk">Tỉnh/Thành phố: </label>
                                        <input
                                            type="text" className="form-control"
                                            id="province-ghtk" name="province-ghtk"
                                            placeholder="Tỉnh/thành phố"
                                            defaultValue={provinceGHTK.ProvinceName || provinceGHTK}
                                            disabled={disableGHTK}
                                        />
                                    </div>
                                    <div className="setting-row">
                                        <label className="row-title" htmlFor="district-ghtk">Quận/Huyện: </label>
                                        <input
                                            type="text" className="form-control"
                                            id="district-ghtk" name="district-ghtk"
                                            placeholder="Quận/huyện"
                                            defaultValue={districtGHTK.DistrictName || districtGHTK}
                                            disabled={disableGHTK}
                                        />
                                    </div>
                                    <div className="setting-row">
                                        <label className="row-title" htmlFor="ward-ghtk">Phường/Xã: </label>
                                        <input
                                            type="text" className="form-control"
                                            id="ward-ghtk" name="ward-ghtk"
                                            placeholder="Phường/xã"
                                            defaultValue={wardGHTK.WardName || wardGHTK}
                                            disabled={disableGHTK}
                                        />
                                    </div>

                                    <div className="setting-row">
                                        <label className="row-title" htmlFor="street-ghtk">Tòa nhà, tên đường: </label>
                                        <input
                                            type="text" className="form-control"
                                            id="street-ghtk" name="street_name"
                                            placeholder="Tòa nhà, Tên đường..."
                                            value={streetGHTK} onChange={e => setStreetGHTK(e.target.value)}
                                            disabled={disableGHTK}
                                        />
                                    </div>
                                </>
                                :
                                <>
                                    <div className="setting-row">
                                        <label className="row-title" htmlFor="province-ghtk">Tỉnh/Thành phố: </label>
                                        <Dropdown
                                            id="province-ghtk"
                                            value={provinceGHTK}
                                            onChange={onChangeProvinceGHTK}
                                            options={provinces}
                                            optionLabel="ProvinceName"
                                            filter showClear
                                            filterBy="ProvinceName"
                                            placeholder="Chọn tỉnh/thành phố"
                                            disabled={disableGHTK}
                                        />
                                    </div>
                                    <div className="setting-row">
                                        <label className="row-title" htmlFor="district-ghtk">Quận/Huyện: </label>
                                        <Dropdown
                                            id="district-ghtk"
                                            value={districtGHTK}
                                            onChange={onChangeDistrictGHTK}
                                            options={districtsGHTK}
                                            optionLabel="DistrictName"
                                            filter showClear
                                            filterBy="DistrictName"
                                            placeholder="Chọn quận/huyện"
                                            disabled={!provinceGHTK || disableGHTK}
                                        />
                                    </div>
                                    <div className="setting-row">
                                        <label className="row-title" htmlFor="ward-ghtk">Phường/Xã: </label>
                                        <Dropdown
                                            id="ward-ghtk"
                                            value={wardGHTK}
                                            onChange={e => setWardGHTK(e.value)}
                                            options={wardsGHTK}
                                            optionLabel="WardName"
                                            filter showClear
                                            filterBy="WardName"
                                            placeholder="Chọn phường/xã"
                                            disabled={!districtGHTK || disableGHTK}
                                        />
                                    </div>

                                    <div className="setting-row">
                                        <label className="row-title" htmlFor="street-ghtk">Tòa nhà, tên đường: </label>
                                        <input
                                            type="text" className="form-control"
                                            id="street-ghtk" name="street_name"
                                            placeholder="Tòa nhà, Tên đường..."
                                            value={streetGHTK} onChange={e => setStreetGHTK(e.target.value)}
                                            disabled={disableGHTK}
                                        />
                                    </div>
                                </>
                        }

                        <div className="setting-row-button">
                            <button className="btn btn-cancel mr-4" onClick={initValue}>Hủy bỏ</button>
                            {
                                loadingGHTK
                                    ?
                                    <button type="button" className="btn btn-save" disabled="disabled"><i className="fa fa-spinner fa-spin mr-2" aria-hidden></i>Xử lí...</button>
                                    :
                                    <button className="btn btn-save" onClick={saveGHTK}>Lưu lại</button>
                            }
                        </div>
                    </div>
                </div>

                <div className="shipping-setting-row">
                    <div className="setting-row-header">Nhận hàng tại shop:</div>
                    <div className="setting-row-container">
                        <Switch
                            id="active-ghn"
                            onChange={setActiveLocal}
                            value={activeLocal}
                            styles={{
                                track: {
                                    backgroundColor: 'gray'
                                },
                                trackChecked: {
                                    backgroundColor: '#00a23b'
                                },
                                button: {
                                    backgroundColor: '#fff'
                                },
                                buttonChecked: {
                                    backgroundColor: '#fff'
                                }
                            }}
                        />
                        <div className="setting-row">
                            <label className="row-title" htmlFor="address-local">Địa chỉ: </label>
                            <textarea
                                type="text" className="form-control"
                                id="address-local" name="address_local"
                                placeholder="Nhập địa chỉ..." rows={5}
                                value={addressLocal}
                                onChange={e => setAddressLocal(e.target.value)}
                            />
                        </div>

                        <div className="setting-row-button">
                            <button className="btn btn-cancel mr-4" onClick={initValue}>Hủy bỏ</button>
                            {
                                loadingLocal
                                    ?
                                    <button type="button" className="btn btn-save" disabled="disabled"><i className="fa fa-spinner fa-spin mr-2" aria-hidden></i>Xử lí...</button>
                                    :
                                    <button className="btn btn-save" onClick={saveLocal}>Lưu lại</button>
                            }
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
    )
}

// export async function getServerSideProps(ctx) {
    
// }

export default UpdateInformationShop
