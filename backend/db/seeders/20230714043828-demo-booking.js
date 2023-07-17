'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Bookings';
    return queryInterface.bulkInsert(options, [
      {
       id: 1,
       spotId: 1,
       userId: 1,
       startDate: "2021-11-19",
       endDate: "2021-11-20",

      },
      {
        id: 2,
        spotId: 1,
        userId: 1,
        startDate: "2021-11-21",
        endDate: "2021-11-22",
      },
      {
        id: 3,
        spotId: 3,
        userId: 1,
        startDate: "2021-11-24",
        endDate: "2021-11-25",
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
