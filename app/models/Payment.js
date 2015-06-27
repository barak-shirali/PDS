

module.exports = function(sequelize, DataTypes) {

	var Payment = sequelize.define('Payment', {
			dateStart: {
				type: DataTypes.DATE,
				defaultValue: ""
			},
			dateEnd: {
				type: DataTypes.DATE,
				defaultValue: ""
			},
			totalFee: {
				type: DataTypes.FLOAT,
				defaultValue: 0
			},
			totalTip: {
				type: DataTypes.FLOAT,
				defaultValue: 0
			},
			totalCash: {
				type: DataTypes.FLOAT,
				defaultValue: 0
			},
			totalCreditCard: {
				type: DataTypes.FLOAT,
				defaultValue: 0
			},
			serviceFee: {
				type: DataTypes.FLOAT,
				defaultValue: 0
			},
			totalAmount: {
				type: DataTypes.FLOAT,
				defaultValue: 0
			},
			status: {
				type: DataTypes.ENUM('DUE', 'PAID', 'FAILED'),
				defaultValue: 'DUE'
			},
			apiResponse: {
				type: DataTypes.TEXT,
				defaultValue: 0
			}
		},
		{
			instanceMethods: {
				json: function(next) {
					next(this);
				}
			},
			associate: function(models){
				Payment.belongsTo(models.User);
				Payment.hasMany(models.PaymentItem);
			}
		}
	);

	return Payment;
};
