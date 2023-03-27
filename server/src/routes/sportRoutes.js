const router = require('express').Router();
const {
  createSoprt,
  deleteSoprt,
  getOneSport,
  getSports,
  updateSoprt,
} = require('../controllers/sportControllers');

router.route('/').get(getSports).post(createSoprt);
router.route('/:id').get(getOneSport).patch(updateSoprt).delete(deleteSoprt);
module.exports = router;
