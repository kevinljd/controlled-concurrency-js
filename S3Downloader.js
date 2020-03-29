const Promise = require('bluebird');
const fs = require('fs');
const mkdir = Promise.promisify(fs.mkdir);
const writeFile = Promise.promisify(fs.writeFile);



function getFilesListFromS3(s3, bucket) {
    return async function getFilesList() {
        try {
            const response = await s3.listObjectsV2({
                Bucket: bucket,
            }).promise();
            // console.log(response);
            return response;
        } catch (e) {
            console.log('Error', e);
        }
    };
}

function getAllWithPrefix(downloadsPrefix) {
    return function(response) {
        let files = [];
        let folders = [];

        let folderPattern = new RegExp('/$');

        for (var item of response.Contents) {
            if (item.Key.match(folderPattern)) {
                var folder = `${downloadsPrefix}${item.Key}`;
                if (!fs.existsSync(folder)) {
                    folders.push(folder);
                }
                continue;
            }
            files.push(item.Key);
        }
        return {files: files, folders: folders};
    }
}

function createDirs(folders) {
    // console.log(folders)
    return Promise.map(folders, folder => {
        return mkdir(folder);
    });
}


function createFileWithPrefix(downloadsPrefix) {
    return (key, data) => {
        var buf = new Buffer(data, 'base64');
        var path = `${downloadsPrefix}${key}`;
        return writeFile(path, buf);
    }
}

function downloadObjectFromS3(s3, bucket, downloadsPrefix) {
    return function downloadObject(key) {
        var params = {
            Bucket: bucket,
            Key: key
        };
    
        return s3.getObject(params).promise().then(data => {
            var createFile = createFileWithPrefix(downloadsPrefix);
            createFile(key, data.Body);
            return {key: key, data: data};
        });
    }
}



function downloadFilesFromS3(s3, bucket, downloadsPrefix, keys) {
    var downloadObject = downloadObjectFromS3(s3, bucket, downloadsPrefix);
    return Promise.map(keys, downloadObject, {concurrency: 4});
}


module.exports = {
    getFilesListFromS3: getFilesListFromS3,
    getAllWithPrefix: getAllWithPrefix,
    createDirs: createDirs,
    createFileWithPrefix: createFileWithPrefix,
    downloadObjectFromS3: downloadObjectFromS3,
    downloadFilesFromS3: downloadFilesFromS3,
}