const Minio = require('minio');
const mime = require('mime');
const fs = require('fs');

const s3Client = new Minio.Client({
	endPoint: '172.16.114.133',
	port: 7480,
	secure: false,
	accessKey: '2B2F8CAWWJ79MMRJ6E2H',
	secretKey: 'JwXE43NfAVuNVqzvssalBMBWQH45wpZfGnllzinQ'
});
const file = `${__dirname}/package.json`;
const fileStream = fs.createReadStream(file);
//c813961a0533c3191f80a0e1124a03ec
s3Client.putObject('my-bucket-1', 'package.json', fileStream, mime.getType('json'),function(err, etag) {
	return console.log(err, etag); // err should be null
});