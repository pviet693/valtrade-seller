import Head from 'next/head';
import { Calendar } from 'primereact/calendar';
import { DataTable } from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';
import { Column } from 'primereact/column';
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import LoadingBar from "react-top-loading-bar";
import NoneFilter from '../../components/NoneFilter';
import HeaderTable from '../../components/HeaderTable';
import StatusFilter from '../../components/StatusFilter';
import cookie from "cookie";
import api from './../../utils/backend-api.utils';
import * as common from './../../utils/common.utils';
import { useFormik } from 'formik';
import Moment from 'moment';
Moment.locale('en');

const Product = (props) => {
    const router = useRouter();
    const [listStatus] = useState([
        { name: "Tất cả", value: "" },
        { name: "Đã phê duyệt", value: "APPROVED" },
        { name: "Đã từ chối", value: "REJECTED" },
        { name: "Chờ phê duyệt", value: "PENDING" },
    ])
    const [total] = useState(props.total);
    const [categories] = useState(props.categories);
    const [products, setProducts] = useState(props.products);
    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(props.total);
    const [lazyParams, setLazyParams] = useState({
        first: 0,
        rows: 10,
        page: 0,
    });
    const [count, setCount] = useState(0);

    const dt = useRef(null);
    const refLoadingBar = useRef(null);
    const formikFilter = useFormik({
        initialValues: {
            search: "",
            dateFrom: null,
            dateTo: null,
            category: null,
            priceFrom: 0,
            priceTo: 0,
            status: null
        },
        validate: (data) => {
            let errors = {};

            if (!data.dateFrom && data.dateTo
                || (new Date(data.dateFrom)).getTime() > (new Date(data.dateTo)).getTime()
                || data.dateFrom && !data.dateTo
            ) errors.date = "Giới hạn ngày thêm không hợp lệ.";

            if (!data.priceFrom && data.priceTo
                || data.priceFrom && !data.priceTo
                || (Number(data.priceFrom) > Number(data.priceTo))
            ) errors.price = "Giới hạn giá không hợp lệ.";

            return errors;
        },
        onSubmit: (data) => {
            getListProduct();
        },
        onReset: () => {
            getListProduct();
        }
    });

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="d-flex align-items-center justify-content-center">
                <button type="button" className="btn btn-danger mr-2" onClick={() => deleteProduct(rowData.id)}><i className="fa fa-trash-o" aria-hidden></i> Xóa</button>
                <button type="button" className="btn btn-primary" onClick={() => viewDetail(rowData.id)}><i className="fa fa-edit" aria-hidden></i> Sửa</button>
            </div>
        );
    }

    const actionAcceptTemplate = (rowData) => {
        return (
            <div className="d-flex justify-content-center align-items-center">
                {
                    rowData.accept ?
                        <div className="badge status status--approved">Đã phê duyệt</div>
                        : (
                            rowData.reject ?
                                <div className="badge status status--rejected">Đã từ chối</div>
                                :
                                <div className="badge status status--pending">Chờ phê duyệt</div>
                        )
                }
            </div>
        )
    }

    const viewDetail = (id) => {
        router.push(`/product/detail/${id}`);
    }

    const deleteProduct = async (id) => {
        common.ConfirmDialog('Xác nhận', 'Bạn muốn xóa sản phẩm này?')
            .then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        refLoadingBar.current.continuousStart();

                        const res = await api.product.delete(id);

                        refLoadingBar.current.complete();

                        if (res.status === 200) {
                            if (res.data.code === 200) {
                                common.Toast('Xóa sản phẩm thành công.', 'success')
                                    .then(() => {
                                        let newListProducts = products.filter(x => x.id !== id);
                                        setProducts([...newListProducts]);
                                    })
                            } else {
                                const message = res.data.message || 'Xóa sản phẩm thất bại.';
                                common.Toast(message, 'error');
                            }
                        }
                    } catch (error) {
                        refLoadingBar.current.complete();
                        common.Toast(error, 'error');
                    }
                }
            })
    }

    useEffect(async () => {
        if (count) {
            getListProduct();
        }
        let newCount = count;
        newCount += 1;
        setCount(newCount);
    }, [lazyParams]);

    const getListProduct = async () => {
        try {
            setLoading(true);
            let params = {
                ...lazyParams,
                ...formikFilter.values
            }

            const res = await api.product.getList(params);
            if (res.status === 200) {
                if (res.data.code === 200) {
                    let listProducts = [];
                    res.data.result.map(item => {
                        let product = {};
                        product.id = item._id || "";
                        product.name = item.name;
                        product.category = item.categoryInfor.name;
                        product.date = Moment(item.timePost).format("DD/MM/yyyy");
                        product.price = item.price ? `VNĐ ${common.numberWithCommas(item.price)}` : "";
                        product.accept = item.accept || false;
                        product.reject = item.reject || false;
                        listProducts.push(product);
                    })
                    setProducts(() => listProducts);

                    setTotalRecords(() => res.data.total);

                    setLoading(false);
                }
                else {
                    setLoading(false);
                    let message = res.data.message || "Có lỗi xảy ra vui lòng thử lại sau.";
                    common.Toast(message, 'error');
                }
            }
        } catch (error) {
            setLoading(false);
            common.Toast(error, 'error');
        }
    }

    const onRefresh = () => {
        formikFilter.resetForm();
        setLazyParams(() => ({
            first: 0,
            rows: 10,
            page: 0
        }));
    }

    const onPage = (event) => {
        let _lazyParams = { ...lazyParams, ...event };
        setLazyParams(_lazyParams);
    }

    const onSort = (event) => {
        let _lazyParams = { ...lazyParams, ...event };
        setLazyParams(_lazyParams);
    }

    const header = <HeaderTable onRefresh={onRefresh} />
    const itemTemplate = (option) => {
        return (
            <div className="d-flex align-items-center w-100">
                {
                    option.value === "APPROVED" ?
                        <div className="status status--approved">Đã phê duyệt</div>
                        : (
                            option.value === "REJECTED" ?
                                <div className="status status--rejected">Đã từ chối</div>
                                : option.value === "PENDING" ?
                                    <div className="status status--pending">Chờ phê duyệt</div>
                                    :
                                    <div className="status status--all">Tất cả</div>
                        )
                }
            </div>
        );
    }

    return (
        <div className="list-product">
            <Head>
                <title>
                    Tất cả sản phẩm
                </title>
            </Head>
            <LoadingBar color="#00ac96" ref={refLoadingBar} />
            <div className="custom-tabs-line tabs-line-bottom">
                <ul className="nav" role="tablist">
                    <li className="active"><a href="#all-product" role="tab" data-toggle="tab">Tất cả <span className="badge bg-danger">{total}</span></a></li>
                </ul>
                <hr />
                <div className="tab-content">
                    {/* All product */}
                    <div className="tab-pane fade in active" id="all-product">
                        <form onSubmit={formikFilter.handleSubmit} onReset={formikFilter.handleReset}>
                            <div className="form-group row align-items-center d-flex">
                                <label className="col-sm-2 col-form-label">Tên sản phẩm</label>
                                <div className="col-sm-6">
                                    <input type="text"
                                        className="form-control"
                                        name="search"
                                        id="search"
                                        placeholder="Tên sản phẩm"
                                        value={formikFilter.values.search}
                                        onChange={formikFilter.handleChange}
                                    />
                                </div>
                                <div className="col-sm-4">
                                    <input type="submit" className="btn btn-primary w-25" value="Tìm kiếm" />
                                </div>
                            </div>
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="category" className="col-sm-2 col-form-label">Danh mục</label>
                                <div className="col-sm-6">
                                    <Dropdown
                                        name="category"
                                        id="category"
                                        options={categories}
                                        filter
                                        placeholder="Tất cả"
                                        className="p-column-filter p-dropdown-status"
                                        optionValue="id"
                                        optionLabel="name"
                                        value={formikFilter.values.category}
                                        onChange={formikFilter.handleChange}
                                    />
                                </div>
                                <div className="col-sm-4">
                                    <input type="reset" className="btn btn-default w-25" value="Nhập lại" />
                                </div>
                            </div>

                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="status" className="col-sm-2 col-form-label">Trạng thái</label>
                                <div className="col-sm-6 d-flex align-items-center">
                                    <Dropdown
                                        name="status"
                                        id="status"
                                        options={listStatus}
                                        filter
                                        itemTemplate={itemTemplate}
                                        placeholder="Tất cả"
                                        className="p-column-filter p-dropdown-status"
                                        optionValue="value"
                                        optionLabel="name"
                                        value={formikFilter.values.status}
                                        onChange={formikFilter.handleChange}
                                    />
                                </div>
                            </div>

                            <div className="form-group row align-items-center d-flex">
                                <label className="col-sm-2 col-form-label">Ngày thêm</label>
                                <div className="col-sm-6 d-flex align-items-center">
                                    <div className="col-sm-6 d-flex align-items-center pl-0">
                                        <label className="mr-2 font-weight-normal">Từ: </label>
                                        <Calendar
                                            name="dateFrom"
                                            dateFormat="dd/mm/yy"
                                            showIcon
                                            placeholder="Nhập ngày"
                                            readOnlyInput
                                            value={formikFilter.values.dateFrom}
                                            onChange={formikFilter.handleChange}
                                        />
                                    </div>
                                    <div className="col-sm-6 d-flex align-items-center pr-0">
                                        <label className="mr-2 font-weight-normal">Đến: </label>
                                        <Calendar
                                            name="dateTo"
                                            dateFormat="dd/mm/yy"
                                            showIcon
                                            placeholder="Nhập ngày"
                                            readOnlyInput
                                            value={formikFilter.values.dateTo}
                                            onChange={formikFilter.handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-sm-4 d-flex align-items-center">
                                    {
                                        formikFilter.errors.date &&
                                        <small className="invalid-feedback">{formikFilter.errors.date}</small>
                                    }
                                </div>
                            </div>

                            <div className="form-group row align-items-center d-flex flex-wrap">
                                <label className="col-sm-2 col-form-label">Giá bán</label>
                                <div className="col-sm-6 d-flex align-items-center">
                                    <div className="col-sm-6 d-flex align-items-center pl-0">
                                        <label className="mr-2 font-weight-normal">Từ: </label>
                                        <input
                                            name="priceFrom"
                                            type="number"
                                            className="form-control"
                                            placeholder="Nhập giá"
                                            value={formikFilter.values.priceFrom}
                                            onChange={formikFilter.handleChange}
                                        />
                                    </div>
                                    <div className="col-sm-6 d-flex align-items-center pr-0">
                                        <label htmlFor="date-to" className="mr-2 font-weight-normal">Đến: </label>
                                        <input
                                            name="priceTo"
                                            type="number"
                                            className="form-control"
                                            placeholder="Nhập giá"
                                            value={formikFilter.values.priceTo}
                                            onChange={formikFilter.handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-sm-4 d-flex align-items-center">
                                    {
                                        formikFilter.errors.price &&
                                        <small className="invalid-feedback">{formikFilter.errors.price}</small>
                                    }
                                </div>
                            </div>
                        </form>

                        <div className="table-list-product">
                            <DataTable
                                header={header} removableSort
                                scrollable scrollHeight="100%"
                                ref={dt} value={products} lazy
                                paginator first={lazyParams.first}
                                rows={10} totalRecords={totalRecords}
                                onPage={onPage} onSort={onSort}
                                sortField={lazyParams.sortField}
                                sortOrder={lazyParams.sortOrder}
                                loading={loading}
                                emptyMessage="Không có kết quả"
                            >
                                <Column field="name" header="Tên sản phẩm" sortable filterElement={NoneFilter()} filter filterMatchMode="custom"></Column>
                                <Column field="category" header="Danh mục" sortable filterElement={NoneFilter()} filter filterMatchMode="custom"></Column>
                                <Column field="date" header="Ngày thêm" sortable filterElement={NoneFilter()} filter filterMatchMode="custom"></Column>
                                <Column field="price" header="Giá bán" sortable filterElement={NoneFilter()} filter filterMatchMode="custom"></Column>
                                <Column field="status" header="Trạng thái" body={actionAcceptTemplate} filterElement={NoneFilter()} filter filterMatchMode="custom" />
                                <Column field="action" header="Hành động" body={actionBodyTemplate} headerStyle={{ width: '15em', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} filterElement={NoneFilter()} filter filterMatchMode="custom" />
                            </DataTable>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export async function getServerSideProps(ctx) {
    let products = [];
    let categories = [];
    let total = 0;
    const cookies = ctx.req.headers.cookie;
    if (cookies) {
        const token = cookie.parse(cookies).seller_token;
        if (token) {
            try {
                const res = await api.product.getList(null, token);
                if (res.status === 200) {
                    if (res.data.code === 200) {
                        total = res.data.total;
                        const result = res.data.result;
                        result.forEach(item => {
                            let product = {};
                            product.id = item._id || "";
                            product.name = item.name;
                            product.category = item.categoryInfor.name;
                            product.date = Moment(item.timePost).format("DD/MM/yyyy");
                            product.price = item.price ? `VNĐ ${common.numberWithCommas(item.price)}` : "";
                            product.accept = item.accept || false;
                            product.reject = item.reject || false;
                            products.push(product);
                        })
                    }
                }

                const resCategory = await api.category.getList();

                if (resCategory.status === 200) {
                    resCategory.data.list.forEach(x => {
                        let categoryItem = {};
                        categoryItem.id = x.childId || "";
                        categoryItem.name = x.childName || "";
                        categories.push(categoryItem);
                    })
                }
            } catch (err) {
                console.log(err.message);
            }

            return {
                props: { products, categories, total }
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

export default Product;