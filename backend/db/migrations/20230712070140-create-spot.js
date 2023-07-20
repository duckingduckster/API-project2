'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up:async (queryInterface, Sequelize) => {
    return queryInterface.createTable('Spots', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ownerId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
          onDelete: 'CASCADE'
        }
      },
      address:{
        type: Sequelize.STRING,
        allowNull: false
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
        type: Sequelize.DECIMAL,
        allowNull: true
      },
      previewImage: {
        type: Sequelize.STRING
      }
    },options);
  },
  down: async (queryInterface, Sequelize) =>{
    options.tableName = "Spots";
    return queryInterface.dropTable(options);
  }
};
