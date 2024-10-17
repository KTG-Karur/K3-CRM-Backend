'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('claims', {
      claim_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      claim_type_id: {
        type: Sequelize.INTEGER
      },
      approved_by: {
        type: Sequelize.INTEGER
      },
      requested_by: {
        type: Sequelize.INTEGER
      },
      requested_amount: {
        type: Sequelize.STRING
      },
      reason: {
        type: Sequelize.STRING
      },
      branch_id: {
        type: Sequelize.INTEGER
      },
      recepit_image_name: {
        type: Sequelize.STRING
      },
      claim_amount: {
        type: Sequelize.STRING
      },
      apply_date: {
        type: Sequelize.DATE
      },
      claim_status: {
        type: Sequelize.INTEGER
      },
      mode_of_payment_id: {
        type: Sequelize.INTEGER
      },
      approved_date: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('claims');
  }
};