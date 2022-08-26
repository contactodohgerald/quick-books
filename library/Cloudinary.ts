import dotevn from 'dotenv';
import { v2 as cloudinary } from 'cloudinary'

dotevn.config();

const CLOUDINARY_NAME = process.env.CLOUDINARY_CLOUD_NAME || '';
const CLOUDINARY_KEY = process.env.CLOUDINARY_API_KEY || '';
const CLOUDINARY_SECRET = process.env.CLOUDINARY_API_SECRET || '';

cloudinary.config({ 
    cloud_name: CLOUDINARY_NAME,
    api_key: CLOUDINARY_KEY,
    api_secret: CLOUDINARY_SECRET,
    secure: false
});

export const uploadImage = async (file: any) => {
    try {
        let result;
        if(file === undefined || file === null || file === ''){
            result = {url: '', secure_url: ''}
        }else{
            result = await cloudinary.uploader.upload(file, {
                folder: 'quickbooks',
                use_filename: false,
                unique_filename: false,
                overwrite: true
            });
        }
        return result.secure_url;
    } catch (error: any) {
        return error.message;
    }
}
