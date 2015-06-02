

module.exports = function(sequelize, DataTypes) {

	var UserSession = sequelize.define('UserSession', {
			sessionToken: {
				type: DataTypes.TEXT,
				allowNull: false
			},
			expiryDate: DataTypes.DATE
		},
		{
			associate: function(models){
				UserSession.belongsTo(models.User);
			}
		}
	);

	return UserSession;
};
