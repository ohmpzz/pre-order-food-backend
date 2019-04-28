import express from 'express';
import multer from 'multer';
import path from 'path';
import mkdirp from 'mkdirp';
import fs from 'fs';

export const router = express.Router();

mkdirp(path.join(__dirname, '../community/covers/'), err => {
  if (err) throw err;
  console.log('community/covers created');
});

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, '../community/covers/'));
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
}).single('cover');

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

router.get('', express.static(path.join(__dirname, '../community')));

router
  .route('/cover')
  .post(upload, (req, res) => {
    const originalurl = req.originalUrl;
    const filename = req.file.filename;
    const path = `${process.env.ORIGIN}${originalurl}/${filename}`;
    return res.json({ url: path });
  })
  .delete(async (req, res) => {
    const path = req.body.path;
    try {
      await removeFile(path);
    } catch (err) {
      res.status(500).json({ success: false });
    }
  });

router.get('/cover/:id', (req, res) => {
  const { id } = req.params;
  res.sendFile(path.join(__dirname, `../community/covers/${id}`));
});
