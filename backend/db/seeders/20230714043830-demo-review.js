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
        spotId:1,
        userId:1,
        review:'nice',
        stars:5
      },
      {
        spotId:2,
        userId:2,
        review:'okay',
        stars:4
      },
      {
        spotId:3,
        userId:3,
        review:'aight',
        stars:3
      },
      {
        spotId:4,
        userId:3,
        review:' ',
        stars: undefined
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3, 4] }
    }, {});
  }
};
