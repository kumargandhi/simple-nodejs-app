const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      username: req.body.username,
      password: hash,
      displayName: req.body.displayName,
      roles: req.body.roles,
    });
    user
        .save()
        .then(result => {
          res.status(201).json({
            message: "User created!",
            result: result
          });
        })
        .catch(err => {
          res.status(500).json({
            message: "Invalid authentication credentials!",
            error: err
          });
        });
  });
};

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({ username: req.body.username })
      .then(user => {
        if (!user) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password);
      })
      .then(result => {
        if (!result) {
          return res.status(401).json({
            message: "Authentication failed, please check your login credentials."
          });
        }
        const token = jwt.sign(
            { username: fetchedUser.username, userId: fetchedUser._id },
            process.env.JWT_KEY,
            { expiresIn: "1h" }
        );
        res.status(200).json({
          token: token,
          expiresIn: 3600,
          userId: fetchedUser._id,
          username: fetchedUser.username
        });
      })
      .catch(err => {
        return res.status(401).json({
          message: "Invalid authentication credentials!",
          error: err
        });
      });
};

exports.userLogout = (req, res, next) => {
  res.status(200).json({
    message: "Logout successful!"
  });
};

exports.getUser = (req, res, next) => {
  User.findById(req.params.id)
      .then(user => {
        if (user) {
          res.status(200).json(user);
        } else {
          res.status(404).json({
            message: "User not found!"
          });
        }
      })
      .catch(error => {
        res.status(500).json({
          message: "Fetching User failed!",
          error: error
        });
      });
};

exports.getUsers = (req, res, next) => {
  const pageSize = +req.body.pageSize;
  const currentPage = +req.body.page;
  const filterUsername = req.body.filter.username;
  let userQuery;
  if (filterUsername) {
    let re = new RegExp(filterUsername,"i");
    userQuery = User.find({"username": re});
  } else {
    userQuery = User.find();
  }
  let fetchedUsers;
  if (pageSize && currentPage) {
    userQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  userQuery
      .then(documents => {
        fetchedUsers = documents;
        return User.count();
      })
      .then(count => {
        res.status(200).json({
          paging: {
            page: +req.body.page,
            perPageCount: +req.body.pageSize,
            totalCount: count
          },
          results: fetchedUsers
        });
      })
      .catch(error => {
        res.status(500).json({
          message: "Fetching posts failed!",
          error: error
        });
      });
};

exports.deleteUser = (req, res, next) => {
  User.deleteOne({_id: req.params.id})
      .then(result => {
        if (result.n > 0) {
          res.status(200).json({
            message: "Deletion successfull!"
          });
        } else {
          res.status(401).json({
            message: "Not authorised!"
          });
        }
      })
      .catch(error => {
        res.status(500).json({
          message: "Deleting user failed!",
          error: error
        });
      })
};

exports.updateUser = (req, res, next) => {
  User.updateOne({_id: req.body._id}, {$set: {"displayName": req.body.displayName, "roles": req.body.roles}})
      .then(result => {
        if (result.n > 0) {
          res.status(200).json({message: "Update successful!"})
        } else {
          res.status(401).json({message: "Not authorised!"});
        }
      })
      .catch(error => {
        res.status(500).json({
          message: "Update failed!",
          error: error
        });
      })
};
