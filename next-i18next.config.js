module.exports = {
    i18n: {
        locales: ['default', 'en', 'it'],
        defaultLocale: 'default',
        localeDetection: false,
    },
    trailingSlash: true,
    localePath:
        typeof window === 'undefined'
            ? require('path').resolve('./public/locales')
            : './public/locales',
    ns: ['common'],
}