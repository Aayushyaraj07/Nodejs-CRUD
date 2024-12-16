const {
  authentiation,
  restrictTo,
} = require("../controller/authController.js");
const {
  createProject,
  getAllProject,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectByUserId,
} = require("../controller/projectController.js");

const router = require("express").Router();

router
  .route("/")
  .post(authentiation, restrictTo("1"), createProject)
  .get(authentiation, restrictTo("1"), getAllProject);

router
  .route("/:id")
  .get(authentiation, restrictTo("1"), getProjectById)

  .patch(authentiation, restrictTo("1"), updateProject)
  .delete(authentiation, restrictTo("1"), deleteProject);

router.route("/userId/:id").get(authentiation,restrictTo("1"), getProjectByUserId)

module.exports = router;
