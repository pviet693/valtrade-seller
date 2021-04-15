import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>
                    {/* <meta name="description" content="VALTRADE"/>
                    <meta charSet="utf-8"/>
                    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"/> */}
                    {/* VENDOR CSS */}
                    <link rel="stylesheet" href="/static/assets/vendor/bootstrap/css/bootstrap.min.css"/>
                    <link rel="stylesheet" href="/static/assets/vendor/font-awesome/css/font-awesome.min.css"/>
                    <link rel="stylesheet" href="/static/assets/vendor/linearicons/style.css"/>
                    <link rel="stylesheet" href="/static/assets/vendor/toastr/toastr.min.css"/>
                    {/* MAIN CSS */}
                    <link rel="stylesheet" href="/static/assets/css/main.css"/>
                    {/* GOOGLE FONTS */}
                    <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700" rel="stylesheet"/>
                    {/* ICONS */}
                    <link rel="apple-touch-icon" sizes="76x76" href="/public/assets/img/apple-icon.png"/>
                    <link rel="icon" type="image/png" sizes="96x96" href="/static/assets/img/favicon.png"></link>
                    {/* JAVASCRIPT */}
                    <script src="/static/assets/vendor/jquery/jquery.min.js"></script>
                    <script src="/static/assets/vendor/bootstrap/js/bootstrap.min.js"></script>
                    <script src="/static/assets/vendor/jquery-slimscroll/jquery.slimscroll.min.js"></script>
                    <script src="/static/assets/scripts/klorofil-common.js"></script>
                    <script src="/static/assets/vendor/chartist/js/chartist.min.js"></script>
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument;