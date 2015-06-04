

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
				type: DataTypes.ENUM('CASH', 'CREDIT_CARD'),
				defaultValue: 'CASH'
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
				type: DataTypes.ENUM('DRAFTED', 'PENDING', 'ACCEPTED', 'PICKED', 'COMPLETED', 'CANCELED'),
				defaultValue: 'DRAFTED'
			},
			driverCheckList: DataTypes.TEXT
		},
		{
			instanceMethods: {
				json: function(next) {
					var ret = {
						id: this.id,
						pickupAddress: this.pickupAddress,
						pickupLatitude: this.pickupLatitude,
						pickupLongitude: this.pickupLongitude,
						pickupPhone: this.pickupPhone,
						paymentType: this.paymentType,
						paymentAmount: this.paymentAmount,
						paymentTip: this.paymentTip,
						dropoffAddress: this.dropoffAddress,
						dropoffLatitude: this.dropoffLatitude,
						dropoffLongitude: this.dropoffLongitude,
						dropoffName: this.dropoffName,
						comment: this.comment,
						status: this.status,
						createdAt: this.createdAt,
						updatedAt: this.updatedAt,
						denyingDriverList:JSON.parse(this.driverCheckList),
						SRS: '',
						driver: ''
					};
					var order = this;
					order.getSRS().then(function(srs) {
						ret.SRS = srs.json();
						if(order.driver_id) {
							order.getDriver().then(function(driver) {
								ret.driver = driver.json();
								next(ret);
							}, function(err) {
								next(ret);
							});
						}
						else {
							next(ret);
						}
					}, function(err) {
						next(ret);
					});
				}
			},
			associate: function(models){
				Order.belongsTo(models.User, { as: 'SRS', foreignKey: 'srs_id'});
				Order.belongsTo(models.User, { as: 'Driver', foreignKey: 'driver_id'});
				Order.hasMany(models.Review);
			}
		}
	);

	return Order;
};
