var aws = require('aws-sdk'); 
require('dotenv').config(); // Configure dotenv to load in the .env file

const bookService = require('../services/book.service');
const fileService = require('../services/file.service')

// Configure aws with your accessKeyId and your secretAccessKey
aws.config.update({
  region: 'us-east-1', // Put your aws region here
  accessKeyId: "AKIAUWJTDERI7RAZX6O5",
  secretAccessKey: "edAgBec91D8o0LCpuHkqHXtjBtZfofCVftUbuixk",
  signatureVersion:"v4"
})

const S3_BUCKET = process.env.S3_BUCKET_NAME

// Create and Save a new Book
exports.uploadImageToS3 = (req, res) => {

        const s3 = new aws.S3();  // Create a new instance of S3
        const fileName = req.body.fileName;
        const fileType = req.body.fileType;

        // Set up the payload of what we are sending to the S3 api
        const s3Params = {
            Bucket: S3_BUCKET,
            Key: "book-"+req.body.bookId+"-"+req.body.fileName,
            Expires: 500,
            ContentType: fileType,
            ACL: 'public-read'
        };

        // Make a request to the S3 API to get a signed URL which we can use to upload our file
        s3.getSignedUrl('putObject', s3Params, (err, data) => {
            if(err){
            console.log(err);
            res.json({success: false, error: err})
            }
            else {
                // Data payload of what we are sending back, the url of the signedRequest and a URL where we can access the content after its saved. 
                const returnData = {
                    signedRequest: data,
                    url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
                };
                // Send it all back
                res.json({success:true, data:{returnData}});
            }
        });
};

exports.getImages = (req, res) => {
    let listOfSources = []
    let listOfImageNames = []
    let imageCount = 0
    fileService.get(req, res).then(images => {
        if(images !== undefined) {
            images.forEach(image => {
                const s3Client = new aws.S3({
                    accessKeyId:"AKIAUWJTDERI7RAZX6O5",
                    secretAccessKey: "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",
                    region : 'us-east-1',
                    signatureVersion:"v4"
                });
                const params = {
                    Bucket: S3_BUCKET, 
                    Key: 'book-'+req.params.bookId+'-'+image.file_name 
                };
                s3Client.getObject(params, function(error, data) {
                    imageCount++;
                    let attachment = data.Body.toString('base64');
                    listOfSources.push(attachment);
                    listOfImageNames.push(image.file_name)
                    if(imageCount == images.length) {
                        res.json({success:true, data:{listOfSources, listOfImageNames}});
                    }
                })
            });
        }
    })
}

exports.deleteFile=(req,res)=>{
    var s3 = new aws.S3({
        accessKeyId:"AKIAUWJTDERI7RAZX6O5",
        secretAccessKey: "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",
        region : 'us-east-1',
        signatureVersion:"v4"
    });
    var params = {  Bucket: S3_BUCKET, Key: 'book-'+req.params.bookId+'-'+req.params.fileName };
    
    s3.deleteObject(params, function(err, data) {
        if (err) console.log(err, err.stack);  // error
        else{
            fileService.deleteImagefromDB(req)
            .then((data)=>{
                res.status(200);
                res.json({
                    msg:"Image deleted Successfully"
                })
            })
        }
    });
  }

exports.createBookImage = (req, res) => {
    const resolve = () => {
        res.status(200);
        res.json("Successfully uploaded book and Images");
    }

    fileService.save(req)
    .then(resolve)
    .catch(renderErrorResponse(res, 500, "Failed to upload Image"))
}

let renderErrorResponse = (response, code, message) => {
    
    const errorCallback = (error) => {
        console.log(error);
        if (error) {
            response.status(code);
            response.json({
                message: error.message ? error.message : message
            });
        } else {
            response.status(code);
            response.json({
                message: message ? message : ""
            });
        }
    }
    return errorCallback;
  };