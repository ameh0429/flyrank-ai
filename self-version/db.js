import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  retry: { max: 10 },
  logging: false,
});

console.log('Connecting with:', process.env.DATABASE_URL);


// Define the Task model
const Task = sequelize.define('Task', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  done: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

// Create the table if it doesn’t exist
await sequelize.sync();

// Seed three example tasks only if the table is empty
const count = await Task.count();
if (count === 0) {
  await Task.bulkCreate([
    { title: 'Buy groceries', done: false },
    { title: 'Clean the house', done: true },
    { title: 'Finish project', done: false },
  ]);
}

export { sequelize, Task };

