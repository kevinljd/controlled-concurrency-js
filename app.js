const Promise = require('bluebird');
const fs = require('fs');
const mkdir = Promise.promisify(fs.mkdir);
const writeFile = Promise.promisify(fs.writeFile);

const s3 = require('./s3.js');

const bucket = 'test-bucket-2020-kevin';
const downloadsPrefix = 'download-bucket/';

async function getFilesList() {
    try {
        const response = await s3.listObjectsV2({
            Bucket: bucket,
        }).promise();
        return response;
    } catch (e) {
        console.log('our error', e);
    }

}

function getAll(response) {
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

function createDirs(folders) {
    // console.log(folders)
    return Promise.map(folders, folder => {
        return mkdir(folder);
    });
}

function createFile(key, data) {
    var buf = new Buffer(data, 'base64');
    var path = `${downloadsPrefix}${key}`;
    return writeFile(path, buf);
}

function downloadObject(key) {
    var params = {
        Bucket: bucket,
        Key: key
    };

    return s3.getObject(params).promise().then(data => {
        createFile(key, data.Body);
        return {key: key, data: data};
    });
    // ;
    // var resp = {
    //     key: key,
    //     data: data
    // };
    // return resp;
}

function downloadFiles(keys) {
    // var paramsList = [];
    // for (var key of keys) {
    //     var params = {
    //         Bucket: bucket,
    //         Key: key
    //     };
    //     paramsList.push(params);
    // }
    return Promise.map(keys, downloadObject, {concurrency: 4});
}



if (!fs.existsSync(downloadsPrefix)) {
    fs.mkdirSync(downloadsPrefix);
}

getFilesList().then(getAll).then(async (resp) => {
    var files = resp.files;
    var folders = resp.folders;


    await createDirs(folders);
    var allFiles = await downloadFiles(files);
    return allFiles;
}
).then(files => {
    console.log(files);
});








// var params = {
//     Bucket: 'STRING_VALUE', /* required */
//     ContinuationToken: 'STRING_VALUE',
//     Delimiter: 'STRING_VALUE',
//     EncodingType: url,
//     FetchOwner: true || false,
//     MaxKeys: 'NUMBER_VALUE',
//     Prefix: 'STRING_VALUE',
//     RequestPayer: requester,
//     StartAfter: 'STRING_VALUE'
// };

// AWS.S3.listObjectsV2(params, function(err, data) {
//     if (err) console.log(err, err.stack); // an error occurred
//     else     console.log(data);           // successful response
// });