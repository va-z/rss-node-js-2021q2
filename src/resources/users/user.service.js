/**
 * User service
 * @module user/service
 */
const User = require('./user.model');
const usersRepo = require('./user.memory.repository');
const taskService = require('../tasks/task.service');

/**
 * @returns {Array}
 */
const getAll = () => usersRepo.getAll();

/**
 * @param {String} id
 * @returns {Object}
 */
const getById = (id) => usersRepo.getById(id);

/**
 * @param {String} user
 * @returns {User}
 */
const create = (props) => usersRepo.create(new User(props));

/**
 * @param {String} id
 * @param {Object} user
 * @returns {User}
 */
const update = (id, props) => usersRepo.update(id, props);

/**
 * @param {String} id
 */
const remove = async (id) => {
  await usersRepo.remove(id);
  await taskService.removeUserBinding(id);
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
