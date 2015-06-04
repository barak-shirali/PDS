

module.exports = function(sequelize, DataTypes) {

	var UserDevice = sequelize.define('UserDevice', {
			type: {
				type: DataTypes.ENUM('IOS', 'ANDROID'),
				defaultValue: 'IOS'
			},
			token: {
				type: DataTypes.STRING,
				allowNull: false
			}
		},
		{
			classMethods: {
				addDevice: function(deviceInfo) {
					UserDevice.find({where: deviceInfo})
						.success(function(device) {
							if(device) {

							}
							else {
								UserDevice.create(deviceInfo);
							}
						});
				}
			},
			associate: function(models){
				UserDevice.belongsTo(models.User);
			}
		}
	);

	return UserDevice;
};
