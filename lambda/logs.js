const AWS = require('aws-sdk');
const zlib = require('zlib');
const fs = require('fs');

AWS.config.update({ region: 'ap-southeast-1' });
const s3 = new AWS.S3();

exports.handler = (input, context) => {

    var payload = Buffer.from(input.awslogs.data, 'base64');
    zlib.gunzip(payload, function (e, result) {
        if (e) {
            context.fail(e);
        } else {
            result = JSON.parse(result.toString('ascii'));
            console.log('Event Data:', JSON.stringify(result, null, 2));
            console.log(result.logEvents[0].message);

            const buf = Buffer.from(JSON.stringify(result));
            // Setting up S3 upload parameters
            const params = {
                Bucket: process.env.BUCKET_NAME,
                Key: 'logs_'+ Date.now() +'.json', // File name you want to save as in S3
                Body: buf
            };

            // Uploading files to the bucket
            s3.putObject(params, (err, data) => {
                if (err)
                    console.log(err, err.stack);
                else {
                    console.log('Upload success');
                    context.succeed(); 
                }
            });

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

        }
    });
};