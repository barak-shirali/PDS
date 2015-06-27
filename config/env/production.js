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
    },
    DRIVER_WAITING_TIME: 15,
    braintree: {
        SANDBOX: true,
        MERCHANT_ID: '8kvwzvn2y5gjfm4f',
        PUBLIC_KEY: '9w7mcdj38zgvh4bs',
        PRIVATE_KEY: 'd7f7a956c33cd1d34b57ff326909401b',
        CES_KEY: 'MIIBCgKCAQEA23jg6vY/GXVVt/pLlAJD0drFgn993AprglOO07PW7Y1qpvj8x/fVjz+7AfdXLEYa/vKnM/RwdB09xd73ZzLKJybYrMij/W5PGBns6hi1upbC+Iq/NTzxES7E4BhRKOPbCvhzf5vI6Z8QNVj8fqBRXn2pt8MQEOPDRydR9KZRAt1GPaZAzXFWfTOP1ebyPYCcmCZhrfahieP4eE6RQHpg1LAlWAjRKxVqbes5GvXqDy5lYSmzSIB8/V8sCT154BOOkURTs9dOPlWBKMOFXpxNplQSNPp6WdiVBzlbOHhZe4CLkkm+sWFRNpNtZN9badfRJHytBLmQjcr4ATf7jeRdtwIDAQAB'
    },
    paypal: {
        mode: 'sandbox',
        client_id: 'AVuxHSr0Trj668DhjV7jJ81hsPhvU3ffkLCviEhcqDYpl6TOUKphgiNh6XXu-40sa31M914UpxMqG3jv',
        client_secret: 'EI0b86_b-m-lzpvwDJ41TwXJUDwBr5WRxNZ4IEWf-RA8oiUcnRij5uYDq9qli9diB9d63_IDX07O9ZNN'
    },
    PAYPAL_BUSINESS_ACCOUNT: 'remitsysca-facilitator@gmail.com',
    paypal_classic: {
        userId: 'remitsysca-facilitator_api1.gmail.com',
        password: 'V8YBRL7SANDF4YT2',
        signature: 'AXUyLV10RCoJZfQetH35RyZZ7xxYALfYJz7prILudn6sdRBR9Ily65qg',
        sandbox: true
    },
    FEE: 10
}