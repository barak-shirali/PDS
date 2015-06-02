

module.exports = function(sequelize, DataTypes) {

	var UserDevice = sequelize.define('UserDevice', {
			type: {
				type: DataTypes.INTEGER
			},
			token: {
				type: DataTypes.STRING,
				allowNull: false
			}
		},
		{
			associate: function(models){
				UserDevice.belongsTo(models.User);
			}
		}
	);

	return UserDevice;
};
