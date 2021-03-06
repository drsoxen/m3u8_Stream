var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cons = require('consolidate'),
    dust = require('dustjs-helpers'),
    child_process = require('child_process'),
    ffmpegInstaller = require('@ffmpeg-installer/ffmpeg'),
    ffmpeg = require('fluent-ffmpeg'),
    ffmpegInstance = ffmpeg(),
    app = express(),
    fs = require('fs'),
    isLive = false,
    currentLength = 'short',
    currentType = 'vod',
    currentDirectoy = './public/media/' + currentType + '/' + currentLength


ffmpeg.setFfmpegPath(ffmpegInstaller.path);
module.exports = ffmpeg;

app.engine('dust', cons.dust);
app.set('view engine', 'dust');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

var HLSServer = require('hls-server')
var http = require('http')
 
var server = http.createServer()
var hls = new HLSServer(server, {
  path: '/',     // Base URI to output HLS streams
  dir: currentDirectoy  // Directory that input files are stored
})
server.listen(8000)

app.get('/', function (req, res) {
  res.render('index');
});

//slow the livestream down https://www.ffmpeg.org/ffmpeg-formats.html#toc-Options-5
app.get('/startStream', function (req, res) {

  fs.readdir(currentDirectoy, (err, files) => {
  if (err) throw err;

  for (const file of files) {
    fs.unlink(path.join(currentDirectoy, file), err => {
      if (err) throw err;
    });
  }
});

  console.log('live stream has started')

  ffmpegInstance = ffmpeg('./public/media/Sample_' + currentLength + '.mp4', { timeout: 432000 }).addOptions([
    '-profile:v baseline', // baseline profile (level 3.0) for H264 video codec
    '-level 3.0', 
    '-s 640x360',          // 640px width, 360px height output video dimensions
    '-start_number 0',     // start the first .ts segment at index 0
    '-hls_time 2',         // 2 second segment duration
    '-hls_list_size 0',    // Maxmimum number of playlist entries (0 means all entries/infinite)
    '-f hls'               // HLS format
  ]).output('./public/media/' + currentType + '/' + currentLength + '/index.m3u8').on('end', function() {console.log('live stream has completed')}).run()
    
    res.end();
});

app.get('/changeType', function (req, res) {
	currentType = req.query.type
  console.log(currentType)
  res.end();
});

app.get('/changeLength', function (req, res) {
	currentLength = req.query.length
	console.log(currentLength)

  res.end();
});

app.get('/stopStream', function (req, res) {
  
  //ffmpegInstance.on('error', function() { console.log('Ffmpeg has been killed'); });

  //ffmpegInstance.kill(); //https://github.com/fluent-ffmpeg/node-fluent-ffmpeg#killsignalsigkill-kill-any-running-ffmpeg-process
  fs.appendFile('./public/media/'  + currentType + '/' + currentLength + '/index.m3u8', '#EXT-X-ENDLIST', function (err) {});

    res.end();
});

app.get('/stopMediaServer', function (req, res) {
    
  nms.stop();
  res.end();
});

app.listen(3000, function () {
  console.log('Server Started On Port 3000');

});
