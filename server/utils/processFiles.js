import { uploadBuffer } from "./uploadToCloudinary.js";

export const processUploadedFiles = async (files) => {
  let uploaded = {
    images: [],
    codeFile: null,
    docFile: null,
    videoFile: null,
  };

  if (files?.images) {
    for (const img of files.images) {
      const up = await uploadBuffer(img.buffer, img.mimetype);
      uploaded.images.push(up);
    }
  }

  if (files?.codeFile) {
    const file = files.codeFile[0];
    uploaded.codeFile = await uploadBuffer(file.buffer, file.mimetype);
  }

  if (files?.docFile) {
    const file = files.docFile[0];
    uploaded.docFile = await uploadBuffer(file.buffer, file.mimetype);
  }

  if (files?.videoFile) {
    const file = files.videoFile[0];
    uploaded.videoFile = await uploadBuffer(file.buffer, file.mimetype);
  }

  return uploaded;
};
