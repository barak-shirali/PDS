
/**
	* User Model
	*/

var crypto = require('crypto');
var _ = require('lodash');

module.exports = function(sequelize, DataTypes) {

	var User = sequelize.define('User', 
		{
			firstname: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: ""
			},
			lastname: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: ""
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: ""
			},
			type: {
				type: DataTypes.ENUM('ADMIN', 'SRS', 'DRIVER'),
				defaultValue: 'DRIVER'
			},
			latitude: {
				type: DataTypes.FLOAT,
				defaultValue: 0
			},
			longitude: {
				type: DataTypes.FLOAT,
				defaultValue: 0
			},
			address: {
				type: DataTypes.STRING,
				defaultValue: ""
			},
			phone: {
				type: DataTypes.STRING,
				defaultValue: ""
			},
			onlineStatus: {
				type: DataTypes.ENUM('ONLINE', 'BUSY', 'AWAY', 'OFFLINE'),
				defaultValue: 'OFFLINE'
			},
			hashedPassword: {
				type: DataTypes.STRING,
				defaultValue: ""
			},
			salt: {
				type: DataTypes.STRING,
				defaultValue: ""
			},
			photo: {
				type: DataTypes.STRING,
				defaultValue: ""
			},
			verification: {
				type: DataTypes.STRING(512),
				defaultValue: ""
			},
			token: {
				type: DataTypes.STRING(512),
				defaultValue: ""
			},
			tokenExpiry: {
				type: DataTypes.DATE,
				defaultValue: null
			},
			status: {
				type: DataTypes.ENUM('UNVERIFIED', 'ACTIVE', 'DELETED', 'BLOCKED'),
				defaultValue: 'UNVERIFIED'
			},
			braintreeCustomerId: {
				type: DataTypes.STRING(256),
				defaultValue: ""
			},
			braintreePaymentNonce: {
				type: DataTypes.STRING(256),
				defaultValue: ""
			}
		},
		{ 
			scopes: {
				all: { where: { } },
				deleted: { where: { "Users.status": 'DELETED' } },
				not_deleted: { where: { "Users.status": { ne: 'DELETED' } } },
				active: { where: { "Users.status": 'ACTIVE' } },
				any: function(status) {
					return {
						where: {
							"Users.status": status
						}
					};
				},
				drivers: { where: { "Users.type" : 'DRIVER' } },
				SRSs: { where: { "Users.type" : 'SRS' } }
			},
			instanceMethods: {
				makeSalt: function() {
					return crypto.randomBytes(16).toString('base64'); 
				},
				authenticate: function(plainText){
					return this.encryptPassword(plainText, this.salt) === this.hashedPassword;
				},
				encryptPassword: function(password, salt) {
					if (!password || !salt) return '';
					salt = new Buffer(salt, 'base64');
					return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
				},
				json: function() {
					var ret = {
						id: this.id,
						firstname: this.firstname,
						lastname: this.lastname,
						email: this.email,
						type: this.type,
						latitude: this.latitude,
						longitude: this.longitude,
						address: this.address,
						phone: this.phone,
						onlineStatus: this.onlineStatus,
						photo: this.photo,
						createdAt: this.createdAt,
						updatedAt: this.updatedAt
					};

					if(ret.type == 'DRIVER') {
						ret.braintreeCustomerId = this.braintreeCustomerId;
					}

					return ret;
				}
			},
			associate: function(models) {
				User.hasMany(models.UserDevice);
				User.hasMany(models.UserSession);
				User.hasMany(models.Order, { as: 'SRSOrders', foreignKey: 'srs_id'});
				User.hasMany(models.Order, { as: 'DriverOrders', foreignKey: 'driver_id'});
				User.hasMany(models.Review);
				User.hasMany(models.Payment);
			}
		}
	);

	return User;
};
