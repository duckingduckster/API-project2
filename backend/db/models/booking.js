'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Booking.belongsTo(
        models.User,
        {foreignKey: 'userId'}
      ),
      Booking.belongsTo(
        models.Spot,
        {foreignKey: 'spotId'}
      )
    }

  }
  Booking.init(
    {
    // id: {
    //   allowNull: false,
    //   autoIncrement: true,
    //   primaryKey: true,
    //   type: Sequelize.INTEGER
    // },
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    startDate: {
      type: DataTypes.STRING,
      allowNull: false
    },
    endDate: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // createdAt: {
    //   allowNull: false,
    //   type: DataTypes.DATE,
    //   defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    // },
    // updatedAt: {
    //   allowNull: false,
    //   type: DataTypes.DATE,
    //   defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    {
    sequelize,
    modelName: 'Booking'
    }
  );
  return Booking;
};
