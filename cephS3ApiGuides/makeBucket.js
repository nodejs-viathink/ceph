const Minio = require('minio')

const minioClient = new Minio.Client({
	endPoint: '172.16.114.133',
	port: 7480,
	secure: false,
	accessKey: '2B2F8CAWWJ79MMRJ6E2H',
	secretKey: 'JwXE43NfAVuNVqzvssalBMBWQH45wpZfGnllzinQ'
});

minioClient.makeBucket('my-bucket-1', 'us-east-1', function(err) {
	if (err) return console.log(err);
	console.log('Bucket created successfully in "us-east-1".');
});