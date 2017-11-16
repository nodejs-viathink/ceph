const Minio = require('minio');

const s3Client = new Minio.Client({
	endPoint: '172.16.114.133',
	port: 7480,
	secure: false,
	accessKey: '2B2F8CAWWJ79MMRJ6E2H',
	secretKey: 'JwXE43NfAVuNVqzvssalBMBWQH45wpZfGnllzinQ'
});

let size = 0;
s3Client.getObject('my-bucket-1', 'package.json', (err, dataStream) => {
	if (err) {
		return console.log(err)
	}
	dataStream.on('data', function(chunk) {
		size += chunk.length;
		console.log(chunk.toString());
	});
	dataStream.on('end', function() {
		console.log('End. Total size = ' + size)
	});
	dataStream.on('error', function(err) {
		console.log(err)
	})
});