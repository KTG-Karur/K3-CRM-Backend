'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('access', [
      {
        access_name: "Create"
      },
      {
        access_name: "Update"
      },
      {
        access_name: "Delete"
      },
      {
        access_name: "View"
      },
      {
        access_name: "Print"
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('access', {}, null)
  }
};
