

module.exports = function(sequelize, DataTypes) {

	var Order = sequelize.define('Order', {
			pickupAddress: {
				type: DataTypes.STRING,
				defaultValue: ""
			},
			pickupLatitude: {
				type: DataTypes.FLOAT,
				defaultValue: 0
			},
			pickupLongitude: {
				type: DataTypes.FLOAT,
				defaultValue: 0
			},
			pickupPhone: {
				type: DataTypes.STRING,
				defaultValue: ""
			},
			paymentType: {
				type: DataTypes.INTEGER,
				defaultValue: 0
			},
			paymentAmount: {
				type: DataTypes.FLOAT,
				defaultValue: 0
			},
			paymentTip: {
				type: DataTypes.FLOAT,
				defaultValue: 0
			},
			dropoffAddress: {
				type: DataTypes.STRING,
				defaultValue: ""
			},
			dropoffLatitude: {
				type: DataTypes.FLOAT,
				defaultValue: 0
			},
			dropoffLongitude: {
				type: DataTypes.FLOAT,
				defaultValue: 0
			},
			dropoffName: {
				type: DataTypes.STRING,
				defaultValue: ""
			},
			comment: DataTypes.TEXT,
			status: {
				type: DataTypes.INTEGER,
				defaultValue: 0
			},
			driverCheckList: DataTypes.TEXT
		},
		{
			associate: function(models){
				Order.belongsTo(models.User, { as: 'SRS', foreignKey: 'srs_id'});
				Order.belongsTo(models.User, { as: 'Driver', foreignKey: 'driver_id'});
				Order.hasMany(models.Review);
			}
		}
	);

	return Order;
};
