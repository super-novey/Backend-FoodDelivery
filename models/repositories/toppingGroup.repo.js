const { getSelectData } = require("../../utils");
const toppingGroupModel = require("../ToppingGroup")

const findAllByShopId = async ({ query, limit, skip }) => {
    return await toppingGroupModel.aggregate([
        { $match: query },
        {
            $lookup: {
                from: "Toppings",
                localField: "_id",
                foreignField: "tpGroupId",
                as: "toppings"
            }
        },
        { $skip: skip },
        { $limit: limit }
    ]);
}

const findAllByShopIdV2 = async ({ filter, limit, page, select }) => {
    limit = Number(limit);
    page = Number(page)
    const skip = (page - 1) * limit
    const totalItems = await toppingGroupModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / limit);
    const result = await toppingGroupModel.aggregate([
        { $match: filter },
        {
            $lookup: {
                from: "Toppings",
                let: { groupId: "$_id" },
                pipeline: [
                    { $match: { $expr: { $eq: ["$tpGroupId", "$$groupId"] } } },
                    {
                        $project: {
                            __v: 0,
                            tpGroupId: 0
                        }
                    }
                ],
                as: "toppings"
            }
        },
        {
            $project: getSelectData(select)
        },
        { $skip: skip },
        { $limit: limit }
    ]);


    return {
        data: result,
        page,
        limit,
        totalPages,
        currentPage: page,
        pageSize: limit,
        totalItems
    };
}

module.exports = {
    findAllByShopId,
    findAllByShopIdV2
}