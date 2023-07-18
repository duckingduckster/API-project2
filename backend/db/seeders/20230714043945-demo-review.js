'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Reviews';
    return queryInterface.bulkInsert(options, [
      {
        id: 1,
        spotId:1,
        userId:1,
        review:'',
        stars:4
      },
      {
        id: 2,
        spotId:1,
        userId:1,
        review:'',
        stars:4
      },
      {
        id: 3,
        spotId:1,
        userId:1,
        review:'',
        stars:3
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};
