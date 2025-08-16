import { env } from '@/config/config_env'
import AWS from 'aws-sdk'
import { Buffer } from 'buffer'

AWS.config.update({
    accessKeyId: env.AWS_S3_KEY, 
    secretAccessKey: env.AWS_S3_SECRET,
    region: env.AWS_S3_REGION,
})

const s3 = new AWS.S3()

interface UploadFileResponse {
    Location: string
}

export const s3Service = {
    BUCKET_NAME: env.AWS_S3_BUCKET_NAME,

    uploadFile: async (folder_name: string, file_buffer: Buffer, file_name: string, mime_type: string) => {
        const final_file_name = `${Date.now()}-${file_name}`
        const params: AWS.S3.PutObjectRequest = {
            Bucket: s3Service.BUCKET_NAME,
            Key: `${folder_name}/${final_file_name}`,
            Body: file_buffer,
            ContentType: mime_type,
        }
    
        try {
            const data: UploadFileResponse = await s3.upload(params).promise()
            return {
                url: data.Location,
                file_name: final_file_name
            }
        } catch (error) {
            console.log(error)
            return null
        }
    },
    
    deleteFile: async (folder_name: string, file_name: string) => {
        /**
         * Eliminar un archivo de S3
         * @param folder_name - Nombre del la carpeta en donde se encuentra el archivo
         * @param file_name - Nombre del archivo a eliminar (clave en el bucket)
         * @returns `true` si la eliminación fue exitosa `null` si dio error
         */
        const params: AWS.S3.DeleteObjectRequest = {
            Bucket: s3Service.BUCKET_NAME,
            Key: `${folder_name}/${file_name}`,
        }
    
        try {
            await s3.deleteObject(params).promise()
            return true
        } catch (error) {
            return null
        }
    }
}