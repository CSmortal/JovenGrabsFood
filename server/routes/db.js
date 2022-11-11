const express = require("express")
const router = express.Router()
const db = require("../database/db")

router.post("/food-item", async (req, res) => {
  try {
    /* req.body.sections will be an array of sections, a section object looks like {id: __, section_name: __, options: [{str, pr}, {str, pr}, {str, pr}]}*/
    const { merchantName, imageUrl, itemSections, itemPrice, itemName, itemCategory } = req.body

    const merchantId = await db.query("SELECT user_id FROM Users WHERE user_name = $1", [merchantName])
      .then(res => res.rows[0].user_id)

    const itemId = await db.query("INSERT INTO FoodItem VALUES(DEFAULT, $1, $2, $3, $4, $5) RETURNING item_id",
        [merchantId, itemPrice, itemName, imageUrl, itemCategory])
            .then(res => res.rows[0].item_id)

    
    itemSections.forEach(async (section) => {
      section.options.forEach(async (sectionOption) => {
        // sectionOption looks like {description: ___, priceChange: ___}
        await db.query("INSERT INTO FoodItemSections VALUES($1, $2, $3, $4)",
          [itemId, section.section_name, sectionOption.description, sectionOption.priceChange])
      })
    });

    res.json("Successfully inserted food item into db")

  } catch (error) {
    res.status(500).json("Failed to insert food item into db")
    console.error(error.message)
  }
})

router.get("/food-categories", async (req, res) => {
  try {
    let categories = await db.query("SELECT category_description as category FROM FoodCategory")
      .then(res => res.rows)
    categories = categories.map(categoryAsObj => categoryAsObj.category)

    res.json(categories)
  } catch (error) {
    res.status(500).json("Failed to retrieve food items from db")
    console.error(error.message)
  }
})

router.get("/merchants-by-category/:category", async (req, res) => {
  try {
    const category = req.params.category

    // we will retrieve the images for each merchant too ltr, since we dont want to incur AWS GET requests unnecessarily. We shud use Redis for this
    const userNames = await db.query("SELECT DISTINCT user_name, user_address FROM Users natural join FoodItem WHERE item_category = $1", [category])
        .then(res => res.rows)
        
    const response = userNames.map(userNameObj => {
      return {
        merchantName: userNameObj.user_name,
        merchantAddress: userNameObj.user_address
      }
    })

    res.json(response)

  } catch (error) {
    res.status(500).json("Failed to retrieve merchants from db")
    console.error(error.message)
  }
})

router.get("/all-merchant-items/:merchantName", async (req, res) => {
  try {
    const merchantName = req.params.merchantName

    const response = await db.query("SELECT item_id, item_price, item_name, item_image_url, item_category FROM Users natural join FoodItem "
        + "WHERE user_name = $1", [merchantName]).then(res => res.rows)

    res.json(response)

  } catch (error) {
    res.status(500).json("Failed to retrieve merchants' items from db")
    console.error(error.message)
  }
})

router.get("/itemDetails/:itemId", async (req, res) => {
  try {
    const itemId = req.params.itemId
    
    const basicDetails = await db.query("SELECT user_name, item_price, item_name, item_image_url FROM FoodItem natural join Users WHERE item_id = $1",
            [itemId]).then(res => res.rows[0]) // single object
    const sectionDetails = await db.query("SELECT item_section_name, option_description, option_price_change FROM FoodItemSections " +
            "WHERE item_id = $1", [itemId]).then(res => res.rows) // array of object(s)

    const response = { basicDetails, sectionDetails }

    res.json(response)

  } catch (error) {
    res.status(500).json("Failed to retrieve details of selected item from db")
    console.error(error.message)
  }
})

module.exports = router