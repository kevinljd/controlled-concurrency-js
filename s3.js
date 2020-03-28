const AWS = require('aws-sdk');
const config = require('./config.json');


AWS.config.setPromisesDependency();
AWS.config.update({
    accessKeyId: config.aws.accessKey,
    secretAccessKey: config.aws.secret,
    region: 'ap-southeast-2'
});

module.exports = new AWS.S3();