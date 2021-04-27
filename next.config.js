module.exports = {
    devIndicators: {
        autoPrerender: false,
    },
    async redirects() {
        return [
            {
                source: '/',
                destination: '/product',
                permanent: true,
            },
        ]
    },
}