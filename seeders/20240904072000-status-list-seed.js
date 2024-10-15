'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('status_lists', [
       //-----Gender------//
      {
        status_category_id : 1,
        status_name: "Male"
      },
      {
        status_category_id : 1,
        status_name: "Female"
      },
      {
        status_category_id : 1,
        status_name: "Others"
        // -----Ends----------//
        //-----Activity------//
      },
      {
        status_category_id : 2,
        status_name: "Site Visit"
      },
      //----- Ends------//
      //-----Mode Of Payment Starts------//
      {
        status_category_id : 3,
        status_name: "Cash"
      },
      {
        status_category_id : 3,
        status_name: "Neft"
      },
      //-----Ends------//
      //-----Marital Status------//
      {
        status_category_id : 4,
        status_name: "Single"
      },
      {
        status_category_id : 4,
        status_name: "Married"
      },
      //-----Ends------//
      //-----Language Starts------//
      {
        status_category_id : 5,
        status_name: "Tamil"
      },
      {
        status_category_id : 5,
        status_name: "English"
      },
      {
        status_category_id : 5,
        status_name: "Hindi"
      },
        //-----Ends------//
        //-----Qualification ------//
      {
        status_category_id : 6,
        status_name: "Bsc"
      },
      {
        status_category_id : 6,
        status_name: "Msc"
      },
      {
        status_category_id : 6,
        status_name: "BE"
      },
      {
        status_category_id : 6,
        status_name: "ME"
      },
      {
        status_category_id : 6,
        status_name: "BA"
      },
      {
        status_category_id : 6,
        status_name: "MA"
      },
      //-----Ends------//
      //-----Attendance Status------//
      {
        status_category_id : 7,
        status_name: "Present"
      },
      {
        status_category_id : 7,
        status_name: "Absent"
      },
      {
        status_category_id : 7,
        status_name: "Leave"
      },
      //-----Ends------//
      //-----Caste Ends------//
      {
        status_category_id : 8,
        status_name: "OC"
      },
      {
        status_category_id : 8,
        status_name: "BC"
      },
      {
        status_category_id : 8,
        status_name: "MBC"
      },
      {
        status_category_id : 8,
        status_name: "SC"
      },
      {
        status_category_id : 8,
        status_name: "ST"
      },
      //-----Ends------//
      //-----Start Leave Type------//
      {
        status_category_id : 9,
        status_name: "CL"
      },
      {
        status_category_id : 9,
        status_name: "SL"
      },
       //-----Ends------//
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
