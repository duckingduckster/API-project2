'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Spots';
    return queryInterface.bulkInsert(options, [
      {
        ownerId:1,
        address:'1245 S blvd',
        city:'Lakewood',
        state:'CO',
        country:'USA',
        lat:1,
        lng:2,
        name:'sdada',
        description:'qwewq',
        price:123
      },
      {
        ownerId:2,
        address:'1245 N blvd',
        city:'Lakewood',
        state:'CO',
        country:'USA',
        lat:3,
        lng:4,
        name:'sdada2',
        description:'qwewq',
        price:123

      },
      {
        ownerId:3,
        address:'1245 E blvd',
        city:'Lakewood',
        state:'CO',
        country:'USA',
        lat:5,
        lng:6,
        name:'sdada3',
        description:'qwewq',
        price:123
      },
      {
        ownerId:3,
        address:'45678 E blvd',
        city:'New York',
        state:'NY',
        country:'USA',
        lat:7,
        lng:8,
        name:'penthouse',
        description:'wow',
        price:12300
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      price : { [Op.in]: [123, 12300] }
    }, {});
  }
};
