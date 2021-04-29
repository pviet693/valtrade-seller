import Head from 'next/head';
import { Calendar } from 'primereact/calendar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import LoadingBar from "react-top-loading-bar";
import cookie from "cookie";
import api from './../../utils/backend-api.utils';
import * as common from './../../utils/common.utils';
import Moment from 'moment';
Moment.locale('en');

const Auction = (props) => {
    const router = useRouter();
    const { auctions } = props;
    const [listAuctions, setListAuctions] = useState(auctions);
    const [dateFrom, setDateFrom] = useState(null);
    const [dateTo, setDateTo] = useState(null);
    const [dateFilter, setDateFilter] = useState(null);
    const dt = useRef(null);
    const refLoadingBar = useRef(null);

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="d-flex align-items-center justify-content-center">
                <button type="button" className="btn btn-danger mr-2" onClick={() => deleteAuction(rowData.id)}><i className="fa fa-trash-o" aria-hidden></i> Xóa</button>
                <button type="button" className="btn btn-primary" onClick={() => viewDetail(rowData.id)}><i className="fa fa-edit" aria-hidden></i> Sửa</button>
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
            <Calendar value={dateFilter} onChange={onDateFilterChange} dateFormat="dd/mm/yy" placeholder="dd/mm/yyyy" id="pr_id_15" />
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

    const deleteAuction = async (id) => {
        common.ConfirmDialog('Xác nhận', 'Bạn muốn xóa sản phẩm này?')
            .then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        refLoadingBar.current.continuousStart();

                        const res = await api.product.delete(id);

                        refLoadingBar.current.complete();

                        if (res.status === 200) {
                            if (res.data.code === 200) {
                                let newListAuctions = auctions.filter(x => x.id !== id);
                                setListAuctions(newListAuctions);
                                common.Toast('Xóa sản phẩm thành công.', 'success');
                            } else {
                                common.Toast('Xóa sản phẩm thất bại.', 'error');
                            }
                        }
                    } catch (error) {
                        refLoadingBar.current.complete();
                        common.Toast(error, 'error');
                    }
                }
            })
    }

    const viewDetail = (id) => {
        router.push(`/auction/detail/${id}`);
    }

    const dateFilterElement = renderDateFilter();
    const actionFilterElement = renderActionFilter();

    return (
        <div className="list-auction">
            <Head>
                <title>
                    Tất cả sản phẩm
                </title>
            </Head>
            <LoadingBar color="#00ac96" ref={refLoadingBar} />
            <div className="custom-tabs-line tabs-line-bottom">
                <ul className="nav" role="tablist">
                    <li className="active"><a href="#all-auction" role="tab" data-toggle="tab">Tất cả <span className="badge bg-danger">7</span></a></li>
                    <li><a href="#on-sale-auction" role="tab" data-toggle="tab">Đang bán <span className="badge bg-danger">7</span></a></li>
                    <li><a href="#sold-auction" role="tab" data-toggle="tab">Đã bán <span className="badge bg-danger">7</span></a></li>
                    <li><a href="#out-stock-auction" role="tab" data-toggle="tab">Hết hàng <span className="badge bg-danger">7</span></a></li>
                    <li><a href="#hidden-auction" role="tab" data-toggle="tab">Tạm ẩn <span className="badge bg-danger">7</span></a></li>
                    <li><a href="#lock-auction" role="tab" data-toggle="tab">Tạm khóa <span className="badge bg-danger">7</span></a></li>
                </ul>
                <hr />
                <div className="tab-content">
                    {/* All auction */}
                    <div className="tab-pane fade in active" id="all-auction">
                        <form>
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="name-auction" className="col-sm-2 col-form-label">Tên sản phẩm</label>
                                <div className="col-sm-6">
                                    <input type="text" className="form-control" id="name-auction" placeholder="Tên sản phẩm" name="name" />
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

                        <div className="table-list-auction">
                            <DataTable value={listAuctions}
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

                    {/* On sale auction */}
                    <div className="tab-pane fade in" id="on-sale-auction">
                        <form>
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="name-auction" className="col-sm-2 col-form-label">Tên sản phẩm</label>
                                <div className="col-sm-6">
                                    <input type="text" className="form-control" id="name-auction" placeholder="Tên sản phẩm" name="name" />
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

                        <div className="table-list-auction">
                            <DataTable value={listAuctions}
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

                    {/* Sold auction */}
                    <div className="tab-pane fade in" id="sold-auction">
                        <form>
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="name-auction" className="col-sm-2 col-form-label">Tên sản phẩm</label>
                                <div className="col-sm-6">
                                    <input type="text" className="form-control" id="name-auction" placeholder="Tên sản phẩm" name="name" />
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

                        <div className="table-list-auction">
                            <DataTable value={listAuctions}
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

                    {/* Out of stock auction */}
                    <div className="tab-pane fade in" id="out-stock-auction">
                        <form>
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="name-auction" className="col-sm-2 col-form-label">Tên sản phẩm</label>
                                <div className="col-sm-6">
                                    <input type="text" className="form-control" id="name-auction" placeholder="Tên sản phẩm" name="name" />
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

                        <div className="table-list-auction">
                            <DataTable value={listAuctions}
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

                    {/* Hidden auction */}
                    <div className="tab-pane fade in" id="hidden-auction">
                        <form>
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="name-auction" className="col-sm-2 col-form-label">Tên sản phẩm</label>
                                <div className="col-sm-6">
                                    <input type="text" className="form-control" id="name-auction" placeholder="Tên sản phẩm" name="name" />
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

                        <div className="table-list-auction">
                            <DataTable value={listAuctions}
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

                    {/* Lock auction */}
                    <div className="tab-pane fade in" id="lock-auction">
                        <form>
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="name-auction" className="col-sm-2 col-form-label">Tên sản phẩm</label>
                                <div className="col-sm-6">
                                    <input type="text" className="form-control" id="name-auction" placeholder="Tên sản phẩm" name="name" />
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

                        <div className="table-list-auction">
                            <DataTable value={listAuctions}
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
                </div>
            </div>

        </div>
    );
}

export async function getServerSideProps(ctx) {
    let auctions = [];
    const cookies = ctx.req.headers.cookie;
    if (cookies) {
        const token = cookie.parse(cookies).seller_token;
        if (token) {
            try {
                const res = await api.product.getList(token);
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
                            obj.category = x.categoryInfor.name;
                            obj.date = Moment(x.timePost).format("DD/MM/yyyy");
                            obj.price = x.price;
                            auctions.push(obj);
                        })
                    }
                }
            } catch (err) {
                console.log(err.message);
            }

            return {
                props: { auctions: auctions }
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

export default Auction;