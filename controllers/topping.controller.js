const ToppingService = require("../services/topping.service")
const { SuccessResponse, PAGINATED } = require("../core/success.response")

class ToppingController {
    createTopping = async (req, res, next) => {
        new SuccessResponse(
            {
                message: "Lưu Topping thành công!",
                data: await ToppingService.createToppingV2(req.body)
            }
        ).send(res)
    }
}

module.exports = new ToppingController()