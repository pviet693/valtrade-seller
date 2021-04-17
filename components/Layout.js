import React from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

const SlideBarComponent = dynamic(() => import('./SideBar'));
const NavBarComponent = dynamic(() => import('./NavBar'));

function Layout({ children }) {

    const router = useRouter();

    return (
        <div>
            {
                !['/signin', '/register', '/register-done', '/verify', '/verify-done'].includes(router.pathname) &&
                <div id="wrapper">
                    <NavBarComponent />
                    <SlideBarComponent />
                    <div className="main">
                        <div className="main-content">
                            <section className="container-fluid">
                                <main>{children}</main>
                            </section>
                        </div>
                    </div>
                </div>
            }
            {
                ['/signin', '/register', '/register-done', '/verify', '/verify-done'].includes(router.pathname) &&
                <>
                    <main>{children}</main>
                </>
            }
        </div>
    )
}

export default Layout;