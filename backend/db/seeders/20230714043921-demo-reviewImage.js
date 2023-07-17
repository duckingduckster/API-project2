'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'ReviewImages';
    return queryInterface.bulkInsert(options, [
      {
        id: 1,
        reviewId: 1,
        url:'https://staticg.sportskeeda.com/editor/2022/08/743b9-16599916314293-1920.jpg'
      },
      {
        id: 1,
        reviewId: 2,
        url: 'https://static.wikia.nocookie.net/onepiece/images/e/e1/Kinoko_Island_Infobox.png/revision/latest?cb=20151222012414'
      },
      {
        id: 1,
        reviewId: 3,
        url: 'https://static.wikia.nocookie.net/onepiece/images/4/43/Lost_Island_Infobox.png/revision/latest?cb=20180815043010'
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};
