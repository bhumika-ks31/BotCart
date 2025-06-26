import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Setup Cloudinary config
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async (filePath) => {
  try {
    if (!filePath) return null

    const uploadResult = await cloudinary.uploader.upload(filePath, {
      resource_type: 'image'
    })

    // Delete the temp file
    fs.unlinkSync(filePath)

    return uploadResult.secure_url

  } catch (error) {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath) // Clean up file if error happens
    }
    console.error("Cloudinary Upload Error →", error)
    return null
  }
}

export default uploadOnCloudinary
