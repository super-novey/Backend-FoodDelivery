const express = require("express");
const router = express.Router();
const fileUploader = require("../config/cloudinary.config");
const ItemController = require("../controllers/ItemController");
const OrderController = require("../controllers/OrderController");

router.post(
  "/",
  fileUploader.fields([{ name: "itemImage", maxCount: 1 }]),
  ItemController.addItemToCategory
);
router.put(
  "/:itemId",
  fileUploader.fields([{ name: "itemImage", maxCount: 1 }]),
  ItemController.updateItemInCategory
);

router.get("/:itemId", ItemController.getItemById);
router.get("/category/:categoryId", ItemController.getItemsByCategory);
router.put("/delete/:id", ItemController.deleteItem);
router.get("/customer/search", ItemController.searchItemsByName);
router.get(
  "/customer/category/:categoryId",
  ItemController.getItemsByCategoryInCustomer
);
router.get("/customer/home", ItemController.getItemByCategoryInHome);

router.patch("/:id/quantity", ItemController.decreaseQuantity);
router.patch("/:id/sales", ItemController.increaseSales);

router.get("/rating/:itemId", OrderController.getAllRatingByItem);
router.get("/customer/topItem", ItemController.getTopItem);
router.post("/add/favorite", ItemController.addFavorite);
router.delete("/favorite/:userId/:itemId", ItemController.removeFavorite);
router.get("/favorite/:userId", ItemController.getFavoriteList);
module.exports = router;
