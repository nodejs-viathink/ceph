const Minio = require('minio');
const mongo = require('mongodb');
const Grid = require('gridfs-stream');
const fs = require('fs');



const getGridFsFile = (callback) => {
	const db = new mongo.Db('hbe-v2-fs', new mongo.Server("127.0.0.1", 27017));

	db.open(function (err) {
		if (err) return callback(err, null);
		const gfs = Grid(db, mongo);
		gfs.files.find({}).toArray((err, files) => {
			if (err)  return callback(err, null);
			const fileId = files[0]._id.toString();
			const filename = files[0].filename;
			const mimeType = 'binary/octet-stream';
			const readStream = gfs.createReadStream({
				_id: fileId
			});
			callback(null, {
				fileId,
				filename,
				mimeType,
				readStream
			});
		});
	});
};



const putObjectToS3 = (filename, mimeType, readStream, callback) => {
	const s3Client = new Minio.Client({
		endPoint: '172.16.114.133',
		port: 7480,
		secure: false,
		accessKey: '2B2F8CAWWJ79MMRJ6E2H',
		secretKey: 'JwXE43NfAVuNVqzvssalBMBWQH45wpZfGnllzinQ'
	});

	s3Client.putObject('my-bucket-1', filename, readStream, mimeType,(err, etag) => {
		if (err) {
			return callback(err, null);
		}
		callback(null, {
			bucket: 'my-bucket-1',
			etag
		});
	});
};

getGridFsFile((err, fileObj) => {
	if (err) {
		return console.log('getGridFsFile error: ', err);
	}
	putObjectToS3(fileObj.filename, fileObj.mimeType, fileObj.readStream, (err, obj) => {
		if (err) {
			return console.log('putObjectToS3 error: ', err);
		}
		console.log('putObjectToS3 success obj: ', obj);
		// 将匹配规则写入json
		const listJsonArr = [{
			filename: fileObj.filename,
			bucket: obj.bucket,
			_id: fileObj.fileId
		}];
		fs.writeFileSync('list.json', JSON.stringify(listJsonArr));
		console.log('all success...');
	});
});