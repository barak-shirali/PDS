

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
						UserId: deviceInfo.UserId
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
