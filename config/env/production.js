module.exports = {
    // This is your MYSQL Database configuration
    hostname: 'http://192.168.1.129:3001',
    port: 80,
    db: {
        host: "localhost",
        name: "remitsystem_db",
        password: "!@#456&*(0-=",
        username: "root"
    },
    app: {
        name: "Remit systems",
        admin_email: "barak.shirali@gmail.com",
        admin_name: "Remitsystems Support"
    },
    smtp: {
        host: 'smtp.mandrillapp.com',
        port: 587,
        username: 'gareth@webfire.co.uk',
        password: 'bqH_kGZC5NDrXjHrrFBEdw'
    },
    google: {
        API_KEY: 'AIzaSyDjzdw2V0hOYrLVhO2VBZscOewuufMlzKo'
    },
    twilio: {
        ACCOUNT_SID: 'AC987259e44d052a853d82b8b1ad789b95',
        AUTH_KEY: '8da6da829c50069bc4912684e2ca6dca',
        NUMBER: '+14152315532'
    }
}