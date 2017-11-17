const Minio = require('minio');

const s3Client = new Minio.Client({
	endPoint: '172.16.114.133',
	port: 7480,
	secure: false,
	accessKey: '2B2F8CAWWJ79MMRJ6E2H',
	secretKey: 'JwXE43NfAVuNVqzvssalBMBWQH45wpZfGnllzinQ'
});

const objectsStream = s3Client.listObjects('my-bucket-1', '', true);
objectsStream.on('data', function(obj) {
	console.log(obj)
});
objectsStream.on('error', function(e) {
	console.log(e)
});
