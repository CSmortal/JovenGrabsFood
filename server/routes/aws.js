const AWS = require("aws-sdk")
require("dotenv").config()
const express = require('express')
const router = express.Router()
const fs = require('fs')

const multer = require("multer")
const upload = multer({ dest: 'uploads/' })

const s3 = new AWS.S3({
  accessKeyId: process.env.JPZX_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.JPZX_AWS_SECRET_ACCESS_KEY
})

router.post("/insert-food-image", upload.single('imageInput'), async (req, res) => {
  const fileStream = fs.createReadStream(req.file.path)
  // console.log(req.file)
  try {
    const uploadParams = {
      Body: fileStream,
      Bucket: process.env.JPZX_BUCKET_NAME,
      Key: req.file.originalname
    }

    const result = await s3.upload(uploadParams).promise()
    res.json(result)

  } catch (error) {
    console.error(error.message)
  }
})


router.get("/:key", (req, res) => {
  const key = req.params.key
  const getParams = {
    Bucket: process.env.JPZX_BUCKET_NAME,
    Key: key
  }

  const readStream = s3.getObject(getParams).createReadStream()
  return readStream.pipe(res)
})


module.exports = router