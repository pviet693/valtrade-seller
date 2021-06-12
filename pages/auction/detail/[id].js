import Head from 'next/head';
import { Dropdown } from 'primereact/dropdown';
import LoadingBar from "react-top-loading-bar";
import { useRef, useState, useEffect } from 'react';
import api from './../../../utils/backend-api.utils';
import * as common from './../../../utils/common.utils';
import * as validate from './../../../utils/validate.utils';
import { ListProperties, PropertyDefaultAuction } from './../../../models/category.model';
import classNames from 'classnames';
import cookie from "cookie";
import { useRouter } from 'next/router';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';

const AuctionDetail = (props) => {
    const router = useRouter();
    const [ghnChecked, setGHNChecked] = useState(false);
    const [ghtkChecked, setGHTKChecked] = useState(false);
    const [notDeliveryChecked, setNotDeliveryChecked] = useState(false);
    const { categories, auction, accept, imagesUrl, info, attr, brands } = props;
    const [category, setCategory] = useState(auction.category);
    const [brand, setBrand] = useState(props.brand);
    const [showProperty, setShowProperty] = useState(true);
    const [showError, setShowError] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [isDeleteLoading, setDeleteLoading] = useState(false);
    const [attributes, setAttributes] = useState(attr);
    const [propertyDefault, setPropertyDefault] = useState(auction);
    const [information, setInformation] = useState(info);
    const inputCoverImage = useRef(null);
    const image1 = useRef(null);
    const image2 = useRef(null);
    const image3 = useRef(null);
    const image4 = useRef(null);
    const image5 = useRef(null);
    const image6 = useRef(null);
    const image7 = useRef(null);
    const image8 = useRef(null);
    const [urlImages, setUrlImages] = useState(imagesUrl);
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
    const inputVideo = useRef(null);
    const refLoadingBar = useRef(null);

    const changeInput = (e) => {
        const { value, name } = e.target;
        setPropertyDefault({ ...propertyDefault, [name]: value });
    }

    const onChangeInformation = (e) => {
        const { name, value } = e.target;
        let temp = information;
        temp[name] = value;
        setInformation({ ...temp });
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
        tempUrl.coverImage.url = URL.createObjectURL(file);
        setUrlImages({ ...tempUrl });
        URL.revokeObjectURL(file);
    }

    const addVideo = () => {
        inputVideo.current.click();
    }

    const selectVideo = (e) => {
        console.log(e.target.files.length);
    }

    const updateProduct = async (e) => {
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
            || validate.checkEmptyInput(urlImages.coverImage)
            || !validateImage()
            || validate.checkEmptyInput(propertyDefault.length)
            || validate.checkEmptyInput(propertyDefault.height)
            || validate.checkEmptyInput(propertyDefault.width)
            || validate.checkEmptyInput(propertyDefault.weight)
            || validate.checkEmptyInput(propertyDefault.countDown)
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
            formData.append("restWarrantyTime", propertyDefault.restWarrantyTime);
            formData.append("countProduct", propertyDefault.countProduct);
            formData.append("note", propertyDefault.note);
            formData.append("brandId", brand.id);
            formData.append("weight", propertyDefault.weight);
            formData.append("length", propertyDefault.length);
            formData.append("width", propertyDefault.width);
            formData.append("height", propertyDefault.height);
            formData.append("countDown", propertyDefault.countDown);

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

            const res = await api.product.putUpdate(formData, propertyDefault.id);

            setLoading(false);
            refLoadingBar.current.complete();

            if (res.status === 200) {
                if (res.data.code === 200) {
                    common.Toast("Cập nhật sản phẩm thành công", "success")
                        .then(() => router.push('/product'));
                } else {
                    const message = res.data.message || "Cập nhật sản phẩm thất bại";
                    common.Toast(message, "error");
                }
            }
        } catch (error) {
            setLoading(false);
            refLoadingBar.current.complete();
            common.Toast(error, 'error');
        }
    }

    const deleteProduct = () => {
        common.ConfirmDialog('Xác nhận', 'Bạn muốn xóa sản phẩm này?')
            .then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        setDeleteLoading(true);
                        refLoadingBar.current.continuousStart();

                        const res = await api.product.delete(propertyDefault.id);

                        setDeleteLoading(false);
                        refLoadingBar.current.complete();

                        if (res.status === 200) {
                            if (res.data.code === 200) {
                                common.Toast('Xóa sản phẩm thành công.', 'success')
                                    .then(() => router.push('/product'));
                            } else {
                                const message = res.data.message || 'Xóa sản phẩm thất bại.';
                                common.Toast(message, 'error');
                            }
                        }
                    } catch (error) {
                        setDeleteLoading(false);
                        refLoadingBar.current.complete();
                        common.Toast(error, 'error');
                    }
                }
            })
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
        tempUrl.image1.url = URL.createObjectURL(file);
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
        tempUrl.image2.url = URL.createObjectURL(file);
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
        tempUrl.image3.url = URL.createObjectURL(file);
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
        tempUrl.image4.url = URL.createObjectURL(file);
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
        tempUrl.image5.url = URL.createObjectURL(file);
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
        tempUrl.image6.url = URL.createObjectURL(file);
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
        tempUrl.image7.url = URL.createObjectURL(file);
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
        tempUrl.image8.url = URL.createObjectURL(file);
        setUrlImages({ ...tempUrl });
        URL.revokeObjectURL(file);
    }

    const deleteCoverImage = () => {
        let tempImages = images;
        tempImages.coverImage = null;
        setImages({ ...tempImages });

        let tempUrl = urlImages;
        tempUrl.coverImage.url = "";
        setUrlImages({ ...tempUrl });
    }

    const deleteImage1 = () => {
        let tempImages = images;
        tempImages.image1 = null;
        setImages({ ...tempImages });

        let tempUrl = urlImages;
        tempUrl.image1.url = "";
        setUrlImages({ ...tempUrl });
    }

    const deleteImage2 = () => {
        let tempImages = images;
        tempImages.image2 = null;
        setImages({ ...tempImages });

        let tempUrl = urlImages;
        tempUrl.image2.url = "";
        setUrlImages({ ...tempUrl });
    }

    const deleteImage3 = () => {
        let tempImages = images;
        tempImages.image3 = null;
        setImages({ ...tempImages });

        let tempUrl = urlImages;
        tempUrl.image3.url = "";
        setUrlImages({ ...tempUrl });
    }

    const deleteImage4 = () => {
        let tempImages = images;
        tempImages.image4 = null;
        setImages({ ...tempImages });

        let tempUrl = urlImages;
        tempUrl.image4.url = "";
        setUrlImages({ ...tempUrl });
    }

    const deleteImage5 = () => {
        let tempImages = images;
        tempImages.image5.url = null;
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
        tempUrl.image6.url = "";
        setUrlImages({ ...tempUrl });
    }

    const deleteImage7 = () => {
        let tempImages = images;
        tempImages.image7 = null;
        setImages({ ...tempImages });

        let tempUrl = urlImages;
        tempUrl.image7.url = "";
        setUrlImages({ ...tempUrl });
    }

    const deleteImage8 = () => {
        let tempImages = images;
        tempImages.image8 = null;
        setImages({ ...tempImages });

        let tempUrl = urlImages;
        tempUrl.image8.url = "";
        setUrlImages({ ...tempUrl });
    }

    // convert url to base64
    const toDataURL = (url) => fetch(url)
        .then(response => response.blob())
        .then(blob => new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsDataURL(blob)
        }))

    // covert base64 to file
    const dataURLtoFile = (dataUrl, filename) => {
        let arr = dataUrl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    }

    useEffect(() => {
        let tempImages = images;
        Object.keys(urlImages).forEach((key, idx) => {
            if (urlImages[key].url !== "") {
                toDataURL(urlImages[key].url)
                    .then(dataUrl => {
                        const fileData = dataURLtoFile(dataUrl, `image${idx}.png`);
                        tempImages[key] = fileData;
                    })
            }
        })
        setImages(tempImages);

        let temp = propertyDefault;
        temp.restWarrantyTime = new Date(propertyDefault.restWarrantyTime);
        setPropertyDefault(temp);
    }, [])

    const validateImage = () => {
        let num = 0;
        Object.keys(urlImages).forEach(x => {
            num += urlImages[x].url ? 1 : 0;
        })
        return num >= 4;
    }

    return (
        <div className="product-detail">
            <Head>
                <title>Chi tiết sản phẩm</title>
            </Head>
            <LoadingBar color="#00ac96" ref={refLoadingBar} onLoaderFinished={() => { }} />
            <div className="product-detail-container">
                <div className="title">
                    Chi tiết sản phẩm
                </div>
                <hr />

                <div className="form-input">
                    <div className="form-group row align-items-center d-flex">
                        <label htmlFor="name" className="col-sm-2 col-form-label">Tên sản phẩm: </label>
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
                            Chọn danh mục sản phẩm
                        </div>
                        <div className="select-category-content">
                            <div className="align-items-center d-flex input-category row">
                                <label htmlFor="category" className="col-sm-2 col-form-label">Chọn danh mục: </label>
                                <div className="col-sm-6 px-0">
                                    <Dropdown value={category} options={categories} onChange={onChangeCategory} optionLabel="name" filter showClear filterBy="name" placeholder="Chọn danh mục" id="category"
                                        className={classNames({ 'p-invalid': validate.checkEmptyInput(category.name) && showError })}
                                    />
                                    {
                                        validate.checkEmptyInput(category.name) && showError &&
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
                                <label htmlFor="description" className="col-sm-2 col-form-label">Mô tả sản phẩm </label>
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
                                <label htmlFor="price" className="col-sm-2 col-form-label">Giá bán: </label>
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
                                <label htmlFor="oldPrice" className="col-sm-2 col-form-label">Giá mua ban đầu: </label>
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
                                            Giá bán không được trống.
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="form-group row align-items-center d-flex input-brand">
                                <label htmlFor="brand" className="col-sm-2 col-form-label">Chọn thương hiệu: </label>
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
                                <label htmlFor="sku" className="col-sm-2 col-form-label">SKU: </label>
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
                                <label htmlFor="restWarrantyTime" className="col-sm-2 col-form-label">Ngày hết hạn bảo hành: </label>
                                <div className="col-sm-6">
                                    <Calendar id="date" value={new Date(propertyDefault.restWarrantyTime)} onChange={changeInput} dateFormat="dd/mm/yy" mask="99/99/9999" showIcon placeholder="Ngày hết hạn bảo hành" name="restWarrantyTime" id="restWarrantyTime"
                                        className={classNames({ 'p-invalid': validate.checkEmptyInput(propertyDefault.restWarrantyTime) && showError })}
                                    />
                                    {
                                        validate.checkEmptyInput(propertyDefault.restWarrantyTime) && showError &&
                                        <div className="invalid-feedback text-left">
                                            SKU không được trống.
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="countProduct" className="col-sm-2 col-form-label">Số lượng: </label>
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
                                <label htmlFor="countProduct" className="col-sm-2 col-form-label">Cân nặng (gram)*: </label>
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
                                <label htmlFor="countProduct" className="col-sm-2 col-form-label">Chiều dài (cm)*: </label>
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
                                <label htmlFor="countProduct" className="col-sm-2 col-form-label">Chiều rộng (cm)*: </label>
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
                                <label htmlFor="countDown" className="col-sm-2 col-form-label">Thời gian đấu giá*: </label>
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
                                            Thời gian đấu giá không được rỗng.
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="countProduct" className="col-sm-2 col-form-label">Chiều cao (cm)*: </label>
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
                                        <div className={classNames("add-image-box", { "invalid-image": validate.checkEmptyInput(urlImages.coverImage) && showError })}>
                                            {
                                                urlImages.coverImage.url === "" &&
                                                <>
                                                    <div className={classNames("add-image-circle", { "invalid-image": validate.checkEmptyInput(urlImages.coverImage) && showError })}>
                                                        <input type="file" accept="image/*" ref={inputCoverImage} onChange={selectCoverImage} />
                                                        <i className="fa fa-plus" aria-hidden onClick={addCoverImage}></i>
                                                    </div>
                                                </>
                                            }
                                            {
                                                urlImages.coverImage.url !== "" &&
                                                <>
                                                    <img src={urlImages.coverImage.url} alt="Cover Image" />
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
                                                urlImages.image1.url === "" &&
                                                <>
                                                    <div className={classNames("add-image-circle")}>
                                                        <input type="file" accept="image/*" ref={image1} onChange={selectImage1} />
                                                        <i className="fa fa-plus" aria-hidden onClick={addImage1}></i>
                                                    </div>
                                                </>
                                            }
                                            {
                                                urlImages.image1.url !== "" &&
                                                <>
                                                    <img src={urlImages.image1.url} alt="Image 1" />
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
                                                urlImages.image2.url === "" &&
                                                <>
                                                    <div className={classNames("add-image-circle")}>
                                                        <input type="file" accept="image/*" ref={image2} onChange={selectImage2} />
                                                        <i className="fa fa-plus" aria-hidden onClick={addImage2}></i>
                                                    </div>
                                                </>
                                            }
                                            {
                                                urlImages.image2.url !== "" &&
                                                <>
                                                    <img src={urlImages.image2.url} alt="Image 2" />
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
                                                urlImages.image3.url === "" &&
                                                <>
                                                    <div className={classNames("add-image-circle")}>
                                                        <input type="file" accept="image/*" ref={image3} onChange={selectImage3} />
                                                        <i className="fa fa-plus" aria-hidden onClick={addImage3}></i>
                                                    </div>
                                                </>
                                            }
                                            {
                                                urlImages.image3.url !== "" &&
                                                <>
                                                    <img src={urlImages.image3.url} alt="Image 1" />
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
                                                urlImages.image4.url === "" &&
                                                <>
                                                    <div className={classNames("add-image-circle")}>
                                                        <input type="file" accept="image/*" ref={image4} onChange={selectImage4} />
                                                        <i className="fa fa-plus" aria-hidden onClick={addImage4}></i>
                                                    </div>
                                                </>
                                            }
                                            {
                                                urlImages.image4.url !== "" &&
                                                <>
                                                    <img src={urlImages.image4.url} alt="Image 1" />
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
                                                urlImages.image5.url === "" &&
                                                <>
                                                    <div className={classNames("add-image-circle")}>
                                                        <input type="file" accept="image/*" ref={image5} onChange={selectImage5} />
                                                        <i className="fa fa-plus" aria-hidden onClick={addImage5}></i>
                                                    </div>
                                                </>
                                            }
                                            {
                                                urlImages.image5.url !== "" &&
                                                <>
                                                    <img src={urlImages.image5.url} alt="Image 1" />
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
                                                urlImages.image6.url === "" &&
                                                <>
                                                    <div className={classNames("add-image-circle")}>
                                                        <input type="file" accept="image/*" ref={image6} onChange={selectImage6} />
                                                        <i className="fa fa-plus" aria-hidden onClick={addImage6}></i>
                                                    </div>
                                                </>
                                            }
                                            {
                                                urlImages.image6.url !== "" &&
                                                <>
                                                    <img src={urlImages.image6.url} alt="Image 1" />
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
                                                urlImages.image7.url === "" &&
                                                <>
                                                    <div className={classNames("add-image-circle")}>
                                                        <input type="file" accept="image/*" ref={image7} onChange={selectImage7} />
                                                        <i className="fa fa-plus" aria-hidden onClick={addImage7}></i>
                                                    </div>
                                                </>
                                            }
                                            {
                                                urlImages.image7.url !== "" &&
                                                <>
                                                    <img src={urlImages.image7.url} alt="Image 1" />
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
                                                urlImages.image8.url === "" &&
                                                <>
                                                    <div className={classNames("add-image-circle")}>
                                                        <input type="file" accept="image/*" ref={image8} onChange={selectImage8} />
                                                        <i className="fa fa-plus" aria-hidden onClick={addImage8}></i>
                                                    </div>
                                                </>
                                            }
                                            {
                                                urlImages.image8.url !== "" &&
                                                <>
                                                    <img src={urlImages.image8.url} alt="Image 1" />
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
                                <label htmlFor="name-product" className="col-sm-2 col-form-label">Cài đặt vận chuyển: </label>
                                <div className="col-sm-6">
                                    <div className="d-flex flex-row align-items-center row mb-3">
                                        <div className="col-sm-4">Giao hàng nhanh</div>
                                        <label className="fancy-checkbox">
                                            <input type="checkbox" onChange={() => setGHNChecked(!ghnChecked)} checked={ghnChecked} />
                                            <span></span>
                                        </label>
                                    </div>
                                    <div className="d-flex flex-row align-items-center row mb-3">
                                        <div className="col-sm-4">Giao hàng tiết kiệm</div>
                                        <label className="fancy-checkbox">
                                            <input type="checkbox" onChange={() => setGHTKChecked(!ghtkChecked)} checked={ghtkChecked} />
                                            <span></span>
                                        </label>
                                    </div>
                                    <div className="d-flex flex-row align-items-center row">
                                        <div className="col-sm-4">Nhận hàng tại shop</div>
                                        <label className="fancy-checkbox">
                                            <input type="checkbox" onChange={() => setNotDeliveryChecked(!notDeliveryChecked)} checked={notDeliveryChecked} />
                                            <span></span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {
                                attributes.map(x => {
                                    return (

                                        <div className="form-group row align-items-center d-flex" key={x.key}>
                                            <label htmlFor={x.key} className="col-sm-2 col-form-label">{`${x.name}:`}</label>
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
                            <div className="d-flex align-items-center">
                                <div className="mr-3">
                                    {
                                        isDeleteLoading &&
                                        <button type="button" className="btn button-delete btn-danger" disabled="disabled"><i className="fa fa-spinner fa-spin mr-2" aria-hidden></i>Xử lí...</button>
                                    }
                                    {
                                        !isDeleteLoading &&
                                        <button className="btn button-delete btn-danger" onClick={deleteProduct}>Xóa</button>
                                    }
                                </div>
                                <div>
                                    {
                                        isLoading &&
                                        <button type="button" className="btn button-save" disabled="disabled"><i className="fa fa-spinner fa-spin mr-2" aria-hidden></i>Xử lí...</button>
                                    }
                                    {
                                        !isLoading &&
                                        <button className="btn button-save" onClick={updateProduct}>Cập nhật</button>
                                    }
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export async function getServerSideProps(ctx) {
    const id = ctx.query.id;
    const cookies = ctx.req.headers.cookie;
    if (cookies) {
        const token = cookie.parse(cookies).seller_token;
        if (token) {
            let brands = [];
            let brand = { id: "", name: "" };
            let categories = [];
            let listAttribute = [];
            let product = {
                id: "",
                name: "",
                description: "",
                category: "",
                price: 0,
                oldPrice: 0,
                sku: "",
                countProduct: 0,
                note: "",
                restWarrantyTime: "",
                weight: 0,
                length: 0,
                width: 0,
                height: 0,
                countDown: 0
            }
            let accept = false;
            let urlImages = {
                coverImage: { url: "", id: "" },
                image1: { url: "", id: "" },
                image2: { url: "", id: "" },
                image3: { url: "", id: "" },
                image4: { url: "", id: "" },
                image5: { url: "", id: "" },
                image6: { url: "", id: "" },
                image7: { url: "", id: "" },
                image8: { url: "", id: "" },
            }
            let information = {};
            try {
                const res = await api.category.getList();

                if (res.status === 200) {
                    res.data.list.forEach(x => {
                        let categoryItem = { id: "", name: "" };
                        categoryItem.id = x.childId || "";
                        categoryItem.name = x.childName || "";
                        categories.push(categoryItem);
                    })

                    const resProduct = await api.product.getDetail(id, token);
                    if (resProduct.status === 200) {
                        if (resProduct.data.code === 200) {
                            const result = resProduct.data.result;
                            brand.id = result.brand ? (result.brand._id || "") : "";
                            brand.name = result.brand ? (result.brand.name || "") : "";
                            product.id = result._id || "";
                            product.name = result.name || "";
                            product.description = result.description || "";
                            product.category = {
                                id: result.categoryInfor ? (result.categoryInfor._id || "") : "",
                                name: result.categoryInfor ? (result.categoryInfor.name || "") : ""
                            };
                            product.price = result.price;
                            product.oldPrice = result.oldPrice;
                            product.sku = result.sku;
                            product.countProduct = result.countProduct;
                            product.note = result.note || "";
                            product.restWarrantyTime = result.restWarrantyTime;
                            product.weight = result.weight || 0;
                            product.length = result.length || 0;
                            product.width = result.width || 0;
                            product.height = result.height || 0;
                            product.countDown = result.countDown || 0;
                            result.arrayImage.forEach((image, index) => {
                                if (index === 0) {
                                    urlImages.coverImage.url = image.url;
                                    urlImages.coverImage.id = image.id;
                                } else {
                                    urlImages["image" + index].url = image.url;
                                    urlImages["image" + index].id = image.id;
                                }
                            })

                            accept = result.accept;

                            information = result.information;

                            const resAttr = await api.category.getDetail(product.category.id);
                            if (resAttr.status === 200) {
                                if (resAttr.data.code === 200) {
                                    let listKey = Object.keys(resAttr.data.result.information);
                                    ListProperties.forEach(x => {
                                        if (listKey.includes(x.key)) {
                                            listAttribute.push(x);
                                        }
                                    })
                                }
                            }
                        }
                    }
                }

                const resBrand = await api.brand.getList(token);

                if (resBrand.status === 200) {
                    if (resBrand.data.code === 200) {
                        const result = resBrand.data.result;
                        result.forEach(x => {
                            let item = {
                                id: "",
                                name: ""
                            }
                            item.id = x._id || "";
                            item.name = x.name || "";
                            brands.push(item);
                        })
                    }
                }
            } catch (err) {
                console.log(err.message);
            }

            return {
                props: {
                    categories: categories,
                    auction: product,
                    accept: accept,
                    imagesUrl: urlImages,
                    info: information,
                    attr: listAttribute,
                    brands: brands,
                    brand: brand
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

export default AuctionDetail;