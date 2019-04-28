import express from 'express';
import multer from 'multer';
import path from 'path';
import mkdirp from 'mkdirp';
import fs from 'fs';

export const router = express.Router();

mkdirp(path.join(__dirname, '../products'), err => {
  if (err) throw err;
  console.log('product folder created');
});

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, '../products'));
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + '_' + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100000000 },
  fileFilter: (req, file, callback) => {
    checkFileType(file, callback);
  },
}).array('products', 10);

function checkFileType(file, callback) {
  const filetypes = /(jpeg|jpg|png|gif)$/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return callback(null, true);
  }
  return callback('Error: Image only', false);
}

function removeFile(path) {
  return new Promise((resolve, reject) => {
    fs.access(path, fs.constants.R_OK | fs.constants.W_OK, err => {
      if (err) {
        return reject({ success: false });
      } else {
        return fs.unlink(path, err => {
          if (err) {
            return reject({ success: false });
          } else {
            return resolve({ success: true });
          }
        });
      }
    });
  });
}

router.get('', express.static(path.join(__dirname, '../products')));

router
  .route('/')
  .post(upload, (req, res) => {
    console.log(req);
    // const originalurl = req.originalUrl;
    // const filename = req.file.filename;
    // const path = `${process.env.ORIGIN}${originalurl}/${filename}`;
    // return res.json({ url: path });
    const imagesUrl = req.files.map(f => {
      const filename = f.filename;
      const path = `${process.env.ORIGIN}/upload/products/${filename}`;
      return path;
    });
    return res.json({ imagesUrl });
  })
  .delete(async (req, res) => {
    const path = req.body.path;
    try {
      await removeFile(path);
    } catch (err) {
      res.status(500).json({ success: false });
    }
  });

router.get(':id', (req, res) => {
  const { id } = req.params;
  res.sendFile(path.join(__dirname, `../products/${id}`));
});
