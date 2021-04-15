import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react';


export default function Home() {

    const router = useRouter();

    useEffect(() => {
        router.push('/product');
    }, [])

    return (
        <>
            <Head>
                <title>Quản lí sản phẩm</title>
            </Head>
            <p>Quản lí sản phẩm</p>
        </>
    )
}
