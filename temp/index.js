import express from "express"
import cors from "cors"
import multer from "multer"

const port = 3000;
const app = express();
app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

app.post('/api/upload', upload.single('image'), (req,res)=>{
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  console.log('File uploaded:', req.file);
  res.status(200).json({
    message: 'File uploaded successfully!',
    filename: req.file.filename,
  });

});


app.listen(port, ()=>{
  console.log(`server listening on port ${port}`);
})

