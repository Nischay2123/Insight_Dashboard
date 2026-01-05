import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getDB } from "../utils/db.js";
import { fetchWithCursor } from "../utils/fetchWithCursor.js";

export const tabTableData = asyncHandler(async (req, res) => {
  const db = getDB();
  const { tab } = req.params;

  const cursor = db.collection("bills").aggregate([
    { $match: { tab: tab } },
    {
      $group: {
        _id: "$deployment_id",
        totalOrders: { $sum: 1 },
        totalAmount: { $sum: "$aggregation.totalAmount" }
      }
    },
    { $sort: { _id: 1 } }
  ], { batchSize: 20 });

  const result = await fetchWithCursor(cursor);

  if (!result) throw new ApiError(404, "Data not found");

  if (result.length === 0) {
    return res.status(204).json({
      data: [],
      message: "success"
    });
  }

  return res.status(200).json({
    data: result,
    message: "success"
  });
});

export const tabChartData = asyncHandler(async (req, res) => {
  const db = getDB();
  const {date} = req.body;
  const gdate = new Date(date);  
  const nextDate = new Date(gdate);
  nextDate.setDate(gdate.getDate() + 1);

  const cursor = db.collection("bills").aggregate([
    { $match: { 
        tab: { $ne: null },
        "_created": {
            $gte:gdate,
            $lt: nextDate
        },
      },
     },
    {
      $group: {
        _id: "$tab",
        totalAmount: { $sum: { $ifNull: ["$aggregation.totalAmount", 0] } }
      }
    },
    { $sort: { totalAmount: 1 } },
    {
      $project: {
        _id: 0,
        tab: "$_id",
        totalAmount: 1
      }
    }
  ]);

  const result = await fetchWithCursor(cursor);

  if (!result) throw new ApiError(404, "Data not found");

  if (result.length === 0) {
    return res.status(204).json({
      data: [],
      message: "success"
    });
  }

  return res.status(200).json({
    data: result,
    message: "success"
  });
});
