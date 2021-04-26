const TOKENS = {
  PersistenceManager: Symbol.for('PersistenceManager'),
  UserModel: Symbol.for('UserModel'),
  GroupModel: Symbol.for('GroupModel'),
  UserService: Symbol.for('UserService'),
  GroupService: Symbol.for('GroupService'),
  UserRepository: Symbol.for('UserRepository'),
  GroupRepository: Symbol.for('GroupRepository'),
  ValidationErrorMiddleware: Symbol.for('ValidationErrorMiddleware'),
};

export { TOKENS };
