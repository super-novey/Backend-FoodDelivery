const { OK, CREATED, SuccessResponse } = require("../core/success.response")
const ProductService = require("../services/product.service")

class ProductController {
    create = async (req, res, next) => {
        new SuccessResponse({
            message: "Tạo sản phẩm thành công",
            data: await ProductService.createProduct(req.body)
        }).send(res)
    }
}

module.exports = new ProductController()