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
    facebook: {
        clientID: "939798702707031",
        clientSecret: "35c86582a0c8c9384cf37d8ba3adca21",
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