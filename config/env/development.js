module.exports = {
    // This is your MYSQL Database configuration
    hostname: 'http://192.168.1.129:3002',
    port: 3002,
    db: {
        host: "192.168.1.129",
        name: "remitsystem_db",
        password: "",
        username: "root"
    },
    app: {
        name: "Remit system",
        admin_email: "barak.shiralii@gmail.com",
        admin_name: "Remitsystem.com Support"
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
