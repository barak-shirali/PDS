

module.exports = function(sequelize, DataTypes) {

	var PaymentItem = sequelize.define('PaymentItem', {
			
		},
		{
			instanceMethods: {
				json: function(next) {
					next(this);
				}
			},
			associate: function(models){
				PaymentItem.belongsTo(models.Payment);
				PaymentItem.belongsTo(models.Order);
			}
		}
	);

	return PaymentItem;
};
