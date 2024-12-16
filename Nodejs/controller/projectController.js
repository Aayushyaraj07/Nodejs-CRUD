const user = require("../models/user");
const project = require("../models/project");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { use } = require("../route/projectRoute");

// project test data
// {
//   "title": "Eco-Friendly Bag",
//   "productImage": ["https://example.com/images/water-bottle.jpg","https://example.com/images/water-bottle.jpg"],
//   "price": 19.99,
//   "shortDescription": "A reusable water bottle made from BPA-free materials.",
//   "description": "This eco-friendly water bottle is perfect for staying hydrated on the go. It is durable, lightweight, and made from BPA-free materials, ensuring a safe and sustainable way to carry your beverages.",
//   "productUrl": "https://example.com/products/eco-friendly-water-bottle",
//   "category": ["Home & Kitchen"],
//   "tags": ["gadget"]
// }

const createProject = catchAsync(async (req, res, next) => {
  const body = req.body;
  const userId = req.user.id;

  // Create the project with required fields and optional ones
  const newProject = await project.create({
    title: body.title,  // Required
    productImage: body.productImage, // Required
    price: body.price, // Required
    shortDescription: body.shortDescription, // Required
    // description: body.shortDescription || "No description provided", 
    // productUrl: body.productUrl || "",
    category: body.category || [], 
    // tags: body.tags || [], 
    createdBy: userId, // Required
  });

  return res.status(201).json({
    status: "success",
    data: newProject,
  });
});


const updateProject = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const projectId = req.params.id;
  const body = req.body;

  // Find the project to update
  const result = await project.findOne({
    where: { id: projectId, createdBy: userId },
  });

  if (!result) {
    return next(new AppError("Invalid project id", 400));
  }

  // Update the fields, set only the provided ones
  result.title = body.title || result.title; 
  result.productImage = body.productImage || result.productImage; 
  result.price = body.price || result.price; 
  result.shortDescription = body.shortDescription ; 
  result.description = body.description 
  result.productUrl = body.productUrl || result.productUrl; 
  result.category = body.category || result.category; 
  result.tags = body.tags || result.tags; 

  // Save the updated project
  const updatedResult = await result.save();

  return res.json({
    status: "success",
    data: updatedResult,
  });
});


const getAllProject = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const result = await project.findAll({
    include: user,
    where: { createdBy: userId },
  });
  return res.json({
    status: "success",
    data: result,
  });
});

const getProjectById = catchAsync(async (req, res, next) => {
  const projectId = req.params.id;
  const result = await project.findByPk(projectId, { include: user });
  if (!result) {
    return next(new AppError("Invalid project id", 400));
  }
  return res.json({
    status: "success",
    data: result,
  });
});

const getProjectByUserId = catchAsync(async (req, res, next) => {
  const userId = req.params.id;
  const result = await project.findAll({ where: { createdBy: userId } });
  if (!result) {
    return next(new AppError("Invalid project id", 400));
  }
  return res.json({
    status: "success",
    data: result,
  });
});

const deleteProject = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const projectId = req.params.id;
  const body = req.body;

  const result = await project.findOne({
    where: { id: projectId, createdBy: userId },
  });

  if (!result) {
    return next(new AppError("Invalid project id", 400));
  }

  await result.destroy();

  return res.json({
    status: "success",
    message: "Project deleted successfully!",
  });
});

module.exports = {
  createProject,
  getAllProject,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectByUserId,
};
