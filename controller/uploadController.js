const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // uploads folder

exports.uploadFile = upload.single('file'); // for a single file upload

// Add this to a route
app.post('/api/student/upload', uploadFile, (req, res) => {
  res.json({ message: 'File uploaded successfully', file: req.file });
});
