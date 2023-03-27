const Sport = require('../models/sportModel');

const {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
} = require('./handleOps');

exports.getSports = getAll(Sport);
exports.getOneSport = getOne(Sport);
exports.createSoprt = createOne(Sport);
exports.updateSoprt = updateOne(Sport);
exports.deleteSoprt = deleteOne(Sport);
