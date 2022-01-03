import logging from '../config/logging';
const fs = require('fs');

export const deleteUploadedImage = (namespace: string, filepath: string) => {
  fs.unlink(filepath, (error: any) => {
    error ? logging.error(namespace, error.message, error) : logging.info(namespace, 'DELETED IMAGE WITH FILEPATH: ', filepath);
  });
};
