import 'reflect-metadata';
import { Container } from 'inversify';

import { TOKENS } from '../../infrastructure/tokens';
import { UserCreationAttributes } from '../../models/User';
import { UserController } from './index';

function getMockUserDto(): UserCreationAttributes {
  return { login: 'test-login', password: 'test-password', age: 42 };
}

describe('# User Controller', () => {
  const container = new Container();
  const ctrlToken = Symbol.for('UserController');

  beforeEach(() => {
    container.bind(TOKENS.UserService).toConstantValue({});
    container.bind(TOKENS.Logger).toConstantValue({ log: jest.fn() });
    container.bind(ctrlToken).to(UserController);
  });

  afterEach(() => container.unbindAll());

  describe('Get Users', () => {
    it('should return users data and 200 response on getUsers request', async () => {
      const ctrl = container.get<any>(ctrlToken);
      const userService = container.get<any>(TOKENS.UserService);
      userService.getUsers = jest.fn().mockResolvedValue([]);

      const req = { query: { loginSubstring: 'login-substr', limit: 10 } };
      const res = { status: jest.fn(), json: jest.fn() };
      await ctrl.getUsers(req, res);

      expect(userService.getUsers).toHaveBeenCalledWith({
        value: 'login-substr',
        limit: 10,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([]);
    });
  });

  describe('Get User By Id', () => {
    it('should return user data if it exists', async () => {
      const ctrl = container.get<any>(ctrlToken);
      const userService = container.get<any>(TOKENS.UserService);
      userService.getUserById = jest.fn((id) => Promise.resolve(`User: ${id}`));

      const req = { params: { id: 'test-id' } };
      const res = { status: jest.fn(), json: jest.fn() };
      await ctrl.getUser(req, res);

      expect(userService.getUserById).toHaveBeenCalledWith('test-id');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith('User: test-id');
    });

    it('should return 404 if user doesn`t exist', async () => {
      const ctrl = container.get<any>(ctrlToken);
      const userService = container.get<any>(TOKENS.UserService);
      userService.getUserById = jest.fn(() => Promise.resolve(null));

      const req = { params: { id: 'test-id' } };
      const res = { status: jest.fn(), json: jest.fn() };
      await ctrl.getUser(req, res);

      expect(userService.getUserById).toHaveBeenCalledWith('test-id');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'User not found.' }),
      );
    });
  });

  describe('Create User', () => {
    it('should create user if it doesn`t exist', async () => {
      const mockUserData = getMockUserDto();
      const ctrl = container.get<any>(ctrlToken);
      const userService = container.get<any>(TOKENS.UserService);
      userService.createUser = jest.fn(() =>
        Promise.resolve({ ...mockUserData, isDeteleted: false, id: 'test-id' }),
      );

      const req = { body: mockUserData };
      const res = { status: jest.fn(), json: jest.fn() };
      await ctrl.createUser(req, res);

      expect(userService.createUser).toHaveBeenCalledWith(mockUserData);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        ...mockUserData,
        isDeteleted: false,
        id: 'test-id',
      });
    });

    it('should return 400 error if the user exists', async () => {
      const mockUserData = getMockUserDto();
      const ctrl = container.get<any>(ctrlToken);
      const userService = container.get<any>(TOKENS.UserService);
      userService.createUser = jest.fn(() =>
        Promise.reject(new Error('USER_EXISTS')),
      );

      const req = { body: mockUserData };
      const res = { status: jest.fn(), json: jest.fn() };
      await ctrl.createUser(req, res);

      expect(userService.createUser).toHaveBeenCalledWith(mockUserData);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'User with this login already exists.',
        }),
      );
    });
  });

  describe('Update User', () => {
    it('should update user if it exists and the login is not taken', async () => {
      const mockUserData = getMockUserDto();
      const ctrl = container.get<any>(ctrlToken);
      const userService = container.get<any>(TOKENS.UserService);
      userService.updateUser = jest.fn((id) =>
        Promise.resolve({ ...mockUserData, isDeteleted: false, id }),
      );

      const req = { params: { id: 'test-id' }, body: mockUserData };
      const res = { status: jest.fn(), json: jest.fn() };
      await ctrl.updateUser(req, res);

      expect(userService.updateUser).toHaveBeenCalledWith(
        'test-id',
        mockUserData,
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        ...mockUserData,
        isDeteleted: false,
        id: 'test-id',
      });
    });

    it('should return 404 error if user doesn`t exist', async () => {
      const mockUserData = getMockUserDto();
      const ctrl = container.get<any>(ctrlToken);
      const userService = container.get<any>(TOKENS.UserService);
      userService.updateUser = jest.fn(() =>
        Promise.reject(new Error('NOT_FOUND')),
      );

      const req = { params: { id: 'test-id' }, body: mockUserData };
      const res = { status: jest.fn(), json: jest.fn() };
      await ctrl.updateUser(req, res);

      expect(userService.updateUser).toHaveBeenCalledWith(
        'test-id',
        mockUserData,
      );
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'User not found.',
        }),
      );
    });

    it('should return 400 error if user login is taken', async () => {
      const mockUserData = getMockUserDto();
      const ctrl = container.get<any>(ctrlToken);
      const userService = container.get<any>(TOKENS.UserService);
      userService.updateUser = jest.fn(() =>
        Promise.reject(new Error('USER_EXISTS')),
      );

      const req = { params: { id: 'test-id' }, body: mockUserData };
      const res = { status: jest.fn(), json: jest.fn() };
      await ctrl.updateUser(req, res);

      expect(userService.updateUser).toHaveBeenCalledWith(
        'test-id',
        mockUserData,
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'User with this login already exists.',
        }),
      );
    });
  });

  describe('Delete User', () => {
    it('should delete the user if it exists', async () => {
      const ctrl = container.get<any>(ctrlToken);
      const userService = container.get<any>(TOKENS.UserService);
      userService.deleteUser = jest.fn(() => Promise.resolve());

      const req = { params: { id: 'test-id' } };
      const res = { status: jest.fn(), json: jest.fn() };
      await ctrl.deleteUser(req, res);

      expect(userService.deleteUser).toHaveBeenCalledWith('test-id');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        statusCode: 200,
      });
    });

    it('should return 404 error if the user doesn`t exist', async () => {
      const ctrl = container.get<any>(ctrlToken);
      const userService = container.get<any>(TOKENS.UserService);
      userService.deleteUser = jest.fn(() =>
        Promise.reject(new Error('NOT_FOUND')),
      );

      const req = { params: { id: 'test-id' } };
      const res = { status: jest.fn(), json: jest.fn() };
      await ctrl.deleteUser(req, res);

      expect(userService.deleteUser).toHaveBeenCalledWith('test-id');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'User not found.',
        }),
      );
    });
  });
});
