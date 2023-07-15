'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Review.hasMany(
        models.ReviewImage,
        { foreignKey: 'reviewId', onDelete: 'CASCADE'}
      ),
      Review.belongsTo(
        models.User,
        {foreignKey: 'userId'}
      ),
      Review.belongsTo(
        models.Spot,
        {foreignKey: 'spotId'}
      )
    }
  }
  Review.init({
    spotId: {
      type: DataTypes.INTEGER
    },
    userId: {
      type: DataTypes.INTEGER
    },
    review: {
      type: DataTypes.STRING
    },
    stars: {
      type: DataTypes.DECIMAL
    },
    },
    {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};
