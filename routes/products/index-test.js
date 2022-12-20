const { Router } = require("express");
const productController = require("../../controller/products/productsController")
const router = Router()

router.get("/",productController.getProductsTest)

module.exports = router 