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
        lat:21313,
        lng:21414,
        name:'sdada',
        description:'qwewq',
        price:2313,
        previewImage: '.jpeg1'
      },
      {
        ownerId:2,
        address:'1245 N blvd',
        city:'Lakewood',
        state:'CO',
        country:'USA',
        lat:21313,
        lng:21414,
        name:'sdada2',
        description:'qwewq',
        price:3134,
        previewImage: '.jpeg2'

      },
      {
        ownerId:3,
        address:'1245 E blvd',
        city:'Lakewood',
        state:'CO',
        country:'USA',
        lat:21313,
        lng:21414,
        name:'sdada3',
        description:'qwewq',
        price:2334,
        previewImage: '.jpeg3'
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name : { [Op.in]: ['sdada', 'sdada2', 'sdada3'] }
    }, {});
  }
};
