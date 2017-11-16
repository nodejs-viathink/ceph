const Minio = require('minio')

const s3Client = new Minio.Client({
	endPoint: '172.16.114.133',
	port: 7480,
	secure: false,
	accessKey: '2B2F8CAWWJ79MMRJ6E2H',
	secretKey: 'JwXE43NfAVuNVqzvssalBMBWQH45wpZfGnllzinQ'
});

s3Client.listBuckets((e, buckets) => {
	if (e) return console.log(e);
	console.log('buckets :', buckets);
});