import { diskStorage } from 'multer';

const id = () =>
  Array(18)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');

const normalizedFilename = (req, file, callback) => {
  const fileExtensionName = file.originalname.split('.')[1];

  callback(null, `${id()}.${fileExtensionName}`);
};

export const avatarStorage = diskStorage({
  destination: './uploads/avatars',
  filename: normalizedFilename,
});
