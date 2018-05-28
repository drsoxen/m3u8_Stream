var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cons = require('consolidate'),
    dust = require('dustjs-helpers'),
    child_process = require('child_process'),
    ffmpeg = require('fluent-ffmpeg')
    app = express();
    const NodeMediaServer = require('node-media-server');

    const fs = require('fs');


var isLive = false
currentFile = 'long'
var currentDirectoy = './public/media/live/' + currentFile 

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

function callback() { }

app.get('/startStream', function (req, res) {

  ffmpeg('./public/media/Sample_' + currentFile + '.mp4', { timeout: 432000 }).addOptions([
    '-profile:v baseline', // baseline profile (level 3.0) for H264 video codec
    '-level 3.0', 
    '-s 640x360',          // 640px width, 360px height output video dimensions
    '-start_number 0',     // start the first .ts segment at index 0
    '-hls_time 10',        // 10 second segment duration
    '-hls_list_size 0',    // Maxmimum number of playlist entries (0 means all entries/infinite)
    '-f hls'               // HLS format
  ]).output('./public/media/vod/' + currentFile + '/index.m3u8').on('end', callback).run()
    
    res.end();
});

app.get('/stopStream', function (req, res) {
  

// fs.appendFile('./public/media/live/localStream/index.m3u8', '#EXT-X-ENDLIST', function (err) {
//   if (err) throw err;
//   console.log('Saved!');
// });

    res.end();
});

app.get('/stopMediaServer', function (req, res) {
    
  nms.stop();
  res.end();
});

app.listen(3000, function () {
  console.log('Server Started On Port 3000');

});

//const config = {
//   rtmp: {
//     port: 1935,
//     chunk_size: 60000,
//     gop_cache: true,
//     ping: 60,
//     ping_timeout: 30
//   },
//   http: {
//     port: 8000,
//     mediaroot: './public/media',
//     allow_origin: '*'
//   },
//   trans: {
//     ffmpeg: '/usr/local/bin/ffmpeg',
//     tasks: [
//       {
//         app: 'live',
//         ac: 'aac',
//         mp4: true,
//         mp4Flags: '[movflags=faststart]',
//         hls: true,
//         hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]'
//       }
//     ]
//   }
// };

// var nms = new NodeMediaServer(config)
