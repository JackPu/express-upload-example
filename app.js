var chalk = require('chalk')
var cors = require('cors')
var express = require('express')
var fileUpload = require('express-fileupload')

var path = require('path')

var app = express()

var whitelist = ['http://localhost:8090', 'http://localhost:4000', 'http://vanthink-ued.github.io']
var corsOptions = {
  origin: function (origin, callback) {
    console.log(origin)
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}

// enable cros
// app.use(cors(corsOptions))

// default options
app.use(fileUpload())
app.use(express.static('images'))

app.post('/upload', cors(corsOptions), function (req, res) {
  if (!req.files) {
    console.log('no files')
    return res.json({
      error: 1001,
      message: 'not found files'
    })
  }

  // The name of the input field (i.e. "files" <input name="files" />) is used to retrieve the uploaded file
  var sampleFile = req.files.files
  var size = sampleFile.data.length
  if (size > 4 * 1024 * 1024) {
    return res.json({
      error: 1002,
      message: 'file is two larger (< 2M)'
    })
  }

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(path.join(__dirname, 'images', sampleFile.name), function (err) {
    if (err) {
      return res.status(500).send(err)
    }
    return res.json({
      errcode: 0,
      data: {
        src: 'http://' + req.headers.host + '/' + sampleFile.name,
        name: sampleFile.name,
        size: size
      },
      message: ''
    })
  })
})

app.listen(8090, function () {
  console.log('Example app listening on port 8090!')
  console.log('Now you could upload file to  ' + chalk.green('http://localhost:8090/upload'))
})
