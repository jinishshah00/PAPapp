import asyncHandler from "express-async-handler";
import Resource from "../models/resourceModel.js";

const createResource = asyncHandler(async (req, res) => {
    const { title, content } = req.body;

    const resource = new Resource({
        title,
        content,
        lastUpdatedBy: null,
    });

    const createdResource = await resource.save();
    res.status(201).json(createdResource);
});

const getResource = asyncHandler(async (req, res) => {
    const resource = await Resource.find({});
    res.json(resource);
});

const updateResource = asyncHandler(async (req, res) => {
    const { title, content } = req.body;
    const userId = req.user._id; // Get user ID from authenticated request
  
    const resource = await Resource.findById(req.params.id);
  
    if (resource) {
      resource.title = title || resource.title;
      resource.content = content || resource.content;
      resource.lastUpdatedBy = userId;
  
      const updatedResource = await resource.save();
      res.json(updatedResource);
    } else {
      res.status(404);
      throw new Error("Resource not found");
    }
  });
  

export { getResource, updateResource, createResource };