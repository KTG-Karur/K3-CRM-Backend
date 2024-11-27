'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('staff_leaves', {
      staff_leave_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      staff_id: {
        type: Sequelize.INTEGER
      },
      leave_type_id: {
        type: Sequelize.INTEGER
      },
      day_count: {
        type: Sequelize.INTEGER
      },
      cancel_reason: {
        type: Sequelize.STRING
      },
      reason: {
        type: Sequelize.STRING
      },
      from_date: {
        type: Sequelize.DATE
      },
      to_date: {
        type: Sequelize.DATE
      },
      branch_id: {
        type: Sequelize.INTEGER,
      },
      status_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 28
      },
      approved_by: {
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
    await queryInterface.dropTable('staff_leaves');
  }
};