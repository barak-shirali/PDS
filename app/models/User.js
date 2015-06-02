
/**
	* User Model
	*/

var crypto = require('crypto');

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
				type: DataTypes.INTEGER,
				defaultValue: 3
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
			onlineStatus: {
				type: DataTypes.INTEGER,
				defaultValue: 0
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
				type: DataTypes.INTEGER,
				defaultValue: 0
			}
		},
		{ 
			scopes: {
				all: { where: { } },
				deleted: { where: { "User.status": 2 } },
				not_deleted: { where: { "User.status": { ne: 2 } } },
				active: { where: { "User.status": 1 } },
				any: function(status) {
					return {
						where: {
							"User.status": status
						}
					};
				},
				drivers: { where: { "User.type" : 3 } },
				SRSs: { where: { "User.type" : 2 } }
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
				}
			},
			associate: function(models) {
				User.hasMany(models.UserDevice);
				User.hasMany(models.UserSession);
				User.hasMany(models.Order, { as: 'SRSOrder', foreignKey: 'srs_id'});
				User.hasMany(models.Order, { as: 'DriverOrder', foreignKey: 'driver_id'});
				User.hasMany(models.Review);
			}
		}
	);

	return User;
};
