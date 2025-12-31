import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getDB } from "../utils/db.js";
import { fetchWithCursor } from "../utils/fetchWithCursor.js";

export const getDeployemtsData = asyncHandler(async (req, res) => {
  const db = getDB();

  const cursor = db.collection("bills").aggregate([
    {
      $project: {
        _id: 0, deployment_id: 1 
      } 
    },
    {
      $match: {
        deployment_id: { $ne: null } 
      } 
    },
    { 
      $group: {
        _id: "$deployment_id" 
      } 
    },
    {
      $sort: {
         _id: 1 
        } 
    }
  ]);

  const result = await fetchWithCursor(cursor);

  if (!result) throw new ApiError(404, "Data not found");

  if (result.length === 0)
    return res.status(204).json({ data: [], message: "success" });

  return res.status(200).json({ data: result, message: "success" });
});