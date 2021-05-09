import '../styles/globals.css';
import '../styles/common.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import '../styles/register.scss';
import '../styles/register-done.scss';
import '../styles/verify.scss';
import '../styles/verify-done.scss';
import '../styles/verify-account.scss';
// import 'primeflex/primeflex.css';
import '../styles/sidebar.css';
import '../styles/product/list-product.scss';
import '../styles/product/product-add-new.scss';
import '../styles/product/product-detail.scss';
import '../styles/auction/list-auction.scss';
import '../styles/auction/auction-add-new.scss';
import '../styles/auction/auction-detail.scss';
import '../styles/delivery-setting.scss';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { DataProvider } from '../store/GlobalState';
import Router from 'next/router';
import NProgress from 'nprogress'; //nprogress module
import 'nprogress/nprogress.css'; //styles of nprogress

//Binding events. 
Router.events.on('routeChangeStart', () => NProgress.start()); 
Router.events.on('routeChangeComplete', () => NProgress.done()); 
Router.events.on('routeChangeError', () => NProgress.done());

const Layout = dynamic(() => import('../components/Layout'));

function MyApp({ Component, pageProps }) {
    return (
        <DataProvider>
            {/* <Head> */}
                {/* <link rel="shortcut icon" type="image/x-icon" href="/static/logo-title.png" /> */}
            {/* </Head> */}
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </DataProvider>
    )
}

export default MyApp;
