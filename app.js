const chalk = require('chalk')
const express = require('express')
const fileUpload = require('express-fileupload')
const path = require('path')

const app = express()

// default options
app.use(fileUpload())
app.use(express.static('images'))

app.post('/upload', function (req, res) {
  if (!req.files) {
    console.log('no files')
    return res.json({
      error: 1001,
      message: 'not found files'
    })
  }

  // The name of the input field (i.e. "files" <input name="files" />) is used to retrieve the uploaded file
  const sampleFile = req.files.files
  const size = sampleFile.data.length
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
      error: 0,
      data: {
        url: req.headers.host + '/' + sampleFile.name,
        name: sampleFile.name,
        size: size
      },
      message: 'file is two larger (< 2M)'
    })
  })
})

app.listen(8090, function () {
  console.log('Example app listening on port 8090!')
  console.log('Now you could upload file to  ' + chalk.green('http://localhost:8090/upload'))
})
