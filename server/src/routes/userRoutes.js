const router = require("express").Router();

const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  protect,
  restrictTo,
  logout,
  updatePassword,
} = require("../controllers/authControllers");

const {
  getAllUsers,
  getUser,
  getMe,
  deleteMe,
  updateUserData,
} = require("../controllers/userControllers");

// Auth
router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

router.use(protect);
router.patch("/updateMyPassword", updatePassword);

router.route("/").get(restrictTo("admin"), getAllUsers);

router.use(restrictTo("user"));

router.route("/me").get(getMe, getUser).delete(deleteMe);
router.route("/:id").get(getUser);
router.patch("/updateUserData", updateUserData);

module.exports = router;
