const multer = require('multer');
const selectedFilepath = require('path');
const storageDirectory = 'assets/';

const configureStorage = multer.diskStorage({
  destination: (req: Request, file: any, cb: any) => {
    cb(null, storageDirectory);
  },
  filename: (req: Request, file: any, cb: any) => {
    cb(null, new Date().valueOf() + '_' + file.originalname);
  }
});

const imageUpload = multer({
  storage: configureStorage,
  fileFilter: (req: Request, file: any, cb: any) => {
    const fileExtension = selectedFilepath.extname(file.originalname.toLowerCase());
    if (fileExtension !== '.png' && fileExtension !== '.jpg' && fileExtension !== '.jpeg') {
      return cb(null, false);
    }
    cb(null, true);
  }
});

export { imageUpload };
