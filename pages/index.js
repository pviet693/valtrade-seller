import Head from 'next/head';
import Link from "next/link";
import React, { useEffect, useState } from 'react';
import StatusCard from '../components/Dashboard/StatusCard';
import Table from '../components/Dashboard/Table';
import Badge from '../components/Dashboard/Badge';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
import api from "../utils/backend-api.utils";
import * as common from "../utils/common.utils";
import Moment from "moment";

const orderStatus = {
    "shipping": "primary",
    "pending": "warning",
    "paid": "success",
    "refund": "danger"
}

const renderOrderHead = (item, index) => (
    <th key={index}>{item}</th>
)

const renderOrderBody = (item, index) => (
    <tr key={index}>
        <td>{item.user}</td>
        <td>{common.numberWithCommas(item.price)} đ</td>
        <td>{Moment(new Date(item.date)).format("DD/MM/YYYY hh:mm:ss A")}</td>
        <td>
            <Badge type={orderStatus[item.status]} content={item.status} />
        </td>
    </tr>
);

const options = {
    color: ['#6ab04c', '#2980b9'],
    chart: {
        background: 'transparent'
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth'
    },
    xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    legend: {
        position: 'top'
    },
    grid: {
        show: false
    }
};

export default function Home() {
    const [statusCards, setStatusCards] = useState([
        {
            icon: "bx bx-shopping-bag",
            count: 0,
            title: "Số lượng giao dịch"
        },
        {
            icon: "bx bx-cart",
            count: 0,
            title: "Đánh giá"
        },
        {
            icon: "bx bx-dollar-circle",
            count: 0,
            title: "Doanh thu"
        },
        {
            icon: "bx bx-receipt",
            count: 0,
            title: "Số lượng đơn hàng"
        }
    ]);
    const [latestOrders, setLatestOrders] = useState({
        header: [
            "Người dùng",
            "Tổng giá",
            "Ngày đặt",
            "Trạng thái"
        ],
        body: []
    });
    const [series, setSeries] = useState(
        [
            {
                name: 'Sản phẩm đấu giá',
                data: [
                    0,
                    0,
                    0,
                    0,
                    0,
                    11,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
                ]
            },
            {
                name: 'Sản phẩm thường',
                data: [
                    0,
                    0,
                    0,
                    0,
                    2,
                    33,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0
                ]
            }
        ]
    );

    const getInitData = async () => {
        try {
            const response = await api.dashboard.getDashboard();
            console.log(response);

            if (response.data.code === 200) {
                const { result } = response.data;
                const { infor, listOrder } = result;
                const {
                    countTransfer,
                    countOrder,
                    rateMedium,
                    totalValue,
                    bidPermonth,
                    productPermonth
                } = infor;

                const newStatusCards = [...statusCards];
                newStatusCards[0].count = common.numberWithCommas(countTransfer);
                newStatusCards[1].count = common.numberWithCommas((rateMedium / 20).toFixed(1));
                newStatusCards[2].count = `${common.numberWithCommas(totalValue)} đ`;
                newStatusCards[3].count = common.numberWithCommas(countOrder);
                setStatusCards(newStatusCards);

                let newSeries = [...series];
                newSeries[0].data = bidPermonth.data;
                newSeries[1].data = productPermonth.data;
                setSeries(newSeries);

                let newLatestOrders = { ...latestOrders };
                listOrder.forEach((order) => {
                    const { inforOrder } = order;
                    const {
                        nameRecei,
                        timeOrder,
                        price,
                        stateOrder
                    } = inforOrder;
                    const status = stateOrder[stateOrder.length - 1].state;
                    newLatestOrders.body.push({
                        user: nameRecei,
                        date: timeOrder,
                        price: price,
                        status
                    })
                });

                setLatestOrders(newLatestOrders);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        console.log(series, "1");
    }, [series]);

    useEffect(() => {
        getInitData();
    }, []);

    return (
        <>
            <div className="dashboard-container">
                <h2 className="page-header">Thống kê</h2>
                <div className="row d-flex flex-wrap">
                    <div className="col-md-6">
                        <div className="row d-flex flex-wrap">
                            {
                                statusCards.map((item, index) => (
                                    <div className="col-md-6 flex-wrap" key={index}>
                                        <StatusCard
                                            icon={item.icon}
                                            count={item.count}
                                            title={item.title}
                                        />
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card full-height">
                            {/* chart */}
                            <Chart
                                options={{
                                    ...options,
                                    theme: { mode: 'light' }
                                }}
                                series={series}
                                type='line'
                                height='100%'
                            />
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card__header">
                                <h3>Đơn hàng gần nhất</h3>
                            </div>
                            <div className="card__body">
                                <Table
                                    headData={latestOrders.header}
                                    renderHead={(item, index) => renderOrderHead(item, index)}
                                    bodyData={latestOrders.body}
                                    renderBody={(item, index) => renderOrderBody(item, index)}
                                />
                            </div>
                            <div className="card__footer">
                                <Link href="/order"><a>View All</a></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
