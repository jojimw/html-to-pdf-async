const dotenv = require('dotenv');
dotenv.config();
const envConfig = () => {
    switch(process.env.NODE_ENV) {
        case 'development':
            return {
                port: process.env.DEV_PORT,
                ip: process.env.DEV_IP_ADDRESS
            }
        case 'production':
            return {
                port: process.env.PROD_PORT,
                ip: process.env.PROD_IP_ADDRESS
            }
    }
}
module.exports = envConfig();