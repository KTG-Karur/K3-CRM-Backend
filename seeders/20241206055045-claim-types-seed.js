'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('claim_types', [
      {
        claim_type_name: "Birthday Claim"
      },
      {
        claim_type_name: "Travel Expenses"
      },
      {
        claim_type_name: "Medical Expenses"
      },
      {
        claim_type_name: "Miscellaneous"
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('claim_types', {}, null)
  }
};
