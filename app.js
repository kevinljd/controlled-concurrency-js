// const Promise = require('bluebird');
const fs = require('fs');
// const mkdir = Promise.promisify(fs.mkdir);
// const writeFile = Promise.promisify(fs.writeFile);
const S3Downloader = require('./S3Downloader.js');
const s3 = require('./aws.js');

const bucket = 'test-bucket-2020-kevin';
const downloadsPrefix = 'download-bucket/';

const getFilesList = S3Downloader.getFilesListFromS3(s3, bucket, downloadsPrefix);
const getAll = S3Downloader.getAllWithPrefix(downloadsPrefix);

function main() {
    
    if (!fs.existsSync(downloadsPrefix)) {
        fs.mkdirSync(downloadsPrefix);
    }
    
    getFilesList().then(getAll).then(async (resp) => {
        var files = resp.files;
        var folders = resp.folders;

        await S3Downloader.createDirs(folders);
        var allFiles = await S3Downloader.downloadFilesFromS3(s3, bucket, downloadsPrefix, files);
        return allFiles;
    }
    ).then(files => {
        console.log(files);
    });
}

main();