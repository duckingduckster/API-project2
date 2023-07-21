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
        { foreignKey: 'spotId', onDelete: 'CASCADE', hooks:true}
      ),
      Spot.hasMany(
        models.SpotImage,
        { foreignKey: 'spotId', onDelete: 'CASCADE', hooks:true}
      ),
      Spot.hasMany(
        models.Review,
        { foreignKey: 'spotId', onDelete: 'CASCADE', hooks:true}
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
      unique: true
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
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    lng: {
      type: DataTypes.DECIMAL,
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
      type: DataTypes.DECIMAL
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
