'use strict';

const department = require('../models/department');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('designation',[
      {
        designation_name : "Manager",
        department_id : 1
      },
      {
        designation_name : "Staff",
        department_id : 1
      },
      {
        designation_name : "Manager",
        department_id : 2
      },
      {
        designation_name : "Staff",
        department_id : 2
      },
      {
        designation_name : "Manager",
        department_id : 3
      },
      {
        designation_name : "Staff",
        department_id : 3
      },
     ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('designation', {}, null)
  }
};
