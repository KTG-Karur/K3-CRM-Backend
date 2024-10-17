'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('petrol_allowances', {
      petrol_allowance_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      staff_id: {
        type: Sequelize.INTEGER
      },
      allowance_date: {
        type: Sequelize.DATE
      },
      from_place: {
        type: Sequelize.STRING
      },
      to_place: {
        type: Sequelize.STRING
      },
      activity_id: {
        type: Sequelize.STRING
      },
      total_km: {
        type: Sequelize.INTEGER
      },
      amount: {
        type: Sequelize.STRING
      },
      bill_no: {
        type: Sequelize.STRING
      },
      bill_image_name: {
        type: Sequelize.STRING
      },
      is_active: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: 1
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
    await queryInterface.dropTable('petrol_allowances');
  }
};