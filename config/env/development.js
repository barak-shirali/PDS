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
    facebook: {
        clientID: "714935035319726",
        clientSecret: "3d4a9c12c4f14fe06ebd76e481cf800c",
        callbackURL: "http://localhost:3000/auth/facebook/callback"
    },
    filepicker: {
        api_key: "AAIOY2BF3R3qjcrvz9lxXz"
    },
    smtp: {
        host: 'smtp.mandrillapp.com',
        port: 587,
        username: 'gareth@webfire.co.uk',
        password: 'bqH_kGZC5NDrXjHrrFBEdw'
    }
}
