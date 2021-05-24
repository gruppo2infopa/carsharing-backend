import fs from 'fs';
import crypto from 'crypto';
import { UploadedFile } from 'express-fileupload';

const base_folder = 'upload/';
const fsPromises = fs.promises;

function getUserDir(userEmail: string): string {
  return base_folder + crypto.createHash('md5').update(userEmail).digest('hex');
}

export async function saveUserFile(
  file: UploadedFile,
  userEmail: string,
  fileName: string
) {
  const uploadedFile = file as UploadedFile;

  const userFolder = getUserDir(userEmail);
  const filePath = `${userFolder}/${fileName}`;
  await fsPromises.mkdir(userFolder, { recursive: true });
  await uploadedFile.mv(filePath);
}

export async function deleteUserFile(userEmail: string, fileName: string) {
  const userFolder = getUserDir(userEmail);
  const filePath = `${userFolder}/${fileName}`;
  await fsPromises.unlink(filePath);
}
