"use strict";

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING(50),
        allowNull: false,
        notEmpty: true
      },
      lastName: {
        type: Sequelize.STRING(50),
        allowNull: false,
        notEmpty: true
      },
      username: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
        notEmpty: true
      },
      email: {
        type: Sequelize.STRING(256),
        allowNull: false,
        unique: true,
        notEmpty: true
      },
      hashedPassword: {
        type: Sequelize.STRING.BINARY,
        allowNull: false,
        notEmpty: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, options);
  },
  down: async (queryInterface, Sequelize) => {
    options.tableName = "Users";
    return queryInterface.dropTable(options);
  }
};
