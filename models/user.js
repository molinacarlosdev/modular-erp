module.exports = (sequelize, DataTypes) => {
	var User = sequelize.define(
		'User',
		{
			id: {
				type: DataTypes.INTEGER(3),
				primaryKey: true,
				allowNull: false,
				autoIncrement: true,
			},
			user_name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			user_email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			user_password: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			avatar: {
				type: DataTypes.STRING,
			},
		},
		{
			freezeTableName: true,
			timestamps: false,
		}
	);

	User.associate = function(models) {
		User.belongsTo(models.Role, {
			foreignKey: {
				allowNull: false,
			},
		});
	};

	return User;
};
