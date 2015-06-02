

module.exports = function(sequelize, DataTypes) {

	var Review = sequelize.define('Review', {
			rating: {
				type: DataTypes.FLOAT,
				defaultValue: 0
			},
			comment: {
				type: DataTypes.STRING,
				defaultValue: ""
			}
		},
		{
			associate: function(models){
				Review.belongsTo(models.User);
				Review.belongsTo(models.Order);
			}
		}
	);

	return Review;
};
