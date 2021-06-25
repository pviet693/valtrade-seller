import Link from 'next/link';
import Cookie from 'js-cookie';
import { useRouter } from 'next/router';

const NavBar = () => {
    const router = useRouter();
    const changeSearch = (e) => {
        
    }

    const logout = () => {
        Cookie.remove("seller_token");
        router.push('/signin');
    }


    return (
        <>
            <nav className="navbar navbar-default navbar-fixed-top">
                <div className="brand">
                    <Link href="/product"><a><img src="/static/assets/img/logo-dark.png" alt="Logo" className="img-responsive logo" /></a></Link>
                </div>
                <div className="container-fluid">
                    <div className="navbar-btn">
                        <button type="button" className="btn-toggle-fullwidth"><i className="lnr lnr-arrow-left-circle"></i></button>
                    </div>
                    <form className="navbar-form navbar-left">
                        <div className="input-group">
                            <input type="text" value="" name="search" className="form-control" placeholder="Tìm kiếm..." onChange={changeSearch} />
                            <span className="input-group-btn"><button type="button" className="btn btn-primary">Tìm</button></span>
                        </div>
                    </form>
                    <div id="navbar-menu">
                        <ul className="nav navbar-nav navbar-right">
                            <li className="dropdown">
                                <a href="#" className="dropdown-toggle icon-menu" data-toggle="dropdown">
                                    <i className="lnr lnr-alarm"></i>
                                    <span className="badge bg-danger">5</span>
                                </a>
                                <ul className="dropdown-menu notifications" style={{ height: '200px', background: '#fff' }}>
                                    {/* <li><a href="#" className="notification-item"><span className="dot bg-warning"></span>System space is almost full</a></li>
                                    <li><a href="#" className="notification-item"><span className="dot bg-danger"></span>You have 9 unfinished tasks</a></li>
                                    <li><a href="#" className="notification-item"><span className="dot bg-success"></span>Monthly report is available</a></li>
                                    <li><a href="#" className="notification-item"><span className="dot bg-warning"></span>Weekly meeting in 1 hour</a></li>
                                    <li><a href="#" className="notification-item"><span className="dot bg-success"></span>Your request has been approved</a></li>
                                    <li><a href="#" className="more">See all notifications</a></li> */}
                                </ul>
                            </li>
                            <li className="dropdown">
                                <a href="#" className="dropdown-toggle" data-toggle="dropdown"><img src="/static/assets/img/user.png" className="img-circle" alt="Avatar" /> <span>PhamViet693</span> <i className="icon-submenu lnr lnr-chevron-down"></i></a>
                                <ul className="dropdown-menu">
                                    <li><a href="/profile"><i className="lnr lnr-user"></i> <span>Tài khoản của tôi</span></a></li>
                                    <li><a href="#"><i className="lnr lnr-envelope"></i> <span>Tin nhắn</span></a></li>
                                    <li><a href="#"><i className="lnr lnr-cog"></i> <span>Cài đặt</span></a></li>
                                    <li onClick={logout}><a href="#"><i className="lnr lnr-exit"></i> <span>Đăng xuất</span></a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default NavBar;