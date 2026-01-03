import { ObjectId } from "mongodb";
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



export const getDeployemntWiseItemData = asyncHandler(async (req, res) => {
  const db = getDB();
  const { name } = req.body;

  


  const cursor = db.collection("bills").aggregate([   
    { 
      $match: {
        "_kots.items.name": name 
      } 
    },
    { 
      $unwind: "$_kots" 
    },
    {
      $unwind: "$_kots.items" 
    },
    {
        $match:{ "_kots.items.name":name}
    },
    {
        $group:{
            _id:"$deployment_id",
            grossSale:{ $sum: { $ifNull: ["$_kots.items.subtotal", 0] } },
            totalQuantity: { $sum: { $ifNull: ["$_kots.items.quantity", 0] } }
        }
    },
    {
        $sort:{_id:1}
    }
    ]);

  const result = await fetchWithCursor(cursor);

  if (!result) throw new ApiError(404, "Data not found");

  if (!result.length)
    return res.status(204).json({ data: [], message: "success" });

  return res.status(200).json({ data: result, message: "success" });
});

export const getDeploymentAnalytics = asyncHandler(async(req,res)=>{
    const db = getDB();

    const date = new Date("2025-12-29");  
    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + 1);

    const data = await db.collection("bills").aggregate([
        {
            $match: {
                "_created": {
                    $gte:date,
                    $lt: nextDate
                },
                "deployment_id":{$ne:null}
            }
        },
        {
            $project: {
                "_id": 1,
                "deployment_id":1,
                "_covers": 1,
                "billDiscountAmount": 1,
                chargesAmount: "$charges.amount",
                chargesTax: "$charges.totalTax",
                "_customer": 1,
                "tabType": 1,
                "_kots.taxAmount": 1,
                "_kots.totalDiscount": 1,
                "_kots.totalAmount": 1,
                "_kots.isVoid": 1,
                "isVoid": 1,
            }
        },
        {
            $unwind: {
                path: "$_kots",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $group: {
                _id: "$_id",
                deployment_id:{
                    $first: "$deployment_id"
                },
                tabType: {
                    $first: "$tabType",
                },
                covers: {
                    $first: "$_covers",
                },
                billDiscountAmount: {
                    $first: "$billDiscountAmount",
                },
                chargesAmount: {
                    $first: "$chargesAmount",
                },
                chargesTax: {
                    $first: "$chargesTax",
                },
                customer: {
                    $first: "$_customer",
                },
                isVoid: {
                    $first: "$isVoid",
                },
                kotVoided: {
                    $sum: {
                        $cond: {
                            if: { $eq: ["$_kots.isVoid", true] },
                            then: 1,
                            else: 0
                        }
                    }
                },
                totalAmountKot: {
                    $sum: {
                        $cond: {
                            if: { $eq: ["$_kots.isVoid", false] },
                            then: "$_kots.totalAmount",
                            else: 0,
                        }
                    }
                },
                totalTaxKot: {
                    $sum: {
                        $cond: {
                            if: { $eq: ["$_kots.isVoid", false] },
                            then: "$_kots.taxAmount",
                            else: 0,
                        }
                    }
                },
                totalDiscountKot: {
                    $sum: {
                        $cond: {
                            if: { $eq: ["$_kots.isVoid", false] },
                            then: "$_kots.totalDiscount",
                            else: 0,
                        }
                    }
                },
            }
        },
        {
            $project: {
                "_id": 1,
                "deployment_id":1,
                "covers": 1,
                "tabType": 1,
                customer: {
                    $and: [
                        { "$ne": ["$customer", null] },
                        { "$ne": ["$customer", {}] },
                        { "$ne": ["$customer.customerId", null] }
                    ]
                },
                "isVoid": 1,
                kotVoided: 1,
                billTotalCharges: "$chargesAmount",
                billTotalTax: {
                    $sum: ["$totalTaxKot", "$chargesTax"],
                },
                billDiscountAmount: {
                    $sum: ["$billDiscountAmount", "$totalDiscountKot"]
                },
                billTotalAmount: "$totalAmountKot",
            }
        },
        {
            $group: {
                _id: {
                    deployment_id: "$deployment_id",
                    tabType: "$tabType"
                },
                isVoid:{$first:"$isVoid"},
                totalOrdersOfTab: { 
                    $sum: {
                        $cond: {
                            if: { $eq: ["$isVoid", false] },
                            then: 1,
                            else: 0,
                        }
                    } 
                },
                netSales: {
                    $sum: {
                        $cond: {
                            if: { $eq: ["$isVoid", false] },
                            then: { $subtract: ["$billTotalAmount", "$billDiscountAmount"] },
                            else: 0,
                        }
                    }
                },
                grossSales: {
                    $sum: {
                        $cond: {
                            if: { $eq: ["$isVoid", false] },
                            then: { $subtract: [{ $sum: ["$billTotalAmount", "$billTotalTax", "$billTotalCharges"] }, "$billDiscountAmount"] },
                            else: 0,
                        }
                    }
                },
                totalBills: {
                    $sum: {
                        $cond: {
                            if: { $eq: ["$isVoid", false] },
                            then: 1,
                            else: 0,
                        }
                    },
                },
                totalCustomerServed: {
                    $sum: {
                        $cond: {
                            if: {
                                $and: [
                                    { $eq: ["$isVoid", false] },
                                    { $eq: ["$customer", true] }   
                                ]
                            },
                            then: 1,
                            else: 0
                        }
                    }
                },
                totalDiscount: {
                    $sum: {
                        $cond: {
                            if: { $eq: ["$isVoid", false] },
                            then: "$billDiscountAmount",
                            else: 0,
                        }
                    }
                },
                totalCovers: {
                    $sum: {
                        $cond: {
                            if: {
                                $and: [
                                    { $eq: ["$isVoid", false] },
                                    { $ne: ["$covers", null] }
                                ]
                            },
                            then: "$covers",
                            else: 0
                        }
                    }
                },
                voidBills: {
                    $sum: {
                        $cond: {
                            if: { $eq: ["$isVoid", true] },
                            then: 1,
                            else: 0,
                        }
                    }
                },
                deletedKot:{
                    $first:"$kotVoided"
                },
                dineInNetSales: {
                    $sum: {
                        $cond: {
                            if: {
                                $and: [
                                    { $eq: ["$isVoid", false] },
                                    { $eq: ["$tabType", "table"] },
                                ]
                            },
                            then: { $subtract: ["$billTotalAmount", "$billDiscountAmount"] },
                            else: 0,
                        }
                    }
                },
                dineInCovers: {
                    $sum: {
                        $cond: {
                            if: {
                                $and: [
                                    { $eq: ["$isVoid", false] },
                                    { $eq: ["$tabType", "table"] },
                                    { $ne: ["$covers", null] }
                                ]
                            },
                            then: "$covers",
                            else: 0
                        }
                    }
                },
            }
        },
        {
            $group: {
                _id: "$_id.deployment_id",
                tabDetails: {
                    $push: {
                        $cond: [
                            { $eq: ["$isVoid", false] },
                            {
                                tab: "$_id.tabType",
                                totalOrdersOfTab: "$totalOrdersOfTab"
                            },
                            "$$REMOVE"  
                        ]

                    }
                },
                netSales: { $sum: "$netSales" },
                grossSales: { $sum: "$grossSales" },
                totalBills: { $sum: "$totalBills" },
                totalCustomerServed: { $sum: "$totalCustomerServed" },
                totalDiscount: { $sum: "$totalDiscount" },
                totalCovers: { $sum: "$totalCovers" },
                voidBills: { $sum: "$voidBills" },
                deletedKot: { $sum: "$deletedKot" },
                dineInNetSales: { $sum: "$dineInNetSales" },
                dineInCovers: { $sum: "$dineInCovers" }
            }
        },
        {
            $project:{
                _id:0,
                deployment_id:"$_id",
                tabDetails:1,
                netSales:"$netSales",
                grossSales:"$grossSales",
                averagePerBill:{
                    $cond:[
                        { $gt:["$totalBills",0]},
                        { $round: [{ $divide: ["$netSales","$totalBills"] }, 2] },
                        0
                    ]
                },
                totalBills:"$totalBills",
                totalCustomerServed:"$totalCustomerServed",
                totalDiscount:"$totalDiscount",
                totalCovers:"$totalCovers",
                voidBills:"$voidBills",
                deletedKot:"$deletedKot",
                averagePerCover:{
                    $cond:[
                        { $gt:["$totalCovers",0]},
                        { $round: [{ $divide: ["$netSales","$totalCovers"] }, 2] },
                        0
                    ]
                },
                averageRevenuePerUser:{
                    $cond:[
                        { $gt:["$totalCustomerServed",0]},
                        { $round: [{ $divide: ["$netSales","$totalCustomerServed"] }, 2] },
                        0
                    ]
                },
                dineInNetSales:"$dineInNetSales",
                dineInCovers:"$dineInCovers",
                dineInAvgPerCover:{
                    $cond: [
                        { $gt: ["$dineInCovers", 0] },
                        { $round: [{ $divide: ["$dineInNetSales", "$dineInCovers"] }, 2] },
                        0
                    ]
                }
            }   
        }
    ]).toArray();

    if (!data) throw new ApiError(404, "Data not found");

    return res.status(200).json({ data: data, message: "success" });
})


