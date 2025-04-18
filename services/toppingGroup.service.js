const { findById } = require("../services/PartnerServices")
const { BadRequestError, NotFoundError } = require('../core/error.response')
const toppingGroup = require("../models/ToppingGroup")
const { findAllByShopId, findAllByShopIdV2 } = require("../models/repositories/toppingGroup.repo")
const { Types } = require("mongoose")


/*
    tpGroupName: {type: String, required: true},  // "Size", "Trân châu"
    tpShopId: {type: Types.ObjectId, ref: "UpdatedPartner"},
    orderIndex: {type: Number, default: 0}
*/

class ToppingGroupService {
    static findById = async (id) => {
        return await toppingGroup.findOne({ _id: new Types.ObjectId(id) }).lean()
    }

    static createToppingGroup = async ({ tpGroupName, tpShopId }) => {
        const foundPartner = await findById(tpShopId)
        if (!foundPartner) throw new NotFoundError(`Không tìm thấy Partner với ${tpShopId}`)

        return await toppingGroup.create({ tpGroupName, tpShopId })

    }

    static getAllByShop = async ({ tpShopId, limit = 5, skip = 0 }) => {
        const query = { tpShopId: new Types.ObjectId(tpShopId) }
        return await findAllByShopId({ query, limit, skip })
    }

    static getAllByShopV2 = async ({ tpShopId, limit = 5, page = 1 }) => {
        const filter = { tpShopId: new Types.ObjectId(tpShopId) }
        return await findAllByShopIdV2({ filter, limit, page, select: ["_id", "tpGroupName", "toppings"] })
    }


}

module.exports = ToppingGroupService