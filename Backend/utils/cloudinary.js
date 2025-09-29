import {v1 as cloudinary} from 'cloudinary'
import dotenv from 'dotenv'
dotenv.config({})
cloudinary.config({
    cloud_name:import.meta.env.CLOUD_NAME,
    api_key:import.meta.env.API_KEY, 
    api_secret:import.meta.env.API_SECRET
})
export default cloudinary