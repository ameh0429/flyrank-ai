import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const Task = sequelize.define(
  "Task",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    done: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "tasks",
    timestamps: true,
  }
);

// Create the table if it doesn’t exist
// await sequelize.sync();

// Seed three example tasks only if the table is empty
const count = await Task.count();
if (count === 0) {
  await Task.bulkCreate([
    { title: 'Buy groceries', done: false },
    { title: 'Clean the house', done: true },
    { title: 'Finish project', done: false },
  ]);
}