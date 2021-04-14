import { Sequelize } from 'sequelize';

import { InitUserModel } from './models/User';
import { UserRepository } from './data-access/UserRepository';
import { UserService } from './services/user.service';

console.log('Starting...');

const sequelize = new Sequelize('CONNECTION_STRING', { pool: { max: 3 } });
InitUserModel(sequelize);

const userRepo = new UserRepository(sequelize);
const userService = new UserService(userRepo);

sequelize
  .sync({ force: true })
  .then(() => userService.initDefaultUsers(100))
  .then(() => console.log('finishing...'))
  .then(() => sequelize.connectionManager.close());
