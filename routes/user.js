const express = require("express");

const checkAuth = require("../middleware/check-auth");

const UserController = require("../controllers/user");

const router = express.Router();

router.post("/signup", UserController.createUser);

router.post("/createUser", checkAuth, UserController.createUser);

router.post("/login", UserController.userLogin);

router.get("/logout", UserController.userLogout);

router.get("/:id", UserController.getUser);

router.post("/getUsers", checkAuth, UserController.getUsers);

router.delete("/:id", checkAuth, UserController.deleteUser);

router.put("/:id", checkAuth, UserController.updateUser);

module.exports = router;
