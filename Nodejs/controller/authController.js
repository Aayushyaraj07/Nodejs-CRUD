const { where } = require("sequelize");
const user = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const signup = catchAsync(async (req, res, next) => {
  const body = req.body;

  const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  };

  if (!["1", "2"].includes(body.userType)) {
    throw new AppError("Invalid user type", 400);
  }

  const newUser = await user.create({
    userType: body.userType,
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    password: body.password,
    confirmPassword: body.confirmPassword,
  });

  if (!newUser) {
    return next(new AppError("User already exists. Please Login", 400));
  }

  const result = newUser.toJSON();

  delete result.password;
  delete result.deletedAt;

  result.token = generateToken({
    id: result.id,
  });

  return res.status(201).json({
    status: "success",
    data: result,
  });
});

const login = async (req, res, next) => {
  const { email, password } = req.body;

  const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  };

  if (!email || !password) {
    return next(new AppError("Please provide both email and password", 400));
  }
  const result = await user.findOne({ where: { email } });

  delete result.password;
  delete result.deletedAt;

  if (!result || !(await bcrypt.compare(password, result.password))) {
    return next(new AppError("Invalid email or password", 401));
  }

  const token = generateToken({
    id: result.id,
  });


  const userName = result.firstName;
  const userId = result.id

  return res.json({
    status: "success",
    token,
    userName,
    userId
  });
};

const authentiation = catchAsync(async (req, res, next) => {
  let idToken = "";
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    idToken = req.headers.authorization.split(" ")[1];
  }
  if (!idToken) {
    return next(
      new AppError("You are not logged in! Please log in to get an access", 401)
    );
  }

  const tokenDetail = jwt.verify(idToken, process.env.JWT_SECRET_KEY);

  const freshUser = await user.findByPk(tokenDetail.id);

  if (!freshUser) {
    return next(new AppError("User does not exist", 401));
  }
  req.user = freshUser;
  return next();
});

const restrictTo = (...userType) => {
  const checkPermission = (req, res, next) => {
    if (!userType.includes(req.user.userType)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    return next();
  };

  return checkPermission;
};

module.exports = { signup, login, authentiation, restrictTo };
