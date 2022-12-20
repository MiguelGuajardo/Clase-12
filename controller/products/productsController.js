const createFakeProducts = require("../../utils/products-test-utils")
const getProductsTest = async (req, res) => {
    try {
        const products = createFakeProducts(5)
        await res.send({ success: true, data: products })

    } catch (error) {
        console.log(error, `error from getProductsTest`);
        res.send({ success: false, data: undefined, message: error})
    }
}

module.exports = {getProductsTest}