import AWS from 'aws-sdk';
import config from './config.js';

const key = config.aws.accessKey;
const secret = config.aws.secret;


AWS.config.setPromisesDependency();
AWS.config.update({
    accessKeyId: config.aws.accessKey,
    secretAccessKey: config.aws.secret,
    region: 'ap-southeast-2'
})


var s3 = new AWS.S3();







var params = {
    Bucket: 'STRING_VALUE', /* required */
    ContinuationToken: 'STRING_VALUE',
    Delimiter: 'STRING_VALUE',
    EncodingType: url,
    FetchOwner: true || false,
    MaxKeys: 'NUMBER_VALUE',
    Prefix: 'STRING_VALUE',
    RequestPayer: requester,
    StartAfter: 'STRING_VALUE'
};

AWS.S3.listObjectsV2(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
});