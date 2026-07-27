// services/storage.service.ts

import {
  PutObjectCommand,
  DeleteObjectCommand,
} from"@aws-sdk/client-s3"

import { randomUUID } from 'crypto'
import { r2 } from '../config/r2.js'



const bucket = process.env.R2_BUCKET!

export class StorageService {
  static async upload(file: Express.Multer.File) {
    const extension = file.originalname.split('.').pop()

    const key = `${randomUUID()}.${extension}`

    const result = await r2.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    )

    console.log(result)
console.log(key)
    return {
      key,
      url: `${process.env.R2_PUBLIC_URL}/${key}`,
    }
  }

  static async delete(key: string) {
    await r2.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    )
  }
}