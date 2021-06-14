import Head from 'next/head';
import { Dropdown } from 'primereact/dropdown';
import LoadingBar from "react-top-loading-bar";
import { Calendar } from 'primereact/calendar';
import { useRef, useState } from 'react';
import api from './../../utils/backend-api.utils';
import * as common from './../../utils/common.utils';
import * as validate from './../../utils/validate.utils';
import cookie from 'cookie';
import { ListProperties, PropertyDefaultAuction } from './../../models/category.model';
import classNames from 'classnames';
import { InputNumber } from 'primereact/inputnumber';
import { useRouter } from 'next/router';

const AddNewAuction = (props) => {
    const router = useRouter();
    const [ghnChecked, setGHNChecked] = useState(false);
    const [ghtkChecked, setGHTKChecked] = useState(false);
    const [notDeliveryChecked, setNotDeliveryChecked] = useState(false);
    const { categories, brands } = props;
    const [category, setCategory] = useState(null);
    const [brand, setBrand] = useState(null);
    const [showProperty, setShowProperty] = useState(false);
    const [showError, setShowError] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [attributes, setAttributes] = useState([]);
    const [propertyDefault, setPropertyDefault] = useState(new PropertyDefaultAuction());
    const [information, setInformation] = useState({});
    const inputCoverImage = useRef(null);
    const image1 = useRef(null);
    const image2 = useRef(null);
    const image3 = useRef(null);
    const image4 = useRef(null);
    const image5 = useRef(null);
    const image6 = useRef(null);
    const image7 = useRef(null);
    const image8 = useRef(null);
    const [images, setImages] = useState({
        coverImage: null,
        image1: null,
        image2: null,
        image3: null,
        image4: null,
        image5: null,
        image6: null,
        image7: null,
        image8: null,
    })
    const [urlImages, setUrlImages] = useState({
        coverImage: "",
        image1: "",
        image2: "",
        image3: "",
        image4: "",
        image5: "",
        image6: "",
        image7: "",
        image8: "",
    })
    const inputVideo = useRef(null);
    const refLoadingBar = useRef(null);

    const changeInput = (e) => {
        const { value, name } = e.target;
        setPropertyDefault((preState) => {
            return {
                ...preState,
                [name]: value
            }
        })
    }

    const onChangeInformation = (e) => {
        const { name, value } = e.target;
        setInformation((prevState) => {
            return {
                ...prevState,
                [name]: value
            }
        })
    }

    const onChangeCategory = async (e) => {
        const { value } = e.target;
        if (!value) {
            setCategory(null);
            setShowProperty(false);
            return;
        }
        setCategory(null);
        setShowProperty(false);
        setInformation((prevState) => {
            return {}
        })
        setCategory(value);
        refLoadingBar.current.continuousStart();

        try {
            const res = await api.category.getDetail(value.id);

            refLoadingBar.current.complete();

            if (res.status === 200) {
                if (res.data.code === 200) {
                    let listAttribute = [];
                    let listKey = Object.keys(res.data.result.information);
                    ListProperties.forEach(x => {
                        if (listKey.includes(x.key)) {
                            listAttribute.push(x);
                        }
                    })
                    setAttributes([...listAttribute]);
                    setShowProperty(true);
                }
            }
        } catch (error) {
            refLoadingBar.current.complete();
            common.Toast(error, 'error');
        }
    }

    const onChangeBrand = (e) => {
        const { value } = e.target;
        setBrand(value);
    }

    const addCoverImage = () => {
        inputCoverImage.current.click();
    }

    const selectCoverImage = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (!file) return;
        let tempImages = images;
        tempImages.coverImage = file;
        setImages(tempImages);

        let tempUrl = urlImages;
        tempUrl.coverImage = URL.createObjectURL(file);
        setUrlImages({ ...tempUrl });
        URL.revokeObjectURL(file);
    }

    const addVideo = () => {
        inputVideo.current.click();
    }

    const selectVideo = (e) => {
        console.log(e.target.files.length);
    }

    const createProduct = async (e) => {
        e.preventDefault();
        setShowError(true);

        if (validate.checkEmptyInput(propertyDefault.name)
            || propertyDefault.name.length > 200
            || validate.checkEmptyInput(category.name)
            || validate.checkEmptyInput(propertyDefault.description)
            || propertyDefault.description.length > 3000
            || validate.checkEmptyInput(propertyDefault.price)
            || validate.checkEmptyInput(propertyDefault.oldPrice)
            || validate.checkEmptyInput(propertyDefault.sku)
            || validate.checkEmptyInput(propertyDefault.restWarrantyTime)
            || validate.checkEmptyInput(propertyDefault.countProduct)
            || validate.checkEmptyInput(brand ? brand.name : "")
            || !validateImage()
            || validate.checkEmptyInput(propertyDefault.length)
            || validate.checkEmptyInput(propertyDefault.height)
            || validate.checkEmptyInput(propertyDefault.width)
            || validate.checkEmptyInput(propertyDefault.weight)
            || validate.checkEmptyInput(propertyDefault.countDown)
            || !checkSettingDelivery()
            || (checkSettingDelivery() && !ghnChecked && !ghtkChecked && !notDeliveryChecked)
        ) {
            return;
        }

        let checkValidate = true;
        Object.keys(information).forEach(key => {
            if (validate.checkEmptyInput(information[key]))
                checkValidate = false;
        })

        if (!checkValidate) return;

        setLoading(true);
        refLoadingBar.current.continuousStart();

        try {
            let formData = new FormData();
            formData.append("name", propertyDefault.name);
            formData.append("categoryId", category.id);
            formData.append("description", propertyDefault.description);
            formData.append("price", propertyDefault.price);
            formData.append("oldPrice", propertyDefault.oldPrice);
            formData.append("sku", propertyDefault.sku);
            formData.append("restWarrantyTime", (new Date(propertyDefault.restWarrantyTime)).toISOString());
            formData.append("countProduct", propertyDefault.countProduct);
            formData.append("note", propertyDefault.note);
            formData.append("brandId", brand.id);
            formData.append("weight", propertyDefault.weight);
            formData.append("length", propertyDefault.length);
            formData.append("width", propertyDefault.width);
            formData.append("height", propertyDefault.height);
            formData.append("countDown", propertyDefault.countDown);
            let delivery = [];
            if (ghnChecked) delivery.push({ ghn: props.settingShippingArray.ghn });
            if (ghtkChecked) delivery.push({ ghtk: props.settingShippingArray.ghtk });
            if (notDeliveryChecked) delivery.push({ local: props.settingShippingArray.local });
            formData.append("deliverArray", JSON.stringify(delivery));

            if (images.coverImage)
                formData.append("image", images.coverImage);
            if (images.image1)
                formData.append("image", images.image1);
            if (images.image2)
                formData.append("image", images.image2);
            if (images.image3)
                formData.append("image", images.image3);
            if (images.image4)
                formData.append("image", images.image4);
            if (images.image5)
                formData.append("image", images.image5);
            if (images.image6)
                formData.append("image", images.image6);
            if (images.image7)
                formData.append("image", images.image7);
            if (images.image8)
                formData.append("image", images.image8);
            formData.append("information", JSON.stringify(information))

            const res = await api.auction.postCreate(formData);

            setLoading(false);
            refLoadingBar.current.complete();

            if (res.status === 200) {
                if (res.data.code === 200) {
                    common.Toast("Tạo sản phẩm thành công", "success")
                        .then(() => router.push('/auction'));
                } else {
                    const message = res.data.message || "Tạo sản phẩm thất bại";
                    common.Toast(message, "error");
                }
            }
        } catch (error) {
            setLoading(false);
            refLoadingBar.current.complete();
            common.Toast(error, 'error');
        }
    }

    const addImage1 = () => {
        image1.current.click();
    }

    const selectImage1 = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (!file) return;
        let tempImages = images;
        tempImages.image1 = file;
        setImages(tempImages);

        let tempUrl = urlImages;
        tempUrl.image1 = URL.createObjectURL(file);
        setUrlImages({ ...tempUrl });
        URL.revokeObjectURL(file);
    }

    const addImage2 = () => {
        image2.current.click();
    }

    const selectImage2 = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (!file) return;
        let tempImages = images;
        tempImages.image2 = file;
        setImages(tempImages);

        let tempUrl = urlImages;
        tempUrl.image2 = URL.createObjectURL(file);
        setUrlImages({ ...tempUrl });
        URL.revokeObjectURL(file);
    }

    const addImage3 = () => {
        image3.current.click();
    }

    const selectImage3 = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (!file) return;
        let tempImages = images;
        tempImages.image3 = file;
        setImages(tempImages);

        let tempUrl = urlImages;
        tempUrl.image3 = URL.createObjectURL(file);
        setUrlImages({ ...tempUrl });
        URL.revokeObjectURL(file);
    }

    const addImage4 = () => {
        image4.current.click();
    }

    const selectImage4 = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (!file) return;
        let tempImages = images;
        tempImages.image4 = file;
        setImages(tempImages);

        let tempUrl = urlImages;
        tempUrl.image4 = URL.createObjectURL(file);
        setUrlImages({ ...tempUrl });
        URL.revokeObjectURL(file);
    }

    const addImage5 = () => {
        image5.current.click();
    }

    const selectImage5 = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (!file) return;
        let tempImages = images;
        tempImages.image5 = file;
        setImages(tempImages);

        let tempUrl = urlImages;
        tempUrl.image5 = URL.createObjectURL(file);
        setUrlImages({ ...tempUrl });
        URL.revokeObjectURL(file);
    }

    const addImage6 = () => {
        image6.current.click();
    }

    const selectImage6 = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (!file) return;
        let tempImages = images;
        tempImages.image6 = file;
        setImages(tempImages);

        let tempUrl = urlImages;
        tempUrl.image6 = URL.createObjectURL(file);
        setUrlImages({ ...tempUrl });
        URL.revokeObjectURL(file);
    }

    const addImage7 = () => {
        image7.current.click();
    }

    const selectImage7 = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (!file) return;
        let tempImages = images;
        tempImages.image7 = file;
        setImages(tempImages);

        let tempUrl = urlImages;
        tempUrl.image7 = URL.createObjectURL(file);
        setUrlImages({ ...tempUrl });
        URL.revokeObjectURL(file);
    }

    const addImage8 = () => {
        image8.current.click();
    }

    const selectImage8 = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (!file) return;
        let tempImages = images;
        tempImages.image8 = file;
        setImages(tempImages);

        let tempUrl = urlImages;
        tempUrl.image8 = URL.createObjectURL(file);
        setUrlImages({ ...tempUrl });
        URL.revokeObjectURL(file);
    }

    const deleteCoverImage = () => {
        let tempImages = images;
        tempImages.coverImage = null;
        setImages({ ...tempImages });

        let tempUrl = urlImages;
        tempUrl.coverImage = "";
        setUrlImages({ ...tempUrl });
    }

    const deleteImage1 = () => {
        let tempImages = images;
        tempImages.image1 = null;
        setImages({ ...tempImages });

        let tempUrl = urlImages;
        tempUrl.image1 = "";
        setUrlImages({ ...tempUrl });
    }

    const deleteImage2 = () => {
        let tempImages = images;
        tempImages.image2 = null;
        setImages({ ...tempImages });

        let tempUrl = urlImages;
        tempUrl.image2 = "";
        setUrlImages({ ...tempUrl });
    }

    const deleteImage3 = () => {
        let tempImages = images;
        tempImages.image3 = null;
        setImages({ ...tempImages });

        let tempUrl = urlImages;
        tempUrl.image3 = "";
        setUrlImages({ ...tempUrl });
    }

    const deleteImage4 = () => {
        let tempImages = images;
        tempImages.image4 = null;
        setImages({ ...tempImages });

        let tempUrl = urlImages;
        tempUrl.image4 = "";
        setUrlImages({ ...tempUrl });
    }

    const deleteImage5 = () => {
        let tempImages = images;
        tempImages.image5 = null;
        setImages({ ...tempImages });

        let tempUrl = urlImages;
        tempUrl.image5 = "";
        setUrlImages({ ...tempUrl });
    }

    const deleteImage6 = () => {
        let tempImages = images;
        tempImages.image6 = null;
        setImages({ ...tempImages });

        let tempUrl = urlImages;
        tempUrl.image6 = "";
        setUrlImages({ ...tempUrl });
    }

    const deleteImage7 = () => {
        let tempImages = images;
        tempImages.image7 = null;
        setImages({ ...tempImages });

        let tempUrl = urlImages;
        tempUrl.image7 = "";
        setUrlImages({ ...tempUrl });
    }

    const deleteImage8 = () => {
        let tempImages = images;
        tempImages.image8 = null;
        setImages({ ...tempImages });

        let tempUrl = urlImages;
        tempUrl.image8 = "";
        setUrlImages({ ...tempUrl });
    }

    const validateImage = () => {
        let num = 0;
        Object.keys(urlImages).forEach(x => {
            num += urlImages[x] ? 1 : 0;
        })
        return num >= 4;
    }

    const checkSettingDelivery = () => {
        return !(!props.settingShippingArray || (!props.settingShippingArray.ghn && !props.settingShippingArray.ghtk && !props.settingShippingArray.local)
            || (!props.settingShippingArray.local.isChoose && !props.settingShippingArray.ghn.isChoose && !props.settingShippingArray.ghtk.isChoose));
    }

    return (
        <div className="product-add-new">
            <Head>
                <title>Thêm mới sản phẩm</title>
            </Head>
            <LoadingBar color="#00ac96" ref={refLoadingBar} onLoaderFinished={() => { }} />
            <div className="product-add-new-container">
                <div className="title">
                    Thêm mới sản phẩm
                </div>
                <hr />

                <div className="form-input">
                    <div className="form-group row align-items-center d-flex">
                        <label htmlFor="name" className="col-sm-2 col-form-label">Tên sản phẩm*:</label>
                        <div className="col-sm-6">
                            <div className="input-group">
                                <input className={classNames("form-control", { "is-invalid": (validate.checkEmptyInput(propertyDefault.name) || (propertyDefault.name.length > 200)) && showError })} name="name" id="name" placeholder="Nhập tên sản phẩm" type="text" onChange={changeInput} value={propertyDefault.name} />
                                <span className="input-group-addon">{`${propertyDefault.name.length}/200`}</span>
                            </div>
                            {
                                validate.checkEmptyInput(propertyDefault.name) && showError &&
                                <div className="invalid-feedback text-left">
                                    Tên sản phẩm không được trống.
                                </div>
                            }
                            {
                                (propertyDefault.name.length > 200) && showError &&
                                <div className="invalid-feedback text-left">
                                    Tên sản phẩm không dài quá 200 kí tự.
                                </div>
                            }
                        </div>
                    </div>
                    <div className="select-category">
                        <div className="select-category-title">
                            Chọn danh mục sản phẩm*:
                        </div>
                        <div className="select-category-content">
                            <div className="align-items-center d-flex input-category row">
                                <label htmlFor="category" className="col-sm-2 col-form-label">Chọn danh mục: </label>
                                <div className="col-sm-6 px-0">
                                    <Dropdown value={category} options={categories} onChange={onChangeCategory} optionLabel="name" filter showClear filterBy="name" placeholder="Chọn danh mục" id="category"
                                        className={classNames({ 'p-invalid': validate.checkEmptyInput(category ? category.name : "") && showError })}
                                    />
                                    {
                                        validate.checkEmptyInput(category ? category.name : "") && showError &&
                                        <div className="invalid-feedback text-left">
                                            Danh mục không được trống.
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="select-category-result row">
                                <div className="col-sm-2">
                                    Danh mục đã chọn:
                                </div>
                                <div className="col-sm-6 px-0">
                                    {category ? category.name : ""}
                                </div>
                            </div>
                        </div>
                    </div>

                    {
                        showProperty &&
                        <div>
                            <div className="form-group row">
                                <label htmlFor="description" className="col-sm-2 col-form-label">Mô tả sản phẩm*: </label>
                                <div className="col-sm-6">
                                    <textarea className={classNames("form-control", { "is-invalid": (validate.checkEmptyInput(propertyDefault.description) || (propertyDefault.description.length > 3000)) && showError })} placeholder="Mô tả sản phẩm" rows="8" name="description" id="description" onChange={changeInput} value={propertyDefault.description}></textarea>
                                    {
                                        validate.checkEmptyInput(propertyDefault.description) && showError &&
                                        <div className="invalid-feedback text-left">
                                            Mô tả không được trống.
                                        </div>
                                    }
                                    {
                                        (propertyDefault.description.length > 3000) && showError &&
                                        <div className="invalid-feedback text-left">
                                            Mô tả không dài quá 3000 kí tự.
                                        </div>
                                    }
                                    <div className="text-right mt-1">
                                        {`${propertyDefault.description.length}/3000`}
                                    </div>
                                </div>
                            </div>

                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="price" className="col-sm-2 col-form-label">Giá bán*: </label>
                                <div className="col-sm-6">
                                    <div className="input-group">
                                        <InputNumber name="price" id="price" placeholder="Nhập giá sản phẩm" onValueChange={(e) => changeInput(e)} value={propertyDefault.price}
                                            className={classNames({ 'p-invalid': validate.checkEmptyInput(propertyDefault.price) && showError })}
                                        />
                                        <span className="input-group-addon">vnđ</span>
                                    </div>
                                    {
                                        validate.checkEmptyInput(propertyDefault.price) && showError &&
                                        <div className="invalid-feedback text-left">
                                            Giá bán không được trống.
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="oldPrice" className="col-sm-2 col-form-label">Giá mua ban đầu*: </label>
                                <div className="col-sm-6">
                                    <div className="input-group">
                                        <InputNumber name="oldPrice" id="oldPrice" placeholder="Nhập giá mua ban đầu" onValueChange={(e) => changeInput(e)} value={propertyDefault.oldPrice}
                                            className={classNames({ 'p-invalid': validate.checkEmptyInput(propertyDefault.oldPrice) && showError })}
                                        />
                                        <span className="input-group-addon">vnđ</span>
                                    </div>
                                    {
                                        validate.checkEmptyInput(propertyDefault.oldPrice) && showError &&
                                        <div className="invalid-feedback text-left">
                                            Giá mua không được trống.
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="form-group row align-items-center d-flex input-brand">
                                <label htmlFor="brand" className="col-sm-2 col-form-label">Chọn thương hiệu*: </label>
                                <div className="col-sm-6">
                                    <Dropdown value={brand} options={brands} onChange={onChangeBrand} optionLabel="name" filter showClear filterBy="name" placeholder="Chọn thương hiệu" id="brand"
                                        className={classNames({ 'p-invalid': validate.checkEmptyInput(brand ? brand.name : "") && showError })}
                                    />
                                    {
                                        validate.checkEmptyInput(brand ? brand.name : "") && showError &&
                                        <div className="invalid-feedback text-left">
                                            Thương hiệu không được trống.
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="sku" className="col-sm-2 col-form-label">SKU*: </label>
                                <div className="col-sm-6">
                                    <input className={classNames("form-control", { 'is-invalid': validate.checkEmptyInput(propertyDefault.sku) && showError })} placeholder="Nhập sku" type="text" name="sku" id="=sku" onChange={changeInput} value={propertyDefault.sku} />
                                    {
                                        validate.checkEmptyInput(propertyDefault.sku) && showError &&
                                        <div className="invalid-feedback text-left">
                                            SKU không được trống.
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="restWarrantyTime" className="col-sm-2 col-form-label">Ngày hết hạn bảo hành*: </label>
                                <div className="col-sm-6">
                                    <Calendar id="date" value={propertyDefault.restWarrantyTime} onChange={changeInput} dateFormat="dd/mm/yy" mask="99/99/9999" showIcon placeholder="Ngày hết hạn bảo hành" name="restWarrantyTime" id="restWarrantyTime"
                                        className={classNames({ 'p-invalid': validate.checkEmptyInput(propertyDefault.restWarrantyTime) && showError })}
                                    />
                                    {
                                        validate.checkEmptyInput(propertyDefault.restWarrantyTime) && showError &&
                                        <div className="invalid-feedback text-left">
                                            Ngày hết hạn bảo hành không được trống.
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="countProduct" className="col-sm-2 col-form-label">Số lượng*: </label>
                                <div className="col-sm-6">
                                    <input placeholder="Nhập số lượng sản phẩm" type="number" name="countProduct" id="=countProduct" onChange={changeInput} value={propertyDefault.countProduct}
                                        className={classNames('form-control', { 'is-invalid': validate.checkEmptyInput(propertyDefault.countProduct) && showError })}
                                    />
                                    {
                                        validate.checkEmptyInput(propertyDefault.countProduct) && showError &&
                                        <div className="invalid-feedback text-left">
                                            Số lượng lớn hơn 0.
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="countProduct" className="col-sm-2 col-form-label">Cân nặng*: </label>
                                <div className="col-sm-6">
                                    <div className="input-group">
                                        <InputNumber name="weight" id="weight" placeholder="Nhập cân nặng" onValueChange={(e) => changeInput(e)} value={propertyDefault.weight}
                                            className={classNames({ 'p-invalid': validate.checkEmptyInput(propertyDefault.weight) && showError })}
                                            mode="decimal" minFractionDigits={1} maxFractionDigits={2}
                                        />
                                        <span className="input-group-addon">gram</span>
                                    </div>
                                    {
                                        validate.checkEmptyInput(propertyDefault.weight) && showError &&
                                        <div className="invalid-feedback text-left">
                                            Cân nặng lớn hơn 0.
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="countProduct" className="col-sm-2 col-form-label">Chiều dài*: </label>
                                <div className="col-sm-6">
                                    <div className="input-group">
                                        <InputNumber name="length" id="length" placeholder="Nhập chiều dài" onValueChange={(e) => changeInput(e)} value={propertyDefault.length}
                                            className={classNames({ 'p-invalid': validate.checkEmptyInput(propertyDefault.length) && showError })}
                                            mode="decimal" minFractionDigits={1} maxFractionDigits={2}
                                        />
                                        <span className="input-group-addon">cm</span>
                                    </div>
                                    {
                                        validate.checkEmptyInput(propertyDefault.length) && showError &&
                                        <div className="invalid-feedback text-left">
                                            Chiều dài lớn hơn 0.
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="countProduct" className="col-sm-2 col-form-label">Chiều rộng*: </label>
                                <div className="col-sm-6">
                                    <div className="input-group">
                                        <InputNumber name="width" id="width" placeholder="Nhập chiều rộng" onValueChange={(e) => changeInput(e)} value={propertyDefault.width}
                                            className={classNames({ 'p-invalid': validate.checkEmptyInput(propertyDefault.width) && showError })}
                                            mode="decimal" minFractionDigits={1} maxFractionDigits={2}
                                        />
                                        <span className="input-group-addon">cm</span>
                                    </div>
                                    {
                                        validate.checkEmptyInput(propertyDefault.width) && showError &&
                                        <div className="invalid-feedback text-left">
                                            Chiều rộng lớn hơn 0.
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="countProduct" className="col-sm-2 col-form-label">Chiều cao*: </label>
                                <div className="col-sm-6">
                                    <div className="input-group">
                                        <InputNumber name="height" id="height" placeholder="Nhập chiều cao" onValueChange={(e) => changeInput(e)} value={propertyDefault.height}
                                            className={classNames({ 'p-invalid': validate.checkEmptyInput(propertyDefault.height) && showError })}
                                            mode="decimal" minFractionDigits={1} maxFractionDigits={2}
                                        />
                                        <span className="input-group-addon">cm</span>
                                    </div>
                                    {
                                        validate.checkEmptyInput(propertyDefault.height) && showError &&
                                        <div className="invalid-feedback text-left">
                                            Chiều cao lớn hơn 0.
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="countProduct" className="col-sm-2 col-form-label">Thời gian đấu giá*: </label>
                                <div className="col-sm-6">
                                    <div className="input-group">
                                        <InputNumber name="countDown" id="countDown" placeholder="Nhập thời gian" onValueChange={(e) => changeInput(e)} value={propertyDefault.countDown}
                                            className={classNames({ 'p-invalid': validate.checkEmptyInput(propertyDefault.countDown) && showError })}
                                        />
                                        <span className="input-group-addon">giây</span>
                                    </div>
                                    {
                                        validate.checkEmptyInput(propertyDefault.countDown) && showError &&
                                        <div className="invalid-feedback text-left">
                                            Thời gian đấu giá phải lớn hơn 0.
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="note" className="col-sm-2 col-form-label">Lưu ý: </label>
                                <div className="col-sm-6">
                                    <textarea className="form-control" placeholder="Nhập lưu ý" rows="8" name="note" id="note" onChange={changeInput} value={propertyDefault.note}></textarea>
                                    <div className="text-right mt-1">
                                        {`${propertyDefault.note.length}/3000`}
                                    </div>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="name-product" className="col-sm-2 col-form-label">Hình ảnh (ít nhất 4 hình ảnh): {!validateImage() && showError && <span className="invalid-feedback text-left">Sản phẩm phải có ít nhất 4 hình ảnh minh họa.</span>}</label>
                                <div className="col-sm-6 d-flex flex-row flex-wrap">
                                    <div className="d-flex flex-column add-image-container">
                                        <div className={classNames("add-image-box")}>
                                            {
                                                urlImages.coverImage === "" &&
                                                <>
                                                    <div className={classNames("add-image-circle")}>
                                                        <input type="file" accept="image/*" ref={inputCoverImage} onChange={selectCoverImage} />
                                                        <i className="fa fa-plus" aria-hidden onClick={addCoverImage}></i>
                                                    </div>
                                                </>
                                            }
                                            {
                                                urlImages.coverImage !== "" &&
                                                <>
                                                    <img src={urlImages.coverImage} alt="Cover Image" />
                                                    <i className="fa fa-trash" aria-hidden onClick={() => deleteCoverImage()}></i>
                                                </>
                                            }
                                        </div>
                                        <div className="text-center mt-2">
                                            Hình ảnh 0
                                        </div>
                                    </div>
                                    <div className="d-flex flex-column add-image-container mb-4">
                                        <div className="add-image-box">
                                            {
                                                urlImages.image1 === "" &&
                                                <>
                                                    <div className={classNames("add-image-circle")}>
                                                        <input type="file" accept="image/*" ref={image1} onChange={selectImage1} />
                                                        <i className="fa fa-plus" aria-hidden onClick={addImage1}></i>
                                                    </div>
                                                </>
                                            }
                                            {
                                                urlImages.image1 !== "" &&
                                                <>
                                                    <img src={urlImages.image1} alt="Image 1" />
                                                    <i className="fa fa-trash" aria-hidden onClick={() => deleteImage1()}></i>
                                                </>
                                            }
                                        </div>
                                        <div className="text-center mt-2">
                                            Hình ảnh 1
                                        </div>
                                    </div>
                                    <div className="d-flex flex-column add-image-container mb-4">
                                        <div className="add-image-box">
                                            {
                                                urlImages.image2 === "" &&
                                                <>
                                                    <div className={classNames("add-image-circle")}>
                                                        <input type="file" accept="image/*" ref={image2} onChange={selectImage2} />
                                                        <i className="fa fa-plus" aria-hidden onClick={addImage2}></i>
                                                    </div>
                                                </>
                                            }
                                            {
                                                urlImages.image2 !== "" &&
                                                <>
                                                    <img src={urlImages.image2} alt="Image 2" />
                                                    <i className="fa fa-trash" aria-hidden onClick={() => deleteImage2()}></i>
                                                </>
                                            }
                                        </div>
                                        <div className="text-center mt-2">
                                            Hình ảnh 2
                                        </div>
                                    </div>
                                    <div className="d-flex flex-column add-image-container mb-4">
                                        <div className="add-image-box">
                                            {
                                                urlImages.image3 === "" &&
                                                <>
                                                    <div className={classNames("add-image-circle")}>
                                                        <input type="file" accept="image/*" ref={image3} onChange={selectImage3} />
                                                        <i className="fa fa-plus" aria-hidden onClick={addImage3}></i>
                                                    </div>
                                                </>
                                            }
                                            {
                                                urlImages.image3 !== "" &&
                                                <>
                                                    <img src={urlImages.image3} alt="Image 1" />
                                                    <i className="fa fa-trash" aria-hidden onClick={() => deleteImage3()}></i>
                                                </>
                                            }
                                        </div>
                                        <div className="text-center mt-2">
                                            Hình ảnh 3
                                        </div>
                                    </div>
                                    <div className="d-flex flex-column add-image-container mb-4">
                                        <div className="add-image-box">
                                            {
                                                urlImages.image4 === "" &&
                                                <>
                                                    <div className={classNames("add-image-circle")}>
                                                        <input type="file" accept="image/*" ref={image4} onChange={selectImage4} />
                                                        <i className="fa fa-plus" aria-hidden onClick={addImage4}></i>
                                                    </div>
                                                </>
                                            }
                                            {
                                                urlImages.image4 !== "" &&
                                                <>
                                                    <img src={urlImages.image4} alt="Image 1" />
                                                    <i className="fa fa-trash" aria-hidden onClick={() => deleteImage4()}></i>
                                                </>
                                            }
                                        </div>
                                        <div className="text-center mt-2">
                                            Hình ảnh 4
                                        </div>
                                    </div>
                                    <div className="d-flex flex-column add-image-container mb-4">
                                        <div className="add-image-box">
                                            {
                                                urlImages.image5 === "" &&
                                                <>
                                                    <div className={classNames("add-image-circle")}>
                                                        <input type="file" accept="image/*" ref={image5} onChange={selectImage5} />
                                                        <i className="fa fa-plus" aria-hidden onClick={addImage5}></i>
                                                    </div>
                                                </>
                                            }
                                            {
                                                urlImages.image5 !== "" &&
                                                <>
                                                    <img src={urlImages.image5} alt="Image 1" />
                                                    <i className="fa fa-trash" aria-hidden onClick={() => deleteImage5()}></i>
                                                </>
                                            }
                                        </div>
                                        <div className="text-center mt-2">
                                            Hình ảnh 5
                                        </div>
                                    </div>
                                    <div className="d-flex flex-column add-image-container mb-4">
                                        <div className="add-image-box">
                                            {
                                                urlImages.image6 === "" &&
                                                <>
                                                    <div className={classNames("add-image-circle")}>
                                                        <input type="file" accept="image/*" ref={image6} onChange={selectImage6} />
                                                        <i className="fa fa-plus" aria-hidden onClick={addImage6}></i>
                                                    </div>
                                                </>
                                            }
                                            {
                                                urlImages.image6 !== "" &&
                                                <>
                                                    <img src={urlImages.image6} alt="Image 1" />
                                                    <i className="fa fa-trash" aria-hidden onClick={() => deleteImage6()}></i>
                                                </>
                                            }
                                        </div>
                                        <div className="text-center mt-2">
                                            Hình ảnh 6
                                        </div>
                                    </div>
                                    <div className="d-flex flex-column add-image-container mb-4">
                                        <div className="add-image-box">
                                            {
                                                urlImages.image7 === "" &&
                                                <>
                                                    <div className={classNames("add-image-circle")}>
                                                        <input type="file" accept="image/*" ref={image7} onChange={selectImage7} />
                                                        <i className="fa fa-plus" aria-hidden onClick={addImage7}></i>
                                                    </div>
                                                </>
                                            }
                                            {
                                                urlImages.image7 !== "" &&
                                                <>
                                                    <img src={urlImages.image7} alt="Image 1" />
                                                    <i className="fa fa-trash" aria-hidden onClick={() => deleteImage7()}></i>
                                                </>
                                            }
                                        </div>
                                        <div className="text-center mt-2">
                                            Hình ảnh 7
                                        </div>
                                    </div>
                                    <div className="d-flex flex-column add-image-container mb-4">
                                        <div className="add-image-box">
                                            {
                                                urlImages.image8 === "" &&
                                                <>
                                                    <div className={classNames("add-image-circle")}>
                                                        <input type="file" accept="image/*" ref={image8} onChange={selectImage8} />
                                                        <i className="fa fa-plus" aria-hidden onClick={addImage8}></i>
                                                    </div>
                                                </>
                                            }
                                            {
                                                urlImages.image8 !== "" &&
                                                <>
                                                    <img src={urlImages.image8} alt="Image 1" />
                                                    <i className="fa fa-trash" aria-hidden onClick={() => deleteImage8()}></i>
                                                </>
                                            }
                                        </div>
                                        <div className="text-center mt-2">
                                            Hình ảnh 8
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="name-product" className="col-sm-2 col-form-label">Video: </label>
                                <div className="d-flex flex-row flex-wrap align-items-center">
                                    <div className="d-flex flex-column add-video-container">
                                        <div className="add-video-box">
                                            <div className="add-video-circle">
                                                <input type="file" accept="video/*" ref={inputVideo} onChange={selectVideo} />
                                                <i className="fa fa-plus" aria-hidden onClick={addVideo}></i>
                                            </div>
                                        </div>
                                        <div className="text-center mt-2">
                                        </div>
                                    </div>
                                    <div className="d-flex flex-column">
                                        <p>1. Kích thước: Tối đa 30Mb, độ phân giải không vượt quá 1280x1280px</p>
                                        <p>2. Độ dài: 10s-120s</p>
                                        <p>3. Định dạng: MP4</p>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="name-product" className="col-sm-2 col-form-label">Cài đặt vận chuyển*: </label>
                                <div className="col-sm-6">
                                    {
                                        !checkSettingDelivery()
                                            ?
                                            <div className="invalid-feedback text-left">
                                                Vui lòng cài đặt vận chuyển cho sản phẩm ở tab "Cài đặt vận chuyển" trước khi tạo sản phẩm.
                                            </div>
                                            :
                                            <>
                                                {
                                                    props.settingShippingArray.ghn && props.settingShippingArray.ghn.isChoose &&
                                                    <div className="d-flex flex-row align-items-center row mb-3">
                                                        <div className="col-sm-4">Giao hàng nhanh</div>
                                                        <label className="fancy-checkbox">
                                                            <input type="checkbox" onChange={() => setGHNChecked(!ghnChecked)} checked={ghnChecked} />
                                                            <span></span>
                                                        </label>
                                                    </div>
                                                }
                                                {
                                                    props.settingShippingArray.ghtk && props.settingShippingArray.ghtk.isChoose &&
                                                    <div className="d-flex flex-row align-items-center row mb-3">
                                                        <div className="col-sm-4">Giao hàng tiết kiệm</div>
                                                        <label className="fancy-checkbox">
                                                            <input type="checkbox" onChange={() => setGHTKChecked(!ghtkChecked)} checked={ghtkChecked} />
                                                            <span></span>
                                                        </label>
                                                    </div>
                                                }
                                                {
                                                    props.settingShippingArray.local && props.settingShippingArray.local.isChoose &&
                                                    <div className="d-flex flex-row align-items-center row">
                                                        <div className="col-sm-4">Nhận hàng tại shop</div>
                                                        <label className="fancy-checkbox">
                                                            <input type="checkbox" onChange={() => setNotDeliveryChecked(!notDeliveryChecked)} checked={notDeliveryChecked} />
                                                            <span></span>
                                                        </label>
                                                    </div>
                                                }
                                            </>
                                    }
                                </div>
                            </div>

                            {
                                attributes.map(x => {
                                    return (

                                        <div className="form-group row align-items-center d-flex" key={x.key}>
                                            <label htmlFor={x.key} className="col-sm-2 col-form-label">{`${x.name}*:`}</label>
                                            <div className="col-sm-6">
                                                <input
                                                    className={classNames("form-control", { 'is-invalid': validate.checkEmptyInput(information[x.key]) && showError })}
                                                    value={information[x.key] || ""}
                                                    placeholder={`${x.name}`} type="text" name={x.key} id={x.key} onChange={onChangeInformation} />
                                                {
                                                    validate.checkEmptyInput(information[x.key]) && showError &&
                                                    <div className="invalid-feedback text-left">
                                                        {`${x.name} không được trống.`}
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            <div>
                                {
                                    isLoading &&
                                    <button type="button" className="btn button-save" disabled="disabled"><i className="fa fa-spinner fa-spin mr-2" aria-hidden></i>Xử lí...</button>
                                }
                                {
                                    !isLoading &&
                                    <button className="btn button-save" onClick={createProduct}>Lưu lại</button>
                                }
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export async function getServerSideProps(ctx) {
    let categories = [];
    let brands = [];
    let settingShippingArray;
    const cookies = ctx.req.headers.cookie;
    if (cookies) {
        const token = cookie.parse(cookies).seller_token;
        if (token) {
            try {
                const res = await api.category.getList();

                if (res.status === 200) {
                    res.data.list.forEach(x => {
                        let categoryItem = { id: "", name: "" };
                        categoryItem.id = x.childId || "";
                        categoryItem.name = x.childName || "";
                        categories.push(categoryItem);
                    })
                }

                const resBrand = await api.brand.getList(token);

                if (resBrand.status === 200) {
                    if (resBrand.data.code === 200) {
                        const result = resBrand.data.result;
                        result.forEach(x => {
                            let brand = {
                                id: "",
                                name: ""
                            }
                            brand.id = x._id || "";
                            brand.name = x.name || "";
                            brands.push(brand);
                        })
                    }
                }

                const getListShip = await api.deliverySetting.getListShip(token);
                settingShippingArray = getListShip.data.result;

                return {
                    props: { categories: categories, brands: brands, settingShippingArray }
                }
            } catch (err) {
                console.log(err.message);
            }
        } else {
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

export default AddNewAuction;