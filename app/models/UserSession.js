
var md5 = require('MD5');
var moment = require('moment');

module.exports = function(sequelize, DataTypes) {

	var UserSession = sequelize.define('UserSession', {
			sessionToken: {
				type: DataTypes.TEXT,
				allowNull: false
			},
			expiryDate: DataTypes.DATE
		},
		{
			classMethods: {
				createSession: function(userId) {
					var token = md5(moment().unix());
					UserSession.create({
						sessionToken: token,
						expiryDate: null,
						UserId: userId
					});
					return token;
				}
			},
			associate: function(models){
				UserSession.belongsTo(models.User);
			}
		}
	);

	return UserSession;
};
