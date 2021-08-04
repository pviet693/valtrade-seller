import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Calendar } from 'primereact/calendar';
import { useEffect, useState } from 'react';
import api from './../../utils/backend-api.utils';
import * as common from './../../utils/common.utils';
import Moment from 'moment';
Moment.locale('en');


const ReportDetail = (props) => {
    const router = useRouter();
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);
    const { id } = props;

    const [report, setReport] = useState({
        name: "",
        link: "",
        reporter: "",
        poster: "",
        content: "",
        dateReport: "",
        title: ""
    });
    useEffect(async () => {
        try {
            const res = await api.product.getDetailReport(id);
            console.log(res);
            if (res.status === 200) {
                if (res.data.code === 200) {
                    const data = res.data.result;
                    let reportDetail = {};
                    reportDetail.name = data.reportId.name || "";
                    reportDetail.link = `https://valtrade-seller.me/product/detail/${data.reportId._id}`
                    reportDetail.reporter = data.reportId.sellerInfor.nameOwner || "";
                    reportDetail.poster = data.userReport.name || "";
                    reportDetail.content = data.content || "";
                    reportDetail.dateReport = data.timeReport ? Moment(data.timeReport).format("DD/MM/yyyy") : "";
                    reportDetail.title = data.title || "";
                    setReport(reportDetail);
                }
            }
        } catch(error) {
            common.Toast(error, 'error');
        }
    }, [])

    const back = () => {
        router.push('/product-report');
    }
    
    return (
        <>
            <Head>
                <title>
                    Chi tiết tố cáo
                </title>
            </Head>
            <div className="report-detail-container">
                <div className="report-detail-title">
                    <Link href="/manage/report">
                        <a className="d-flex align-items-center">
                            <i className="pi pi-angle-left mr-1"></i>
                            <div>Quản lí sản phẩm bị tố cáo</div>
                        </a>
                    </Link>
                </div>
                <div className="report-detail-content">
                    <div className="row d-flex">
                        <div className="col-md-12">
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="name" className="col-md-3 col-form-label">Tên sản phẩm</label>
                                <div className="col-md-9">
                                    <input type="text" className="form-control" id="name" placeholder="Tên sản phẩm" name="name" defaultValue={report.name} disabled/>
                                </div>
                            </div>
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="link" className="col-md-3 col-form-label">Link sản phẩm</label>
                                <div className="col-md-9">
                                    <div className="form-control">
                                        <a href={report.link} target="_blank">{report.link}</a>
                                    </div>
                                    {/* <input type="text" className="form-control" id="link" placeholder="Link sản phẩm" name="link" defaultValue={report.link} /> */}
                                </div>
                            </div>
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="title" className="col-md-3 col-form-label">Tiêu đề báo cáo</label>
                                <div className="col-md-9">
                                    <input type="text" className="form-control" id="title" placeholder="Tiêu đề báo cáo" name="title" defaultValue={report.title} disabled/>
                                </div>
                            </div>
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="content" className="col-md-3 col-form-label">Nội dung báo cáo</label>
                                <div className="col-md-9">
                                    <input type="text" className="form-control" id="content" placeholder="Nội dung báo cáo" name="content" defaultValue={report.content} disabled/>
                                </div>
                            </div>
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="dateReport" className="col-md-3 col-form-label">Ngày báo cáo</label>
                                <div className="col-md-9">
                                    <input type="text" className="form-control" id="dateReport" placeholder="Ngày báo cáo" name="dateReport" defaultValue={report.dateReport} disabled/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
            <div className="report-detail-footer">
                <button className="btn btn--back" onClick={back}>Trở về</button>

                <div>
                        {
                            isLoadingDelete &&
                            <button type="button" className="btn button-delete mr-4" disabled="disabled"><i className="fa fa-spinner fa-spin mr-2" aria-hidden></i>Xử lí...</button>
                        }
                </div>
            </div>
        </>
    )
}

export async function getServerSideProps(ctx) {
    const id = ctx.query.id;

    return {
        props: { id: id }
    }
}

export default ReportDetail;