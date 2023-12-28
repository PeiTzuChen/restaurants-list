"use strict";
const bcrypt = require("bcryptjs");
const restaurants = require("../public/jsons/restaurant.json").results;
const user1_restaurants = restaurants.slice(0, 3);
const user2_restaurants = restaurants.slice(3, 6);

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let transaction;
    try {
      transaction = await queryInterface.sequelize.transaction();
      const password = await bcrypt.hash("12345678", 10);
    
      await queryInterface.bulkInsert(
        "Users",
        [
          {
            id: 1,
            email: "user1@example.com",
            password,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 2,
            email: "user2@example.com",
            password,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        { transaction }
      );

      await queryInterface.bulkInsert(
        "Restaurants",
        user1_restaurants.map((restaurant) => ({
          name: restaurant.name,
          name_en: restaurant.name_en,
          category: restaurant.category,
          image: restaurant.image,
          location: restaurant.location,
          phone: restaurant.phone,
          google_map: restaurant.google_map,
          rating: restaurant.rating,
          description: restaurant.description,
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
        { transaction }
      );
  

      await queryInterface.bulkInsert(
        "Restaurants",
        user2_restaurants.map((restaurant) => ({
          name: restaurant.name,
          name_en: restaurant.name_en,
          category: restaurant.category,
          image: restaurant.image,
          location: restaurant.location,
          phone: restaurant.phone,
          google_map: restaurant.google_map,
          rating: restaurant.rating,
          description: restaurant.description,
          userId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
        { transaction }
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null)
  }
};
