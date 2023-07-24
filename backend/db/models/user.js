'use strict';
const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(
        models.Spot,
        { foreignKey: 'ownerId', onDelete: 'CASCADE', as: 'Owner' }
      ),
      User.hasMany(
        models.Booking,
        { foreignKey: 'userId', onDelete: 'CASCADE'}
      ),
      User.hasMany(
        models.Review,
        { foreignKey: 'userId', onDelete: 'CASCADE'}
      )
    }
  };

  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull:false,
        notEmpty: true,
        validate: {
          len: [4, 50]
        }
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull:false,
        notEmpty: true,
        validate: {
          len: [4, 50]
        }
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        notEmpty: true,
        validate: {
          len: [4, 50],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error("Cannot be an email.");
            }
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        notEmpty: true,
        validate: {
          len: [3, 256],
          isEmail: true
        }
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        notEmpty: true,
        validate: {
          len: [60, 60]
        }
      }
    },
    {
      sequelize,
      modelName: "User",
      defaultScope: {
        attributes: {
          exclude: ["hashedPassword", "email", "createdAt", "updatedAt"]
        }
      }
    }
  );
  return User;
};
