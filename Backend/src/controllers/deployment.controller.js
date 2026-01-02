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
  const { deployment_id } = req.params;
  console.log(typeof deployment_id);
  

  const deployment_objectId =new ObjectId(deployment_id);

  console.log(typeof deployment_objectId);
  console.log(ObjectId.isValid(deployment_id))

const data = await db.collection("bills").aggregate([
    {
        $match: {
            deployment_id: deployment_objectId
        }
    },
    {
        $project: {
            "_id": 1,
            "_covers": 1,
            "billDiscountAmount": 1,
            chargesAmount: "$charges.amount",
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
            billTotalCharges: "$chargesAmount",
            billTotalTax: {
                $sum: ["$totalTaxKot", "$chargesTax"],
            },
            billTotalAmount: "$totalAmountKot",
        }
    },
    {
        $group: {
            _id: null,
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
    }
]).toArray();

  if (!data) throw new ApiError(404, "Data not found");

  return res.status(200).json({ data: data, message: "success" });
})