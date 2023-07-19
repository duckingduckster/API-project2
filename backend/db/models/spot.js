'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Spot.belongsTo(
        models.User,
        {foreignKey: 'ownerId', as: 'Owner'}
      ),
      Spot.hasOne(
        models.Booking,
        { foreignKey: 'spotId', onDelete: 'CASCADE'}
      ),
      Spot.hasMany(
        models.SpotImage,
        { foreignKey: 'spotId', onDelete: 'CASCADE'}
      ),
      Spot.hasMany(
        models.Review,
        { foreignKey: 'spotId', onDelete: 'CASCADE'}
      )

    }
  }
  Spot.init({
    // id: {
    //   allowNull: false,
    //   autoIncrement: true,
    //   primaryKey: true,
    //   type: DataTypes.INTEGER
    // },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    address:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    city:{
      type: DataTypes.STRING,
      allowNull: false
    },
    state:{
      type: DataTypes.STRING,
      allowNull: false
    },
    country:{
      type: DataTypes.STRING,
      allowNull: false
    },
    lat:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    lng: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    avgRating: {
      type: DataTypes.DECIMAL,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
