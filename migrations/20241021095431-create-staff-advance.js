'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('staff_advances', {
      staff_advance_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      staff_id: {
        type: Sequelize.INTEGER
      },
      apply_date: {
        type: Sequelize.DATE
      },
      approved_date: {
        type: Sequelize.DATE
      },
      approved_by: {
        type: Sequelize.INTEGER
      },
      amount: {
        type: Sequelize.STRING
      },
      reason: {
        type: Sequelize.STRING
      },
      paid_amount: {
        type: Sequelize.STRING
      },
      balance_amount: {
        type: Sequelize.STRING
      },
      advance_status: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('staff_advances');
  }
};