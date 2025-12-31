import { ObjectId } from "mongodb";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getDB } from "../utils/db.js";
import { fetchWithCursor } from "../utils/fetchWithCursor.js";

export const getTopPerformingCategoryData = asyncHandler(async (req, res) => {
  const db = getDB();
  const { deploymentId } = req.params;

  const deploymentObjectId = new ObjectId(deploymentId);

  const cursor = db.collection("bills").aggregate([
    {
      $match: { 
        deployment_id: deploymentObjectId, _kots: { $exists: true, $ne: [] } 
      } 
    },
    { 
      $project: {
          _id: 0, _kots: 1 
        }
    },
    { 
      $unwind: "$_kots" 
    },
    { 
      $unwind: "$_kots.items" 
    },
    { 
      $group: {
        _id: "$_kots.items.category.categoryName",
        totalSubtotal: { $sum: { $ifNull: ["$_kots.items.subtotal", 0] } }
      }
    },
    { 
      $sort: {
        totalSubtotal: -1 
      } 
    },
    {
      $project: {
        _id: 0, name: "$_id", totalSubtotal: 1 
      } 
    },
    {
       $limit: 5 
    }
  ]);

  const result = await fetchWithCursor(cursor);

  if (!result) throw new ApiError(404, "Data not found");

  if (result.length === 0)
    return res.status(204).json({ data: [], message: "success" });

  return res.status(200).json({ data: result, message: "success" });
});


export const getCategoryData = asyncHandler(async (req, res) => {
  const db = getDB();
  const { deploymentId } = req.params;

  const deploymentObjectId = new ObjectId(deploymentId);

  const cursor = db.collection("bills").aggregate([
    { 
      $match: {
          deployment_id: deploymentObjectId, _kots: { $exists: true, $ne: [] } 
        } 
    },
    {
      $project: {
        _id: 0, _kots: 1 
      } 
    },
    {
      $unwind: "$_kots" 
    },
    { 
      $unwind: "$_kots.items" 
    },
    {
      $group: {
        _id: "$_kots.items.category.categoryName",
        totalQuantity: { $sum: { $ifNull: ["$_kots.items.quantity", 0] } },
        totalSubtotal: { $sum: { $ifNull: ["$_kots.items.subtotal", 0] } }
      }
    },
    { 
      $sort: { _id: 1 } 
    },
    { 
      $project: { 
        _id: 0, name: "$_id", totalQuantity: 1, totalSubtotal: 1 
      } 
    }
  ]);

  const result = await fetchWithCursor(cursor);

  if (!result) throw new ApiError(404, "Data not found");

  if (!result.length)
    return res.status(204).json({ data: [], message: "success" });

  return res.status(200).json({ data: result, message: "success" });
});
