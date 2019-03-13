require('dotenv').config();
let defaultConfig = {
    port: process.env.DEV_PORT,
    ip: process.env.DEV_IP_ADDRESS,
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    awsBucketUrl: process.env.AWS_BUCKET_URL
}
const envConfig = () => {
    switch(process.env.NODE_ENV) {
        case 'development':
            return defaultConfig
        case 'production':
            return {
                ...defaultConfig,
                port: process.env.PROD_PORT,
                ip: process.env.PROD_IP_ADDRESS
            }
        default:
            return defaultConfig
    }
}
module.exports = envConfig();