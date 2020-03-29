const AWS = require('aws-sdk-mock');
const app = require('../app.js');

AWS.mock("S3", "listObjectsV2", (params) => "")

test('test example function', () => {
    expect(app.example(2)).toBe(3);
})

test('Mock listing directories & files in S3 bucket', () => {
    
})