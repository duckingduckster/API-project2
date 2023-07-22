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
       spotId: 1,
       userId: 1,
       startDate: "2023-11-19",
       endDate: "2024-11-20",

      },
      {
        spotId: 2,
        userId: 1,
        startDate: "2021-11-21",
        endDate: "2021-11-22",
      },
      {
        spotId: 3,
        userId: 1,
        startDate: "2021-11-24",
        endDate: "2021-11-25",
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      startDate: { [Op.in]: ["2023-11-19", "2021-11-21", "2021-11-24"] }
    }, {});
  }
};
