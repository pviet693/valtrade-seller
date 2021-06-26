import Head from 'next/head';
import { Dropdown } from 'primereact/dropdown';
import LoadingBar from "react-top-loading-bar";
import { useEffect, useRef, useState } from 'react';
import { InputSwitch } from 'primereact/inputswitch';
import api from './../../utils/backend-api.utils';
import * as common from './../../utils/common.utils';
import cookie from "cookie";

const ShippingSetting = ({ provinces, settings }) => {
    const refLoadingBar = useRef(null);

    const [activeGHN, setActiveGHN] = useState(false);
    const [activeGHTK, setActiveGHTK] = useState(false);
    const [activeLocal, setActiveLocal] = useState(false);

    const [province, setProvince] = useState(null);
    const [districts, setDistricts] = useState([]);
    const [district, setDistrict] = useState(null);
    const [wards, setWards] = useState([]);
    const [ward, setWard] = useState(null);
    const [street, setStreet] = useState("");

    const [provinceGHTK, setProvinceGHTK] = useState(null);
    const [districtsGHTK, setDistrictsGHTK] = useState([]);
    const [districtGHTK, setDistrictGHTK] = useState(null);
    const [wardsGHTK, setWardsGHTK] = useState([]);
    const [wardGHTK, setWardGHTK] = useState(null);
    const [streetGHTK, setStreetGHTK] = useState("");

    const [addressLocal, setAddressLocal] = useState("");

    const [loading, setLoading] = useState(false);
    const [loadingGHTK, setLoadingGHTK] = useState(false);
    const [loadingLocal, setLoadingLocal] = useState(false);

    const [disableGHN, setDisableGHN] = useState(false);
    const [disableGHTK, setDisableGHTK] = useState(false);

    const onChangeProvince = async (e) => {
        setProvince(e.value);
        setDistrict(null);
        setWard(null);

        try {
            const res = await api.ghn.getDistrict(e.value.ProvinceID);
            setDistricts(res.data.data);
        } catch (error) {
            common.Toast(error, 'error');
        }
    }

    const onChangeDistrict = async (e) => {
        setDistrict(e.value);
        setWard(null);

        try {
            const res = await api.ghn.getWard(e.value.DistrictID);
            setWards(res.data.data);
        } catch (error) {
            common.Toast(error, 'error');
        }
    }

    const onChangeProvinceGHTK = async (e) => {
        setProvinceGHTK(e.value);
        setDistrictGHTK(null);
        setWardGHTK(null);

        try {
            const res = await api.ghn.getDistrict(e.value.ProvinceID);
            setDistrictsGHTK(res.data.data);
        } catch (error) {
            common.Toast(error, 'error');
        }
    }

    const onChangeDistrictGHTK = async (e) => {
        setDistrictGHTK(e.value);
        setWardGHTK(null);

        try {
            const res = await api.ghn.getWard(e.value.DistrictID);
            setWardsGHTK(res.data.data);
        } catch (error) {
            common.Toast(error, 'error');
        }
    }

    const saveGHN = async () => {
        try {
            setLoading(true);
            refLoadingBar.current.continuousStart();

            let ghn = null;

            if (province && district && ward && street) {
                ghn = !disableGHN
                    ?
                    {
                        province: {
                            province_id: province.ProvinceID,
                            name: province.ProvinceName
                        },
                        district: {
                            district_id: district.DistrictID,
                            name: district.DistrictName
                        },
                        ward: {
                            ward_code: ward.WardCode,
                            name: ward.WardName
                        },
                        isChoose: activeGHN,
                        street: street
                    }
                    :
                    {
                        isChoose: activeGHN
                    }
            } else {
                return;
            }

            let body = {};

            if (ghn) { body["ghn"] = ghn; }

            const res = await api.deliverySetting.postSetting(body);
            setLoading(false);
            refLoadingBar.current.complete();
            if (res.status === 200) {
                common.Toast('Lưu thành công', 'success')
                    .then(() => setDisableGHN(true));
            }
        } catch (error) {
            setLoading(false);
            refLoadingBar.current.complete();
            console.log(error);
        }
    }

    const saveGHTK = async () => {
        try {
            setLoadingGHTK(true);
            refLoadingBar.current.continuousStart();

            let ghtk = null;

            if (provinceGHTK && districtGHTK && wardGHTK && streetGHTK) {
                ghtk = !disableGHTK
                    ?
                    {
                        pick_province: provinceGHTK.ProvinceName,
                        pick_district: districtGHTK.DistrictName,
                        pick_ward: wardGHTK.WardName,
                        isChoose: activeGHTK,
                        street: streetGHTK
                    }
                    :
                    {
                        isChoose: activeGHTK
                    }
            } else {
                return;
            }

            let body = {};

            if (ghtk) { body["ghtk"] = ghtk; }

            const res = await api.deliverySetting.postSetting(body);
            setLoadingGHTK(false);
            refLoadingBar.current.complete();
            if (res.status === 200) {
                common.Toast('Lưu thành công.', 'success')
                    .then(() => setDisableGHTK(true));
            }
        } catch (error) {
            setLoadingGHTK(false);
            refLoadingBar.current.complete();
            console.log(error);
        }
    }

    const saveLocal = async () => {
        try {
            setLoadingLocal(true);
            refLoadingBar.current.continuousStart();

            let local = null;

            if (addressLocal) {
                local = {
                    address: addressLocal,
                    isChoose: activeLocal
                }
            } else {
                return;
            }

            let body = {};

            if (local) { body["local"] = local; }

            const res = await api.deliverySetting.postSetting(body);
            setLoadingLocal(false);
            refLoadingBar.current.complete();
            if (res.status === 200) {
                common.Toast('Lưu thành công.', 'success');
            }
        } catch (error) {
            setLoadingLocal(false);
            refLoadingBar.current.complete();
            console.log(error);
        }
    }

    const initValue = async () => {
        if (settings) {
            console.log(settings);
            if (settings.ghn) {
                try {
                    const resDistrict = await api.ghn.getDistrict(settings.ghn.province.province_id);
                    setDistricts([...resDistrict.data.data]);

                    const resWard = await api.ghn.getWard(settings.ghn.district.district_id);
                    setWards([...resWard.data.data]);

                    setProvince(provinces.filter(x => x.ProvinceID === settings.ghn.province.province_id)[0]);
                    setDistrict(resDistrict.data.data.filter(x => x.DistrictID === settings.ghn.district.district_id)[0]);
                    setWard(resWard.data.data.filter(x => x.WardCode === settings.ghn.ward.ward_code)[0]);
                    setStreet(settings.ghn.street);
                    setActiveGHN(settings.ghn.isChoose);
                } catch (error) {
                    common.Toast(error, 'error');
                }
                setDisableGHN(true);
            }

            if (settings.ghtk) {
                try {
                    setProvinceGHTK(settings.ghtk.pick_province);
                    setDistrictGHTK(settings.ghtk.pick_district);
                    setWardGHTK(settings.ghtk.pick_ward);
                    setStreetGHTK(settings.ghtk.street);
                    setActiveGHTK(settings.ghtk.isChoose);
                } catch (error) {
                    common.Toast(error, 'error');
                }
                setDisableGHTK(true);
            }

            if (settings.local) {
                setAddressLocal(settings.local.address);
                setActiveLocal(settings.local.isChoose);
            }
        }
    }

    useEffect(() => {
        initValue();
    }, [])

    return (
        <div className="shipping">
            <Head>
                <title>Cài đặt vận chuyển</title>
            </Head>
            <LoadingBar color="#00ac96" ref={refLoadingBar} onLoaderFinished={() => { }} />
            <div className="shipping-container">
                <div className="title">
                    Cài đặt vận chuyển
                </div>
                <hr />

                <div className="shipping-setting-row">
                    <div className="setting-row-header">Giao hàng nhanh</div>
                    <div className="setting-row-container">
                        <InputSwitch checked={activeGHN} onChange={() => setActiveGHN(!activeGHN)} />
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
                        <InputSwitch checked={activeGHTK} onChange={() => setActiveGHTK(!activeGHTK)} />
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
                        <InputSwitch checked={activeLocal} onChange={() => setActiveLocal(!activeLocal)} />
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
                </div>
            </div>
        </div>
    )
}

export async function getServerSideProps(ctx) {
    const cookies = ctx.req.headers.cookie;
    if (cookies) {
        const token = cookie.parse(cookies).seller_token;
        if (token) {
            let provinces = [];
            let settings = null;

            try {
                const getProvince = await api.ghn.getProvince();
                provinces = getProvince.data.data;

                const getListShip = await api.deliverySetting.getListShip(token);
                settings = getListShip.data.result;
            } catch (error) {
                console.log(error)
            }

            return {
                props: {
                    provinces: provinces,
                    settings: settings
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

export default ShippingSetting
