const express = require("express")
const router = express.Router()
const db = require("../database/db")

router.post("/insert-food-item", async (req, res) => {
  try {
    /* req.body.sections will be an array of sections, a section object looks like {id: __, section_name: __, options: [{str, pr}, {str, pr}, {str, pr}]}*/
    const { merchantName, imageUrl, itemSections, itemPrice, itemName } = req.body

    const merchantId = await db.query("SELECT user_id FROM Users WHERE user_name = $1", [merchantName])
      .then(res => res.rows[0].user_id)

    const itemId = await db.query("INSERT INTO FoodItem VALUES(DEFAULT, $1, $2, $3, $4) RETURNING item_id",
        [merchantId, itemPrice, itemName, imageUrl])
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

router.get("/retrieve", async (req, res) => {
  
})

module.exports = router