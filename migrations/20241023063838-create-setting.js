'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('settings', {
      setting_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      from_day: {
        type: Sequelize.STRING
      },
      to_day: {
        type: Sequelize.STRING
      },
      esi_percentage: {
        type: Sequelize.STRING
      },
      pf_percentage: {
        type: Sequelize.STRING
      },
      permission_deduction: {
        type: Sequelize.STRING
      },
      leave_deduction: {
        type: Sequelize.STRING
      },
      image_name: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('settings');
  }
};