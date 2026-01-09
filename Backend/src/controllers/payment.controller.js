import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getDB } from "../utils/db.js";
import { fetchWithCursor } from "../utils/fetchWithCursor.js";

export const paymentChartData = asyncHandler(async (req, res) => {
  const db = getDB();
  const {date} = req.body;
  const gdate = new Date(date);  
  const nextDate = new Date(gdate);
  nextDate.setDate(gdate.getDate() + 1);

  const cursor = db.collection("bills").aggregate([
  {
    $match: {
      _created: { $gte: gdate, $lt: nextDate }
    }
  },

  {
    $project: {
      totals: {
        $concatArrays:
          {
            $map: {
              input: "$payments.cards",
              as: "c",
              in: {
                type: "$$c.cardType",
                amount: "$$c.totalAmount"
              }
            }
          }
      }
    }
  },

  { $unwind: "$totals" },

  {
    $group: {
      _id: "$totals.type",
      totalAmount: { $sum: "$totals.amount" }
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