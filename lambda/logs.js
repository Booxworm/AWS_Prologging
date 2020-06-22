const AWS = require('aws-sdk');
const zlib = require('zlib');
const fs = require('fs');

AWS.config.update({region: 'ap-southeast-1'});
const s3 = new AWS.S3();

const uploadFile = (fileName) => {
    // Read content from the file
    const fileContent = fs.readFileSync(fileName);

    // Setting up S3 upload parameters
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: 'cat.jpg', // File name you want to save as in S3
        Body: fileContent
    };

    // Uploading files to the bucket
    s3.upload(params, function (err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
    });
};

exports.handler = function (input, context) {
    s3.listBuckets(function (err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success", data.Buckets);
        }
    });

    var payload = Buffer.from(input.awslogs.data, 'base64');
    zlib.gunzip(payload, function (e, result) {
        if (e) {
            context.fail(e);
        } else {
            // uploadFile('../test.txt');

            // s3.listObjects({
            //     Bucket: process.env.BUCKET_NAME,
            //     MaxKeys : 2
            // }, function(err, data) {
            //     console.log('test2');
            //     if (err) {
            //       console.log(err, err.stack);
            //     } else {
            //       console.log(data);
            //     }
            // });

            // result = JSON.parse(result.toString('ascii'));
            // console.log('Event Data:', JSON.stringify(result, null, 2));
            // console.log(result.logEvents[0].message);

            // const params = {
            //     Bucket : process.env.BUCKET_NAME,
            //     Key : 'test.txt', // result.logEvents[0].id,
            //     Body : 'lorum ipsum' // result.logEvents[0].message
            // };
            // s3.putObject(params, (err, data) => {
            //     if (err)
            //         console.log(err, err.stack);
            //     else
            //         console.log(data);
            // });

            context.succeed();
        }
    });
};