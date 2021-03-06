const TOKENS = {
  Logger: Symbol.for('Logger'),
  LoggerMiddleware: Symbol.for('LoggerMiddleware'),
  Config: Symbol.for('Config'),
  PersistenceManager: Symbol.for('PersistenceManager'),
  UserModel: Symbol.for('UserModel'),
  GroupModel: Symbol.for('GroupModel'),
  AuthService: Symbol.for('AuthService'),
  UserService: Symbol.for('UserService'),
  GroupService: Symbol.for('GroupService'),
  UserRepository: Symbol.for('UserRepository'),
  GroupRepository: Symbol.for('GroupRepository'),
  AuthMiddleware: Symbol.for('AuthMiddleware'),
  ValidationErrorMiddleware: Symbol.for('ValidationErrorMiddleware'),
  UnhandledErrorMiddleware: Symbol.for('UnhandledErrorMiddleware'),
  ExecutionTimeMiddleware: Symbol.for('ExecutionTimeMiddleware'),
};

export { TOKENS };
