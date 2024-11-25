const fileUploader = require("../config/cloudinary.config");

const ItemController = require("../controllers/ItemController");
const router = require("./AuthRoutes");

router.post(
  "/",
  fileUploader.fields([{ name: "itemImage", maxCount: 1 }]),
  ItemController.addItemToCategory
);

router.get("/:itemId", ItemController.getItemById);
router.get("/category/:categoryId", ItemController.getItemsByCategory);
router.delete("/:id", ItemController.deleteItem);

module.exports = router;
