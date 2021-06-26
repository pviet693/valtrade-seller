import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import classNames from 'classnames';

const SideBar = () => {

    const productRef = useRef(null);
    const router = useRouter();

    const activeCollapse = (link) => { return router.pathname.indexOf(link) > -1; }
    const activeLink = (link) => { return router.pathname === link; }

    useEffect(() => {
        // if (activeCollapse('/product')) {
        //     productRef.current.click();
        // }
    }, []);

    return (
        <section>
            <div id="sidebar-nav" className="sidebar">
                <div className="sidebar-scroll">
                    <nav>
                        <ul className="nav">
                            <li>
                                <a href="#product" data-toggle="collapse" className={classNames("collapsed", { "active": activeCollapse('/product') })} ref={productRef}><i className="lnr lnr-book"></i> <span>Quản lí sản phẩm</span> <i className="icon-submenu lnr lnr-chevron-right" ref={productRef}></i></a>
                                <div id="product" className="collapse">
                                    <ul className="nav">
                                        <li><Link href="/product"><a className={classNames({ "active": activeLink('/product') })}>Tất cả sản phẩm</a></Link></li>
                                        <li><Link href="/product/add-new-product"><a className={classNames({ "active": activeLink('/product/add-new-product') })}>Thêm sản phẩm</a></Link></li>
                                        <li><Link href="/product/product-report"><a className={classNames({ "active": activeLink('/product/product-report') })}>Sản phẩm vi phạm</a></Link></li>
                                    </ul>
                                </div>
                            </li>
                            <li>
                                <a href="#auction" data-toggle="collapse" className="collapsed"><i className="lnr lnr-clock"></i> <span>Quản lí đấu giá</span> <i className="icon-submenu lnr lnr-chevron-right"></i></a>
                                <div id="auction" className="collapse ">
                                    <ul className="nav">
                                        <li><Link href="/auction"><a className={classNames({ "active": activeLink('/auction') })}>Tất cả sản phẩm</a></Link></li>
                                        <li><Link href="/auction/add-new-auction"><a className={classNames({ "active": activeLink('/auction/add-new-auction') })}>Thêm sản phẩm</a></Link></li>
                                        <li><Link href="/auction/auction-report"><a className={classNames({ "active": activeLink('/auction/auction-report') })}>Sản phẩm vi phạm</a></Link></li>
                                    </ul>
                                </div>
                            </li>
                            <li><a href="tables.html" className=""><i className="lnr lnr-list" aria-hidden></i> <span>Quản lí đơn đặt hàng</span></a></li>
                            <li><Link href="/delivery-setting"><a href="tables.html" className={classNames({ "active": activeLink('/shipping')})}><i className="lnr lnr-car"></i> <span>Cài đặt vận chuyển</span></a></Link></li>
                            <li><a href="tables.html" className=""><i className="lnr lnr-chart-bars"></i> <span>Thống kê</span></a></li>
                            <li>
                                <a href="#shop" data-toggle="collapse" className="collapsed"><i className="lnr lnr-store"></i> <span>Quản lí cửa hàng</span> <i className="icon-submenu lnr lnr-chevron-right"></i></a>
                                <div id="shop" className="collapse ">
                                    <ul className="nav">
                                        <li>
                                            <Link href="/shop/rating-information">
                                                <a className={classNames({ "active": activeLink("/shop/rating-information") })}>
                                                    Đánh giá shop
                                                </a>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/shop/decorate">
                                                <a className={classNames({ "active": activeLink('/shop/decorate') })}>
                                                    Trang trí shop
                                                </a>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/shop/update-information">
                                                <a className={classNames({ "active": activeLink('/shop/update-information') })}>
                                                    Cập nhật thông tin shop
                                                </a>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li><a href="tables.html" className=""><i className="lnr lnr-bubble"></i> <span>Chăm sóc khách hàng</span></a></li>
                        </ul>
                    </nav>
                </div>
            </div>
        </section>
    )
}

export default SideBar;