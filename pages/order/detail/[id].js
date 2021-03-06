import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import LoadingBar from "react-top-loading-bar";
import api from './../../../utils/backend-api.utils';
import * as common from './../../../utils/common.utils';
import Moment from 'moment';
import { Button } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
Moment.locale('en');

const OrderDetail = (props) => {
    const router = useRouter();
    const { id } = props;
    const [order, setOrder] = useState({
        id: "",
        orderer: "",
        stateOrder: "",
        total_price: "",
        isAccept: false,
        date_order: "",
        phone_order: "",
        address_order: "",
        payment: "",
        shipType: ""
    });
    const [isLoadingDecline, setIsLoadingDecline] = useState(false);
    const [isLoadingAccept, setIsLoadingAccept] = useState(false);
    const refLoadingBar = useRef(null);

    const back = () => {
        router.push('/order');
    }

    useEffect(async () => {
        try {
            const res = await api.order.getOrderDetail(id);
            console.log(Object.keys(res.data.result.inforOrder.shipType)[0]);
            if (res.status === 200) {
                if (res.data.code === 200) {
                    let orderDetail = {
                        id: "",
                        orderer: "",
                        stateOrder: "",
                        total_price: "",
                        isAccept: false,
                        date_order: "",
                        phone_order: "",
                        address_order: "",
                        payment: "",
                        shipType: ""
                    };
                    orderDetail.id = res.data.result._id || "";
                    orderDetail.orderer = res.data.result.inforOrder.nameRecei || "";
                    orderDetail.stateOrder = res.data.result.inforOrder.stateOrder[res.data.result.inforOrder.stateOrder.length-1].state || "";
                    orderDetail.total_price = `${common.numberWithCommas(res.data.result.inforOrder.total)} VND`  || "";
                    orderDetail.isAccept = res.data.result.inforOrder.isShopAccept || "";
                    orderDetail.date_order = res.data.result.inforOrder.timeOrder ? Moment(res.data.result.inforOrder.timeOrder).format("DD/MM/yyyy") : "";
                    orderDetail.phone_order = res.data.result.inforOrder.contact || "";
                    orderDetail.address_order = res.data.result.inforOrder.addressOrder || "";
                    orderDetail.payment = res.data.result.inforOrder.payment === 'vnpay' ? 'VNPAY' : (res.data.result.inforOrder.payment === 'paypal' ? 'Paypal' : 'Ti???n m???t');
                    orderDetail.shipType = Object.keys(res.data.result.inforOrder.shipType)[0] === 'ghn' ? 'Giao h??ng nhanh' : (Object.keys(res.data.result.inforOrder.shipType)[0] === 'ghtk' ? 'Giao h??ng ti???t ki???m' : 'Nh???n h??ng t???i shop') ,
                    setOrder(orderDetail);
                }
            }
        } catch(error) {
            common.Toast(error, 'error');
        }
    }, [])

    const acceptOrder = () => {
        common.ConfirmDialogOrder('X??c nh???n', 'B???n mu???n ph?? duy???t ????n h??ng n??y?')
            .then(async (result) => {
                if (result.isConfirmed) {
                    setIsLoadingAccept(true);
                    refLoadingBar.current.continuousStart();
                    try {
                        const res = await api.order.appoveOrder(id);
                        setIsLoadingAccept(false);
                        refLoadingBar.current.complete();
                        if (res.status === 200) {
                            if (res.data.code === 200) {
                                common.Toast('Ph?? duy???t ????n h??ng th??nh c??ng.', 'success')
                                        .then(async() => {
                                            const detail = await api.order.getOrderDetail(id);
                                            if (detail.status === 200){
                                                if (detail.data.code === 200){
                                                    router.push(`/order/detail/${id}`);
                                                }
                                            }
                                        });
                            }
                            else if (res.data.code === 300){
                                const message = res.data.message;
                                common.Toast(message, 'error');
                            }
                        }
                    } catch(error) {
                        setIsLoadingAccept(false);
                        refLoadingBar.current.complete();
                        common.Toast(error, 'error');
                    }
                }
            });
    }

    const rejectOrder = () => {
        
    }

    return (
        <>
            <Head>
                <title>
                    Chi ti???t ????n ?????t h??ng
                </title>
            </Head>
            <LoadingBar color="#00ac96" ref={refLoadingBar} />
            <div className="order-detail-container">
                <div className="order-detail-title">
                    <Link href="/order">
                        <a className="d-flex align-items-center">
                            <i className="pi pi-angle-left mr-1"></i>
                            <div>Qu???n l?? ????n ?????t h??ng</div>
                        </a>
                    </Link>
                </div>
                <div className="order-detail-content">
                    <div className="row d-flex">
                        <div className="col-md-8">
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="id" className="col-md-3 col-form-label">M?? ????n ?????t h??ng</label>
                                <div className="col-md-9">
                                    <input type="text" className="form-control" id="id" placeholder="M?? ????n ?????t h??ng" name="id" defaultValue={order.id} disabled />
                                </div>
                            </div>
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="orderer" className="col-md-3 col-form-label">Ng?????i ?????t h??ng</label>
                                <div className="col-md-9">
                                    <input type="phone" className="form-control" id="orderer" placeholder="Ng?????i ?????t h??ng" name="orderer" defaultValue={order.orderer} disabled />
                                </div>
                            </div>
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="phone" className="col-md-3 col-form-label">S??? ??i???n tho???i ?????t h??ng</label>
                                <div className="col-md-9">
                                    <input type="phone" className="form-control" id="phone" placeholder="S??? ??i???n tho???i" name="phone" defaultValue={order.phone_order} disabled/>
                                </div>
                            </div>
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="date_order" className="col-md-3 col-form-label">Ng??y ?????t h??ng</label>
                                <div className="col-md-9">
                                    <input type="text" className="form-control" id="date_order" placeholder="Ng??y ?????t h??ng" name="date_order" defaultValue={order.date_order} disabled/>
                                </div>
                            </div>
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="total" className="col-md-3 col-form-label">T???ng ti???n</label>
                                <div className="col-md-9">
                                    <input type="email" className="form-control" id="total" placeholder="T???ng ti???n" name="total" defaultValue={order.total_price} disabled/>
                                </div>
                            </div>
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="address" className="col-md-3 col-form-label">?????a ch??? giao h??ng</label>
                                <div className="col-md-9">
                                    <input type="text" className="form-control" id="address" placeholder="?????a ch???" name="address" defaultValue={order.address_order} disabled/>
                                </div>
                            </div>
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="stateOrder" className="col-md-3 col-form-label">Tr???ng th??i ????n h??ng</label>
                                <div className="col-md-9">
                                    <input type="text" className="form-control" id="stateOrder" placeholder="Tr???ng th??i" name="stateOrder" defaultValue={order.stateOrder} disabled/>
                                </div>
                            </div>
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="shipType" className="col-md-3 col-form-label">????n v??? giao h??ng</label>
                                <div className="col-md-9">
                                    <input type="text" className="form-control" id="shipType" placeholder="????n v??? giao h??ng" name="shipType" defaultValue={order.shipType} disabled/>
                                </div>
                            </div>
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="payment" className="col-md-3 col-form-label">Ph????ng th???c thanh to??n</label>
                                <div className="col-md-9">
                                    <input type="text" className="form-control" id="payment" placeholder="Ph????ng th???c thanh to??n" name="payment" defaultValue={order.payment} disabled/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="order-detail-footer">
                    <button className="btn btn-back" onClick={back}>Tr??? v???</button>    
                    {
                        order.isAccept ? (
                            <div>
                                <Button className="btn btn-accepted disabled">???? ph?? duy???t</Button>
                            </div>
                        ) : (
                            <div>
                                {
                                    isLoadingDecline ?
                                    <button type="button" className="btn btn-decline" disabled="disabled"><i className="fa fa-spinner fa-spin mr-2" aria-hidden></i>X??? l??...</button>
                                    :
                                    <Button className="btn btn-decline" startIcon={<ClearIcon />} onClick={rejectOrder}>T??? ch???i</Button>
                                }
                                {
                                    isLoadingAccept ?
                                    <button type="button" className="btn btn-accept" disabled="disabled"><i className="fa fa-spinner fa-spin mr-2" aria-hidden></i>X??? l??...</button>
                                    :
                                    <Button className="btn btn-accept" startIcon={<CheckIcon />} onClick={acceptOrder}>Ph?? duy???t</Button>
                                }
                            </div>
                        )
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

export default OrderDetail;