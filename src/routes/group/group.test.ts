import 'reflect-metadata';
import { Container } from 'inversify';

import { GroupController } from './index';
import { TOKENS } from '../../infrastructure/tokens';
import { GroupCreationAttributes, Permission } from '../../models/Group';

function getMockGroupDto(): GroupCreationAttributes {
  return { name: 'test-group', permissions: [Permission.READ] };
}

describe('# Group Controller', () => {
  const container = new Container();
  const ctrlToken = Symbol.for('GroupController');

  beforeEach(() => {
    container.bind(TOKENS.GroupService).toConstantValue({});
    container.bind(TOKENS.Logger).toConstantValue({ log: jest.fn() });
    container.bind(ctrlToken).to(GroupController);
  });

  afterEach(() => container.unbindAll());

  describe('Get Groups', () => {
    it('should return groups data and 200 response on getGroups request', async () => {
      const ctrl = container.get<any>(ctrlToken);
      const groupService = container.get<any>(TOKENS.GroupService);
      groupService.getAllGroups = jest.fn().mockResolvedValue([]);

      const res = { status: jest.fn(), json: jest.fn() };
      await ctrl.getGroups({}, res);

      expect(groupService.getAllGroups).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([]);
    });
  });

  describe('Get Group By Id', () => {
    it('should return group data and 200 response if it exists', async () => {
      const mockGroupData = getMockGroupDto();
      const ctrl = container.get<any>(ctrlToken);
      const groupService = container.get<any>(TOKENS.GroupService);
      groupService.getGroupById = jest.fn((id) =>
        Promise.resolve({ id, ...mockGroupData }),
      );

      const req = { params: { id: 'test-id' } };
      const res = { status: jest.fn(), json: jest.fn() };
      await ctrl.getGroup(req, res);

      expect(groupService.getGroupById).toHaveBeenCalledWith('test-id');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        id: 'test-id',
        ...mockGroupData,
      });
    });

    it('should return 404 error if the group doesn`t exist', async () => {
      const ctrl = container.get<any>(ctrlToken);
      const groupService = container.get<any>(TOKENS.GroupService);
      groupService.getGroupById = jest.fn(() => Promise.resolve(null));

      const req = { params: { id: 'test-id' } };
      const res = { status: jest.fn(), json: jest.fn() };
      await ctrl.getGroup(req, res);

      expect(groupService.getGroupById).toHaveBeenCalledWith('test-id');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Group not found.' }),
      );
    });
  });

  describe('Create Gruop', () => {
    it('should create group if it doesn`t exist', async () => {
      const mockGroupData = getMockGroupDto();
      const ctrl = container.get<any>(ctrlToken);
      const groupService = container.get<any>(TOKENS.GroupService);
      groupService.createGroup = jest.fn(() =>
        Promise.resolve({ ...mockGroupData, id: 'test-id' }),
      );

      const req = { body: mockGroupData };
      const res = { status: jest.fn(), json: jest.fn() };
      await ctrl.createGroup(req, res);

      expect(groupService.createGroup).toHaveBeenCalledWith(mockGroupData);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        ...mockGroupData,
        id: 'test-id',
      });
    });

    it('should return 400 error if the group exists', async () => {
      const mockGroupData = getMockGroupDto();
      const ctrl = container.get<any>(ctrlToken);
      const groupService = container.get<any>(TOKENS.GroupService);
      groupService.createGroup = jest.fn(() =>
        Promise.reject(new Error('ALREADY_EXISTS')),
      );

      const req = { body: mockGroupData };
      const res = { status: jest.fn(), json: jest.fn() };
      await ctrl.createGroup(req, res);

      expect(groupService.createGroup).toHaveBeenCalledWith(mockGroupData);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Group with this name already exists.',
        }),
      );
    });
  });

  describe('Update Group', () => {
    it('should update group if it exists and the name is not taken', async () => {
      const mockGroupData = getMockGroupDto();
      const ctrl = container.get<any>(ctrlToken);
      const groupService = container.get<any>(TOKENS.GroupService);
      groupService.updateGroup = jest.fn((id) =>
        Promise.resolve({ ...mockGroupData, id }),
      );

      const req = { params: { id: 'test-id' }, body: mockGroupData };
      const res = { status: jest.fn(), json: jest.fn() };
      await ctrl.updateGroup(req, res);

      expect(groupService.updateGroup).toHaveBeenCalledWith(
        'test-id',
        mockGroupData,
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        ...mockGroupData,
        id: 'test-id',
      });
    });

    it('should return 404 error if the group doesn`t exist', async () => {
      const mockGroupData = getMockGroupDto();
      const ctrl = container.get<any>(ctrlToken);
      const groupService = container.get<any>(TOKENS.GroupService);
      groupService.updateGroup = jest.fn(() =>
        Promise.reject(new Error('NOT_FOUND')),
      );

      const req = { params: { id: 'test-id' }, body: mockGroupData };
      const res = { status: jest.fn(), json: jest.fn() };
      await ctrl.updateGroup(req, res);

      expect(groupService.updateGroup).toHaveBeenCalledWith(
        'test-id',
        mockGroupData,
      );
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Group not found.',
        }),
      );
    });

    it('should return 400 error if the group name is taken', async () => {
      const mockGroupData = getMockGroupDto();
      const ctrl = container.get<any>(ctrlToken);
      const groupService = container.get<any>(TOKENS.GroupService);
      groupService.updateGroup = jest.fn(() =>
        Promise.reject(new Error('ALREADY_EXISTS')),
      );

      const req = { params: { id: 'test-id' }, body: mockGroupData };
      const res = { status: jest.fn(), json: jest.fn() };
      await ctrl.updateGroup(req, res);

      expect(groupService.updateGroup).toHaveBeenCalledWith(
        'test-id',
        mockGroupData,
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Group with this login already exists.',
        }),
      );
    });
  });

  describe('Add User To Group', () => {
    it('should add users to group if the group and users exist', async () => {
      const ctrl = container.get<any>(ctrlToken);
      const groupService = container.get<any>(TOKENS.GroupService);
      groupService.addUsersToGroup = jest.fn((id) => Promise.resolve({ id }));

      const req = {
        params: { id: 'test-id' },
        body: ['tuser-id-0', 'tuser-id-1', 'tuser-id-2'],
      };
      const res = { status: jest.fn(), json: jest.fn() };
      await ctrl.addUsersToGroup(req, res);

      expect(groupService.addUsersToGroup).toHaveBeenCalledWith('test-id', [
        'tuser-id-0',
        'tuser-id-1',
        'tuser-id-2',
      ]);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        id: 'test-id',
      });
    });

    it('should return 404 error if the group doesn`t exist', async () => {
      const ctrl = container.get<any>(ctrlToken);
      const groupService = container.get<any>(TOKENS.GroupService);
      groupService.addUsersToGroup = jest.fn(() =>
        Promise.reject(new Error('NOT_FOUND')),
      );

      const req = {
        params: { id: 'test-id' },
        body: ['tuser-id-0', 'tuser-id-1', 'tuser-id-2'],
      };
      const res = { status: jest.fn(), json: jest.fn() };
      await ctrl.addUsersToGroup(req, res);

      expect(groupService.addUsersToGroup).toHaveBeenCalledWith('test-id', [
        'tuser-id-0',
        'tuser-id-1',
        'tuser-id-2',
      ]);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Group not found.',
        }),
      );
    });

    it('should return 400 error if any of users doesn`t exist', async () => {
      const ctrl = container.get<any>(ctrlToken);
      const groupService = container.get<any>(TOKENS.GroupService);
      groupService.addUsersToGroup = jest.fn(() =>
        Promise.reject(new Error('USER_NOT_FOUND')),
      );

      const req = {
        params: { id: 'test-id' },
        body: ['tuser-id-0', 'tuser-id-1', 'tuser-id-2'],
      };
      const res = { status: jest.fn(), json: jest.fn() };
      await ctrl.addUsersToGroup(req, res);

      expect(groupService.addUsersToGroup).toHaveBeenCalledWith('test-id', [
        'tuser-id-0',
        'tuser-id-1',
        'tuser-id-2',
      ]);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'User not found.',
        }),
      );
    });
  });

  describe('Delete User', () => {
    it('should delete the group if it exists', async () => {
      const ctrl = container.get<any>(ctrlToken);
      const groupService = container.get<any>(TOKENS.GroupService);
      groupService.deleteGroup = jest.fn(() => Promise.resolve());

      const req = { params: { id: 'test-id' } };
      const res = { status: jest.fn(), json: jest.fn() };
      await ctrl.deleteGroup(req, res);

      expect(groupService.deleteGroup).toHaveBeenCalledWith('test-id');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        statusCode: 200,
      });
    });

    it('should return 404 error if the user doesn`t exist', async () => {
      const ctrl = container.get<any>(ctrlToken);
      const groupService = container.get<any>(TOKENS.GroupService);
      groupService.deleteGroup = jest.fn(() =>
        Promise.reject(new Error('NOT_FOUND')),
      );

      const req = { params: { id: 'test-id' } };
      const res = { status: jest.fn(), json: jest.fn() };
      await ctrl.deleteGroup(req, res);

      expect(groupService.deleteGroup).toHaveBeenCalledWith('test-id');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Group not found.',
        }),
      );
    });
  });
});
