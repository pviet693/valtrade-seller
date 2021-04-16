import Head from 'next/head';
import { Calendar } from 'primereact/calendar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import api from './../../utils/backend-api.utils';
import * as common from './../../utils/common.utils';
import Moment from 'moment';
Moment.locale('en');

const Product = (props) => {
    const { products } = props;
    const [dateFrom, setDateFrom] = useState(null);
    const [dateTo, setDateTo] = useState(null);
    const [dateFilter, setDateFilter] = useState(null);
    const dt = useRef(null);

    const actionBodyTemplate = () => {
        return (
            <div className="d-flex align-items-center justify-content-center">
                <button type="button" className="btn btn-danger mr-2"><i className="fa fa-trash-o" aria-hidden></i> Xóa</button>
                <button type="button" className="btn btn-primary"><i className="fa fa-edit" aria-hidden></i> Sửa</button>
            </div>
        );
    }

    const filterDate = (value, filter) => {
        if (filter === undefined || filter === null || (typeof filter === 'string' && filter.trim() === '')) {
            return true;
        }

        if (value === undefined || value === null) {
            return false;
        }

        return value === Moment(filter).format('DD/MM/yyyy');
    }

    const renderDateFilter = () => {
        return (
            <Calendar value={dateFilter} onChange={onDateFilterChange} dateFormat="dd/mm/yy" placeholder="dd/mm/yyyy" id="pr_id_15"/>
        );
    }

    const renderActionFilter = () => {
        return (
            <input type="text" className="p-inputtext p-component p-column-filter" disabled></input>
        );
    }

    const onDateFilterChange = (event) => {
        if (event.value !== null)
            dt.current.filter(Moment(event.value).format('DD/MM/yyyy'), 'date', 'equals');
        else
            dt.current.filter(null, 'date', 'equals');

        setDateFilter(event.value);
    }

    // useEffect(() => {
    //     setProducts([
    //         {
    //             name: "ABC",
    //             category: "ABC",
    //             date: Moment(new Date()).format('DD/MM/yyyy'),
    //             price: 2000,
    //             action: ''
    //         },
    //         {
    //             name: "ABC",
    //             category: "ABC",
    //             date: Moment(new Date()).format('DD/MM/yyyy'),
    //             price: 2000,
    //             action: ''
    //         },
    //         {
    //             name: "ABC",
    //             category: "ABC",
    //             date: Moment(new Date()).format('DD/MM/yyyy'),
    //             price: 2000,
    //             action: ''
    //         },
    //         {
    //             name: "ABC",
    //             category: "ABC",
    //             date: Moment(new Date()).format('DD/MM/yyyy'),
    //             price: 2000,
    //             action: ''
    //         },
    //         {
    //             name: "ABC",
    //             category: "ABC",
    //             date: Moment(new Date()).format('DD/MM/yyyy'),
    //             price: 2000,
    //             action: ''
    //         },
    //         {
    //             name: "ABC",
    //             category: "ABC",
    //             date: Moment(new Date()).format('DD/MM/yyyy'),
    //             price: 2000,
    //             action: ''
    //         },
    //         {
    //             name: "ABC",
    //             category: "ABC",
    //             date: Moment(new Date()).format('DD/MM/yyyy'),
    //             price: 2000,
    //             action: ''
    //         },
    //         {
    //             name: "ABC",
    //             category: "ABC",
    //             date: Moment(new Date()).format('DD/MM/yyyy'),
    //             price: 2000,
    //             action: ''
    //         },
    //         {
    //             name: "ABC",
    //             category: "ABC",
    //             date: Moment(new Date()).format('DD/MM/yyyy'),
    //             price: 2000,
    //             action: ''
    //         },
    //         {
    //             name: "ABC",
    //             category: "ABC",
    //             date: Moment(new Date()).format('DD/MM/yyyy'),
    //             price: 2000,
    //             action: ''
    //         },
    //         {
    //             name: "ABC",
    //             category: "ABC",
    //             date: Moment(new Date()).format('DD/MM/yyyy'),
    //             price: 2000,
    //             action: ''
    //         },
    //         {
    //             name: "ABC",
    //             category: "ABC",
    //             date: Moment(new Date()).format('DD/MM/yyyy'),
    //             price: 2000,
    //             action: ''
    //         },
    //     ])
    // }, [])

    useEffect(async () => {

    }, [])

    const dateFilterElement = renderDateFilter();
    const actionFilterElement = renderActionFilter();

    return (
        <div className="list-product">
            <Head>
                <title>
                    Tất cả sản phẩm
                </title>
            </Head>
            <div className="custom-tabs-line tabs-line-bottom">
                <ul className="nav" role="tablist">
                    <li className="active"><a href="#all-product" role="tab" data-toggle="tab">Tất cả <span className="badge bg-danger">7</span></a></li>
                    <li><a href="#on-sale-product" role="tab" data-toggle="tab">Đang bán <span className="badge bg-danger">7</span></a></li>
                    <li><a href="#sold-product" role="tab" data-toggle="tab">Đã bán <span className="badge bg-danger">7</span></a></li>
                    <li><a href="#out-stock-product" role="tab" data-toggle="tab">Hết hàng <span className="badge bg-danger">7</span></a></li>
                    <li><a href="#hidden-product" role="tab" data-toggle="tab">Tạm ẩn <span className="badge bg-danger">7</span></a></li>
                    <li><a href="#lock-product" role="tab" data-toggle="tab">Tạm khóa <span className="badge bg-danger">7</span></a></li>
                </ul>
                <hr/>
                <div className="tab-content">
                    {/* All product */}
                    <div className="tab-pane fade in active" id="all-product">
                        <form>
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="name-product" className="col-sm-2 col-form-label">Tên sản phẩm</label>
                                <div className="col-sm-6">
                                    <input type="text" className="form-control" id="name-product" placeholder="Tên sản phẩm" name="name"/>
                                </div>
                                <div className="col-sm-4">
                                    <input type="submit" className="btn btn-primary w-25" value="Tìm kiếm" />
                                </div>
                            </div>
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="name-category" className="col-sm-2 col-form-label">Danh mục</label>
                                <div className="col-sm-6">
                                    <input type="text" className="form-control" id="name-category" placeholder="Tên danh mục" name="category" />
                                </div>
                                <div className="col-sm-4">
                                    <input type="reset" className="btn btn-default w-25" value="Nhập lại" />
                                </div>
                            </div>
                            <div className="form-group row align-items-center d-flex">
                                <label className="col-sm-2 col-form-label">Ngày thêm</label>
                                <div className="col-sm-3 d-flex align-items-center">
                                    <label htmlFor="date-from" className="mr-2 font-weight-normal">Từ: </label>
                                    <Calendar value={dateFrom} onChange={(e) => setDateFrom(e.value)} dateFormat="dd/mm/yy" showIcon placeholder="dd/mm/yyyy" readOnlyInput id="date-from" />
                                </div>
                                <div className="col-sm-3 d-flex align-items-center">
                                    <label htmlFor="date-to" className="mr-2 font-weight-normal">Đến: </label>
                                    <Calendar value={dateTo} onChange={(e) => setDateTo(e.value)} dateFormat="dd/mm/yy" showIcon placeholder="dd/mm/yyyy" readOnlyInput id="date-to" />
                                </div>
                            </div>
                        </form>

                        <div className="table-list-product">
                            <DataTable value={products}
                                ref={dt}
                                paginator rows={10} emptyMessage="Không có sản phẩm" currentPageReportTemplate="{first} đến {last} của {totalRecords}"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                >
                                <Column field="name" header="Tên sản phẩm" sortable filter filterPlaceholder="Nhập tên"></Column>
                                <Column field="category" header="Danh mục" sortable filter filterPlaceholder="Nhập danh mục"></Column>
                                <Column field="date" header="Ngày thêm" sortable filter filterMatchMode="custom" filterFunction={filterDate} filterElement={dateFilterElement}></Column>
                                <Column field="price" header="Giá bán" sortable filter filterPlaceholder="Nhập giá"></Column>
                                <Column field="action" header="Hành động" body={actionBodyTemplate} headerStyle={{ width: '15em', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} filterElement={actionFilterElement} filter filterMatchMode="custom" />
                            </DataTable>
                        </div>
                    </div>

                    {/* On sale product */}
                    <div className="tab-pane fade in" id="on-sale-product">
                        <form>
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="name-product" className="col-sm-2 col-form-label">Tên sản phẩm</label>
                                <div className="col-sm-6">
                                    <input type="text" className="form-control" id="name-product" placeholder="Tên sản phẩm" name="name" />
                                </div>
                                <div className="col-sm-4">
                                    <input type="submit" className="btn btn-primary w-25" value="Tìm kiếm" />
                                </div>
                            </div>
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="name-category" className="col-sm-2 col-form-label">Danh mục</label>
                                <div className="col-sm-6">
                                    <input type="text" className="form-control" id="name-category" placeholder="Tên danh mục" name="category" />
                                </div>
                                <div className="col-sm-4">
                                    <input type="reset" className="btn btn-default w-25" value="Nhập lại" />
                                </div>
                            </div>
                            <div className="form-group row align-items-center d-flex">
                                <label className="col-sm-2 col-form-label">Ngày thêm</label>
                                <div className="col-sm-3 d-flex align-items-center">
                                    <label htmlFor="date-from" className="mr-2 font-weight-normal">Từ: </label>
                                    <Calendar value={dateFrom} onChange={(e) => setDateFrom(e.value)} dateFormat="dd/mm/yy" showIcon placeholder="dd/mm/yyyy" readOnlyInput id="date-from" />
                                </div>
                                <div className="col-sm-3 d-flex align-items-center">
                                    <label htmlFor="date-to" className="mr-2 font-weight-normal">Đến: </label>
                                    <Calendar value={dateTo} onChange={(e) => setDateTo(e.value)} dateFormat="dd/mm/yy" showIcon placeholder="dd/mm/yyyy" readOnlyInput id="date-to" />
                                </div>
                            </div>
                        </form>

                        <div className="table-list-product">
                            <DataTable value={products}
                                ref={dt}
                                paginator rows={10} emptyMessage="Không có sản phẩm" currentPageReportTemplate="{first} đến {last} của {totalRecords}"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            >
                                <Column field="name" header="Tên sản phẩm" sortable filter filterPlaceholder="Nhập tên"></Column>
                                <Column field="category" header="Danh mục" sortable filter filterPlaceholder="Nhập danh mục"></Column>
                                <Column field="date" header="Ngày thêm" sortable filter filterMatchMode="custom" filterFunction={filterDate} filterElement={dateFilterElement}></Column>
                                <Column field="price" header="Giá bán" sortable filter filterPlaceholder="Nhập giá"></Column>
                                <Column field="action" header="Hành động" body={actionBodyTemplate} headerStyle={{ width: '15em', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} filterElement={actionFilterElement} filter filterMatchMode="custom" />
                            </DataTable>
                        </div>
                    </div>

                    {/* Sold product */}
                    <div className="tab-pane fade in" id="sold-product">
                        <form>
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="name-product" className="col-sm-2 col-form-label">Tên sản phẩm</label>
                                <div className="col-sm-6">
                                    <input type="text" className="form-control" id="name-product" placeholder="Tên sản phẩm" name="name" />
                                </div>
                                <div className="col-sm-4">
                                    <input type="submit" className="btn btn-primary w-25" value="Tìm kiếm" />
                                </div>
                            </div>
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="name-category" className="col-sm-2 col-form-label">Danh mục</label>
                                <div className="col-sm-6">
                                    <input type="text" className="form-control" id="name-category" placeholder="Tên danh mục" name="category" />
                                </div>
                                <div className="col-sm-4">
                                    <input type="reset" className="btn btn-default w-25" value="Nhập lại" />
                                </div>
                            </div>
                            <div className="form-group row align-items-center d-flex">
                                <label className="col-sm-2 col-form-label">Ngày thêm</label>
                                <div className="col-sm-3 d-flex align-items-center">
                                    <label htmlFor="date-from" className="mr-2 font-weight-normal">Từ: </label>
                                    <Calendar value={dateFrom} onChange={(e) => setDateFrom(e.value)} dateFormat="dd/mm/yy" showIcon placeholder="dd/mm/yyyy" readOnlyInput id="date-from" />
                                </div>
                                <div className="col-sm-3 d-flex align-items-center">
                                    <label htmlFor="date-to" className="mr-2 font-weight-normal">Đến: </label>
                                    <Calendar value={dateTo} onChange={(e) => setDateTo(e.value)} dateFormat="dd/mm/yy" showIcon placeholder="dd/mm/yyyy" readOnlyInput id="date-to" />
                                </div>
                            </div>
                        </form>

                        <div className="table-list-product">
                            <DataTable value={products}
                                ref={dt}
                                paginator rows={10} emptyMessage="Không có sản phẩm" currentPageReportTemplate="{first} đến {last} của {totalRecords}"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            >
                                <Column field="name" header="Tên sản phẩm" sortable filter filterPlaceholder="Nhập tên"></Column>
                                <Column field="category" header="Danh mục" sortable filter filterPlaceholder="Nhập danh mục"></Column>
                                <Column field="date" header="Ngày thêm" sortable filter filterMatchMode="custom" filterFunction={filterDate} filterElement={dateFilterElement}></Column>
                                <Column field="price" header="Giá bán" sortable filter filterPlaceholder="Nhập giá"></Column>
                                <Column field="action" header="Hành động" body={actionBodyTemplate} headerStyle={{ width: '15em', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} filterElement={actionFilterElement} filter filterMatchMode="custom" />
                            </DataTable>
                        </div>
                    </div>

                    {/* Out of stock product */}
                    <div className="tab-pane fade in" id="out-stock-product">
                        <form>
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="name-product" className="col-sm-2 col-form-label">Tên sản phẩm</label>
                                <div className="col-sm-6">
                                    <input type="text" className="form-control" id="name-product" placeholder="Tên sản phẩm" name="name" />
                                </div>
                                <div className="col-sm-4">
                                    <input type="submit" className="btn btn-primary w-25" value="Tìm kiếm" />
                                </div>
                            </div>
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="name-category" className="col-sm-2 col-form-label">Danh mục</label>
                                <div className="col-sm-6">
                                    <input type="text" className="form-control" id="name-category" placeholder="Tên danh mục" name="category" />
                                </div>
                                <div className="col-sm-4">
                                    <input type="reset" className="btn btn-default w-25" value="Nhập lại" />
                                </div>
                            </div>
                            <div className="form-group row align-items-center d-flex">
                                <label className="col-sm-2 col-form-label">Ngày thêm</label>
                                <div className="col-sm-3 d-flex align-items-center">
                                    <label htmlFor="date-from" className="mr-2 font-weight-normal">Từ: </label>
                                    <Calendar value={dateFrom} onChange={(e) => setDateFrom(e.value)} dateFormat="dd/mm/yy" showIcon placeholder="dd/mm/yyyy" readOnlyInput id="date-from" />
                                </div>
                                <div className="col-sm-3 d-flex align-items-center">
                                    <label htmlFor="date-to" className="mr-2 font-weight-normal">Đến: </label>
                                    <Calendar value={dateTo} onChange={(e) => setDateTo(e.value)} dateFormat="dd/mm/yy" showIcon placeholder="dd/mm/yyyy" readOnlyInput id="date-to" />
                                </div>
                            </div>
                        </form>

                        <div className="table-list-product">
                            <DataTable value={products}
                                ref={dt}
                                paginator rows={10} emptyMessage="Không có sản phẩm" currentPageReportTemplate="{first} đến {last} của {totalRecords}"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            >
                                <Column field="name" header="Tên sản phẩm" sortable filter filterPlaceholder="Nhập tên"></Column>
                                <Column field="category" header="Danh mục" sortable filter filterPlaceholder="Nhập danh mục"></Column>
                                <Column field="date" header="Ngày thêm" sortable filter filterMatchMode="custom" filterFunction={filterDate} filterElement={dateFilterElement}></Column>
                                <Column field="price" header="Giá bán" sortable filter filterPlaceholder="Nhập giá"></Column>
                                <Column field="action" header="Hành động" body={actionBodyTemplate} headerStyle={{ width: '15em', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} filterElement={actionFilterElement} filter filterMatchMode="custom" />
                            </DataTable>
                        </div>
                    </div>

                    {/* Hidden product */}
                    <div className="tab-pane fade in" id="hidden-product">
                        <form>
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="name-product" className="col-sm-2 col-form-label">Tên sản phẩm</label>
                                <div className="col-sm-6">
                                    <input type="text" className="form-control" id="name-product" placeholder="Tên sản phẩm" name="name" />
                                </div>
                                <div className="col-sm-4">
                                    <input type="submit" className="btn btn-primary w-25" value="Tìm kiếm" />
                                </div>
                            </div>
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="name-category" className="col-sm-2 col-form-label">Danh mục</label>
                                <div className="col-sm-6">
                                    <input type="text" className="form-control" id="name-category" placeholder="Tên danh mục" name="category" />
                                </div>
                                <div className="col-sm-4">
                                    <input type="reset" className="btn btn-default w-25" value="Nhập lại" />
                                </div>
                            </div>
                            <div className="form-group row align-items-center d-flex">
                                <label className="col-sm-2 col-form-label">Ngày thêm</label>
                                <div className="col-sm-3 d-flex align-items-center">
                                    <label htmlFor="date-from" className="mr-2 font-weight-normal">Từ: </label>
                                    <Calendar value={dateFrom} onChange={(e) => setDateFrom(e.value)} dateFormat="dd/mm/yy" showIcon placeholder="dd/mm/yyyy" readOnlyInput id="date-from" />
                                </div>
                                <div className="col-sm-3 d-flex align-items-center">
                                    <label htmlFor="date-to" className="mr-2 font-weight-normal">Đến: </label>
                                    <Calendar value={dateTo} onChange={(e) => setDateTo(e.value)} dateFormat="dd/mm/yy" showIcon placeholder="dd/mm/yyyy" readOnlyInput id="date-to" />
                                </div>
                            </div>
                        </form>

                        <div className="table-list-product">
                            <DataTable value={products}
                                ref={dt}
                                paginator rows={10} emptyMessage="Không có sản phẩm" currentPageReportTemplate="{first} đến {last} của {totalRecords}"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            >
                                <Column field="name" header="Tên sản phẩm" sortable filter filterPlaceholder="Nhập tên"></Column>
                                <Column field="category" header="Danh mục" sortable filter filterPlaceholder="Nhập danh mục"></Column>
                                <Column field="date" header="Ngày thêm" sortable filter filterMatchMode="custom" filterFunction={filterDate} filterElement={dateFilterElement}></Column>
                                <Column field="price" header="Giá bán" sortable filter filterPlaceholder="Nhập giá"></Column>
                                <Column field="action" header="Hành động" body={actionBodyTemplate} headerStyle={{ width: '15em', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} filterElement={actionFilterElement} filter filterMatchMode="custom" />
                            </DataTable>
                        </div>
                    </div>

                    {/* Lock product */}
                    <div className="tab-pane fade in" id="lock-product">
                        <form>
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="name-product" className="col-sm-2 col-form-label">Tên sản phẩm</label>
                                <div className="col-sm-6">
                                    <input type="text" className="form-control" id="name-product" placeholder="Tên sản phẩm" name="name" />
                                </div>
                                <div className="col-sm-4">
                                    <input type="submit" className="btn btn-primary w-25" value="Tìm kiếm" />
                                </div>
                            </div>
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="name-category" className="col-sm-2 col-form-label">Danh mục</label>
                                <div className="col-sm-6">
                                    <input type="text" className="form-control" id="name-category" placeholder="Tên danh mục" name="category" />
                                </div>
                                <div className="col-sm-4">
                                    <input type="reset" className="btn btn-default w-25" value="Nhập lại" />
                                </div>
                            </div>
                            <div className="form-group row align-items-center d-flex">
                                <label className="col-sm-2 col-form-label">Ngày thêm</label>
                                <div className="col-sm-3 d-flex align-items-center">
                                    <label htmlFor="date-from" className="mr-2 font-weight-normal">Từ: </label>
                                    <Calendar value={dateFrom} onChange={(e) => setDateFrom(e.value)} dateFormat="dd/mm/yy" showIcon placeholder="dd/mm/yyyy" readOnlyInput id="date-from" />
                                </div>
                                <div className="col-sm-3 d-flex align-items-center">
                                    <label htmlFor="date-to" className="mr-2 font-weight-normal">Đến: </label>
                                    <Calendar value={dateTo} onChange={(e) => setDateTo(e.value)} dateFormat="dd/mm/yy" showIcon placeholder="dd/mm/yyyy" readOnlyInput id="date-to" />
                                </div>
                            </div>
                        </form>

                        <div className="table-list-product">
                            <DataTable value={products}
                                ref={dt}
                                paginator rows={10} emptyMessage="Không có sản phẩm" currentPageReportTemplate="{first} đến {last} của {totalRecords}"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            >
                                <Column field="name" header="Tên sản phẩm" sortable filter filterPlaceholder="Nhập tên"></Column>
                                {/* <Column field="category" header="Danh mục" sortable filter filterPlaceholder="Nhập danh mục"></Column> */}
                                <Column field="date" header="Ngày thêm" sortable filter filterMatchMode="custom" filterFunction={filterDate} filterElement={dateFilterElement}></Column>
                                <Column field="price" header="Giá bán" sortable filter filterPlaceholder="Nhập giá"></Column>
                                <Column field="action" header="Hành động" body={actionBodyTemplate} headerStyle={{ width: '15em', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} filterElement={actionFilterElement} filter filterMatchMode="custom" />
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
    try {
        const res = await api.product.getList();
        
        if (res.status === 200) {
            if (res.data.code === 200) {
                res.data.result.forEach(x => {
                    let obj = {
                        name: "",
                        category: "",
                        date: "",
                        price: "",
                        id: ""
                    }
                    obj.id = x._id;
                    obj.name = x.name;
                    products.push(obj);
                })
            }
        }
    } catch (err) {
        console.log(err.message);
    }

    return {
        props: { products: products }
    }
}

export default Product;