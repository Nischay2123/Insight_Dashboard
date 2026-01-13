import { ObjectId } from "mongodb";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getDB } from "../utils/db.js";
import { fetchWithCursor } from "../utils/fetchWithCursor.js";

export const getDeployemtsData = asyncHandler(async (req, res) => {
  const db = getDB();

    const cursor = db.collection("deployments").find({});

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

export const getDeployemntWiseCategoryData = asyncHandler(async (req, res) => {
  const db = getDB();
  const { name } = req.body;

  


  const cursor = db.collection("bills").aggregate([   
    { 
      $match: {
        "_kots.items.category.categoryName": name 
      } 
    },
    { 
      $unwind: "$_kots" 
    },
    {
      $unwind: "$_kots.items" 
    },
    {
        $match:{ "_kots.items.category.categoryName":name}
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

    const {date,deploymentIds}= req.body

    const gdate = new Date(date);  
    const nextDate = new Date(gdate);
    nextDate.setDate(gdate.getDate() + 1);

    let deploymentObjectIds;
    if (deploymentIds) {
        deploymentObjectIds=deploymentIds.map((id)=> new ObjectId(id))
    }
    // console.log(deploymentObjectIds);
    
    const data = await db.collection("bills").aggregate([
        {
            $match: {
                "_created": {
                    $gte:gdate,
                    $lt: nextDate
                },
                deployment_id:
                    Array.isArray(deploymentIds) && deploymentIds.length > 0
                        ? { $in: deploymentObjectIds }
                        : { $ne: null },
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
                            
                            tab: "$_id.tabType",
                            totalOrdersOfTab: "$totalOrdersOfTab"
                            
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
            $project: {
                _id: 0,
                deployment_id: "$_id",
                tabDetails: 1,

                netSales: { $round: ["$netSales", 2] },
                grossSales: { $round: ["$grossSales", 2] },

                totalBills: "$totalBills",

                averagePerBill: {
                $cond: [
                    { $gt: ["$totalBills", 0] },
                    { $round: [{ $divide: ["$netSales", "$totalBills"] }, 2] },
                    0
                ]
                },

                totalCustomerServed: "$totalCustomerServed",

                averageRevenuePerUser: {
                $cond: [
                    { $gt: ["$totalCustomerServed", 0] },
                    { $round: [{ $divide: ["$netSales", "$totalCustomerServed"] }, 2] },
                    0
                ]
                },

                totalDiscount: { $round: ["$totalDiscount", 2] },
                totalCovers: "$totalCovers",

                averagePerCover: {
                $cond: [
                    { $gt: ["$totalCovers", 0] },
                    { $round: [{ $divide: ["$netSales", "$totalCovers"] }, 2] },
                    0
                ]
                },

                voidBills: "$voidBills",
                deletedKot: "$deletedKot",

                dineInNetSales: { $round: ["$dineInNetSales", 2] },
                dineInCovers: "$dineInCovers",

                dineInAvgPerCover: {
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

export const createDeploymentGroup = asyncHandler(async (req, res) => {
  const db = getDB();

  const { name, deployments } = req.body;

  if (!name || typeof name !== "string") {
    throw new ApiError(400, "Group name is required");
  }

  if (!Array.isArray(deployments) || deployments.length === 0) {
    throw new ApiError(400, "deployments must be a non-empty array");
  }

  const normalizedDeployments = deployments.map((d) => {
    if (!d?._id || !d?.name) {
      throw new ApiError(
        400,
        "Each deployment must contain _id and name"
      );
    }

    let objectId;
    try {
      objectId = new ObjectId(d._id);
    } catch {
      throw new ApiError(400, `Invalid ObjectId: ${d._id}`);
    }

    return {
      _id: objectId,
      name: d.name,
    };
  });
//   console.log(normalizedDeployments);
  
  const existingGroup = await db
    .collection("deploymentsGroup")
    .findOne({ name });

  if (existingGroup) {
    throw new ApiError(409, "Deployment group already exists");
  }

  const payload = {
    name,
    deployments: normalizedDeployments,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await db
    .collection("deploymentsGroup")
    .insertOne(payload);

  if (!result?.insertedId) {
    throw new ApiError(500, "Failed to create deployment group");
  }

  return res.status(201).json({
    data: {
      _id: result.insertedId,
      ...payload,
    },
    message: "Deployment group created successfully",
  });
});

export const getDeploymentGroup = asyncHandler(async (req, res) => {
  const db = getDB();

  
  const Groups = await db
    .collection("deploymentsGroup")
    .find({}).toArray();

  if (!Groups) {
    throw new ApiError(409, "NO Deployment group exists");
  }

  return res.status(201).json({
    data: Groups,
    message: "Deployment group fetched successfully",
  });
});

export const updateDeploymentGroup = asyncHandler(async (req, res) => {
  const db = getDB();
  const { id } = req.params;
  const { name } = req.body;

  if (!ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid deployment group id");
  }

  if (!name || typeof name !== "string") {
    throw new ApiError(400, "Group name is required");
  }

  const existingGroup = await db
    .collection("deploymentsGroup")
    .findOne({ _id: new ObjectId(id) });

  if (!existingGroup) {
    throw new ApiError(404, "Deployment group not found");
  }

  const duplicate = await db
    .collection("deploymentsGroup")
    .findOne({
      name,
      _id: { $ne: new ObjectId(id) },
    });

  if (duplicate) {
    throw new ApiError(409, "Deployment group with this name already exists");
  }

  const result = await db
    .collection("deploymentsGroup")
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          name,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );

  return res.status(200).json({
    data: result.value,
    message: "Deployment group updated successfully",
  });
});



export const deleteDeploymentGroup = asyncHandler(async (req, res) => {
  const db = getDB();
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid deployment group id");
  }

  const result = await db
    .collection("deploymentsGroup")
    .findOneAndDelete({
      _id: new ObjectId(id),
    });
    if (!result) {
        throw new ApiError(404,"Deployment Group not present with this id")
    }
    
  return res.status(200).json({
    data: result,
    message: "Deployment group deleted successfully",
  });
});
