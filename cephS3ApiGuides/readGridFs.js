const mongo = require('mongodb');
const Grid = require('gridfs-stream');

const db = new mongo.Db('hbe-v2-fs', new mongo.Server("127.0.0.1", 27017));

db.open(function (err) {
	if (err) return console.log(err);
	const gfs = Grid(db, mongo);
	gfs.files.find({ }).toArray(function (err, files) {
		if (err)  return console.log(err);
		console.log(files);
		const fileId = files[0]._id.toString();
		const readStream = gfs.createReadStream({
			_id: fileId
		});
		readStream.on('data', (data) => {
			console.log('data', data);
		});
		readStream.on('close', () => {
			console.log('close...');
		});
	});
});