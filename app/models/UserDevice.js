

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
					sequelize.query('DELETE FROM UserDevices WHERE UserId = ' + deviceInfo.UserId)
				        .then(function(users) {
							UserDevice.create(deviceInfo);
				        }, function(err) {
				            console.log(err);
				            next(null);
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
