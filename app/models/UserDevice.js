

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
					var search = {
						type: deviceInfo.type,
          				token: deviceInfo.token,
					};
					UserDevice.find({where: search})
						.success(function(device) {
							if(device) {
								device.destroy();
							}
							UserDevice.create(deviceInfo);
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
