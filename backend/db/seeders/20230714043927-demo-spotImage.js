'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    return queryInterface.bulkInsert(options, [
      {
      spotId: 1,
      url: 'https://pm1.aminoapps.com/6760/382b4d9532b34c9a79df99fd7182da0e9132a6a5v2_hq.jpg',
      preview: true
      },
      {
        spotId: 2,
        url: 'https://storage.googleapis.com/stateless-thedailyfandom-org/2020/05/53df8964-159fdae8212e4647667344820984.jpg',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://m.media-amazon.com/images/M/MV5BMjgwNzFjZGYtNTRhNC00YzA0LTliNmYtNTUyYjZiMWM1MDEwXkEyXkFqcGdeQXVyNzgxMzc3OTc@._V1_.jpg',
        preview: true
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
