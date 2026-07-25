import { Sequelize, DataTypes } from 'sequelize';

// Connect to your Postgres database
const sequelize = new Sequelize('taskdb', 'postgres', 'amehmathias049', {
  host: 'localhost',
  dialect: 'postgres',
});

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

