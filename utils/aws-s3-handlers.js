require('dotenv').config()
const S3 = require('aws-sdk/clients/s3');
const fs = require('fs');
const path = require('path');

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
    region, 
    accessKeyId,
    secretAccessKey
});

// uploads a file to s3
exports.uploadFile = function (fileName, fileStream) {
    // Binary data base64
    // const { base } = path.parse(newFilePath);
    // const fileName = base;
    // const newFileBuffer = fs.readFileSync(newFilePath);
    // const fileStream  = Buffer.from(newFileBuffer, 'binary');
    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: fileName
    };
    return s3.upload(uploadParams, function(err, data) {
        if (err) {
            console.log('There was an error uploading your file: ', err);
            return false;
          }
          console.log('Successfully uploaded file.', data);
          return true;
    });
}

// downloads a file from s3
exports.getFileStream = async function (fileKey){
    const downloadParams = {
        Key: fileKey,
        Bucket: bucketName
    }
    return new Promise(async function(resolve, reject) {
        try {
            await s3.headObject(downloadParams).promise();
            try {
                const result = s3.getObject(downloadParams).createReadStream()
                if (result)
                    resolve(result);
                else 
                    reject("Cannot get video");
            } catch (err) {
                console.log(err)
                reject(err)
            }
        } catch (err) {
            console.log("File not Found ERROR : " + err.code);
            reject(err);
        }
    });
}

exports.deleteFile = function (fileKey) {
    // fileKey = fileKey + '.webm';
    const deleteParams = {
        Key: fileKey,
        Bucket: bucketName
    }
    return new Promise(async function(resolve, reject) {
        try {
            await s3.headObject(deleteParams).promise();
            try {
                const result = await s3.deleteObject(deleteParams).promise();
                if (result)
                    resolve(result);
                else 
                    reject("Cannot delete video");
            } catch (error) {
                console.log("Cannot delete video, error: ", error);
                reject(error);
            }
        } catch (error) {
            console.log("Cannot find video, error: ", error);
            reject(error);
        }
    });
}