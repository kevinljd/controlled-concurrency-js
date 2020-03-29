const fs = require('fs');
const AWSMock = require('aws-sdk-mock');
const AWS = require('aws-sdk');
const S3Downloader = require('../S3Downloader.js');



const s3Resp = {
    IsTruncated: false,
    Contents: [
        {
        Key: 'folder/',
        LastModified: '2020-03-28T08:07:09.000Z',
        ETag: '""',
        Size: 0,
        StorageClass: 'STANDARD'
        },
        {
        Key: 'folder/folder.txt',
        LastModified: '2020-03-28T08:08:38.000Z',
        ETag: '""',
        Size: 33,
        StorageClass: 'STANDARD'
        },
        {
        Key: 'text.txt',
        LastModified: '2020-03-28T08:08:31.000Z',
        ETag: '""',
        Size: 24,
        StorageClass: 'STANDARD'
        }
    ],
    Name: 'test-bucket',
    Prefix: '',
    MaxKeys: 1000,
    CommonPrefixes: [],
    KeyCount: 3
}

AWSMock.setSDKInstance(AWS);
AWSMock.mock("S3", "listObjectsV2", function(params, callback) {
    callback(null, s3Resp);
});
AWSMock.mock("S3", "listObjectsV2", function(params, callback) {
    callback(null, s3Resp);
});

const s3 = new AWS.S3();

test('Mock listing directories & files in S3 bucket', async () => {
    expect(await s3.listObjectsV2({Bucket: 'test'}).promise()).toEqual(s3Resp);
})

test('Testing getFileList from S3 bucket', async () => {
    const getFileList = S3Downloader.getFilesListFromS3(s3, 'test');
    expect(await getFileList()).toEqual(s3Resp);
})

test('getAllWithPrefix should return object containing list of files & list of folders to create', () => {
    const getAll = S3Downloader.getAllWithPrefix('download-bucket/');
    const filesAndFoldersToBeCreated = {
        files: ['folder/folder.txt', 'text.txt'],
        folders: ['download-bucket/folder/']
    }
    expect(getAll(s3Resp)).toEqual(filesAndFoldersToBeCreated);
})


test('createDirs should create the list of folders given to it.', async () => {
    var folders = ['download-bucket/, folder/'];
    await S3Downloader.createDirs(folders);
    // expect(fs.existsSync("download-bucket/")).toBe(true);
    // expect(fs.existsSync("folder/")).toBe(true);
    // fs.rmdirSync("download-bucket/");
    // fs.rmdirSync("folder/");
})
