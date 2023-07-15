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
        ownerId:12345,
        address:'1245 S blvd',
        city:'Lakewood',
        state:'CO',
        country:'USA',
        lat:21313,
        lng:21414,
        name:'sdada',
        description:'qwewq',
        price:23134
      },
      {
        ownerId:123,
        address:'eeqewq',
        city:'dffad',
        state:'fsds',
        country:'dfsfa',
        lat:21313,
        lng:21414,
        name:'sdada2',
        description:'qwewq',
        price:23134
      },
      {
        ownerId:123,
        address:'eeqewq',
        city:'dffad',
        state:'fsds',
        country:'dfsfa',
        lat:21313,
        lng:21414,
        name:'sdada3',
        description:'qwewq',
        price:23134
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
cd
