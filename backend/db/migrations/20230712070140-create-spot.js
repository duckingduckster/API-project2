'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Spots', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ownerId: {
        type: Sequelize.INTEGER,
        references:{
          model: 'Users'
        }

      },
      address:{
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true
      },
      city:{
        type: Sequelize.STRING,
        allowNull: false
      },
      state:{
        type: Sequelize.STRING,
        allowNull: false
      },
      country:{
        type: Sequelize.STRING,
        allowNull: false
      },
      lat:{
        type: Sequelize.INTEGER,
        allowNull: false
      },
      lng: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        notEmpty: true
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
        notEmpty: true
      },
      price:{
        type: Sequelize.INTEGER,
        allowNull: false
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
      },
      avgRating: {
        type: Sequelize.DECIMAL
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Spots');
  }
};
