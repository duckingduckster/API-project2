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
        models.User,
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
      type: DataTypes.INTEGER
    },
    userId: {
      type: DataTypes.INTEGER
    },
    startDate: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false
    },
    endDate: {
      type: DataTypes.INTEGER,
      unique: true,
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