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
import api from '../../utils/backend-api.utils';
import * as common from '../../utils/common.utils';
import { useFormik } from 'formik';
import Moment from 'moment';
Moment.locale('en');
import Router from 'next/router';

const ProductReport = (props) => {
    const router = useRouter();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
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
            getListReport();
        },
        onReset: () => {
            getListReport();
        }
    });

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="d-flex align-items-center justify-content-center">
                <button type="button" className="btn btn-primary" onClick={() => viewDetail(rowData.id)}><i className="fa fa-edit" aria-hidden></i> Chi tiết</button>
            </div>
        );
    }

    const viewDetail = (id) => {
        Router.push({
            pathname: '/report-detail/[id]',
            query: { id: id },
        }, null, { shallow: true });
    }

    useEffect(() => {
        getListReport();
    }, []);

    const getListReport = async () => {
        try {
            setLoading(true);

            const res = await api.product.getListReport();
            if (res.status === 200) {
                if (res.data.code === 200) {
                    let listReport = [];
                    res.data.result.map(item => {
                        let report = {};
                        report.id = item._id || "";
                        report.nameProduct = item.reportId.name|| "";
                        report.timeReport = Moment(item.timeReport).format("DD/MM/yyyy");
                        report.reason = item.title || "";
                        listReport.push(report);
                    })
                    setReports(() => listReport);

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

    return (
        <div className="list-product">
            <Head>
                <title>
                    Quản lí sản phẩm bị vi phạm
                </title>
            </Head>
            <LoadingBar color="#00ac96" ref={refLoadingBar} />
            <div className="custom-tabs-line tabs-line-bottom">
                <ul className="nav" role="tablist">
                    <li className="active"><a href="#all-product" role="tab" data-toggle="tab">Tất cả <span className="badge bg-danger">10</span></a></li>
                </ul>
                <hr />
                <div className="tab-content">
                    {/* All product */}
                    <div className="tab-pane fade in active" id="all-product">
                    
                        <div className="table-list-product">
                            <DataTable
                                removableSort
                                scrollable scrollHeight="100%"
                                ref={dt} value={reports} 
                                loading={loading}
                                emptyMessage="Không có kết quả"
                            >
                                <Column field="nameProduct" header="Tên sản phẩm" sortable filterElement={NoneFilter()} filter filterMatchMode="custom"></Column>
                                <Column field="timeReport" header="Ngày tố cáo" sortable filterElement={NoneFilter()} filter filterMatchMode="custom"></Column>
                                <Column field="reason" header="Lý do" sortable filterElement={NoneFilter()} filter filterMatchMode="custom"></Column>
                                <Column field="action" header="Hành động" body={actionBodyTemplate} headerStyle={{ width: '15em', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} filterElement={NoneFilter()} filter filterMatchMode="custom" />
                            </DataTable>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductReport;