'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('staff_salary_histories', {
      staff_salary_history_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      staff_id: {
        type: Sequelize.INTEGER
      },
      branch_id: {
        type: Sequelize.INTEGER
      },
      department_id: {
        type: Sequelize.INTEGER
      },
      salary_date: {
        type: Sequelize.DATE
      },
      salary_amount: {
        type: Sequelize.STRING
      },
      deduction_amount: {
        type: Sequelize.STRING
      },
      esi_amount: {
        type: Sequelize.STRING
      },
      pf_amount: {
        type: Sequelize.STRING
      },
      incentive: {
        type: Sequelize.STRING
      },
      total_salary_amount: {
        type: Sequelize.STRING
      },
       createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('staff_salary_histories');
  }
};