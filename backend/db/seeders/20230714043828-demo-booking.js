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
       Spot: {
        ownerId:12345,
        address:'2345 S blvd',
        city:'Lakewood',
        state:'CO',
        country:'USA',
        lat:21313,
        lng:21414,
        name:'sdada',
        price:23134,
        previewImage: '',
        },
       userId: 2,
       startDate: "2021-11-19",
       endDate: "2021-11-20",
       createdAt: "2021-11-19 20:39:36",
       updatedAt: "2021-11-19 20:39:36"

      },
      {
        firstname:'Duc1',
        lastname: 'Nguyen1',
        email: 'user1@user.io',
        username: 'FakeUser1',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        firstname:'Duc2',
        lastname: 'Nguyen2',
        email: 'user2@user.io',
        username: 'FakeUser2',
        hashedPassword: bcrypt.hashSync('password3')
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
