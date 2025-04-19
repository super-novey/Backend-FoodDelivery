const toppingModel = require("../models/Topping")
const ToppingGroupService = require("./toppingGroup.service")
const { NotFoundError } = require("../core/error.response")
const { getSelectData } = require("../utils")

class ToppingService {

    /*
        tpName: { type: String, required: true },
        tpPrice: { type: Number, default: 0 },
        tpImage: { type: String, default: "" },
        isActive: { type: Boolean, default: true },
        tpGroupId: { type: Types.ObjectId, ref: "ToppingGroup" },
    
    */

    static createTopping = async ({ tpName, tpPrice, tpImage, isActive = false, tpGroupId }) => {
        const foundTpGroup = await ToppingGroupService.findById(tpGroupId)

        if (!foundTpGroup) throw new NotFoundError(`Không tìm thấy nhóm Topping ${tpGroupId}`)

        return await toppingModel.create({ tpName, tpPrice, tpImage, isActive, tpGroupId })
    }

    static createToppingV2 = async ({ tpName, tpPrice, tpImage, isActive = false, tpGroupId }) => {
        const foundTpGroup = await ToppingGroupService.findById(tpGroupId)

        if (!foundTpGroup) throw new NotFoundError(`Không tìm thấy nhóm Topping ${tpGroupId}`)

        const filter = { tpName, tpGroupId };

        const update = {
            tpName,
            tpPrice,
            tpImage,
            isActive,
            tpGroupId
        }, options = {
            upsert: true,
            new: true,
        };

        return await toppingModel.findOneAndUpdate(filter, update, options);
    }
}

module.exports = ToppingService