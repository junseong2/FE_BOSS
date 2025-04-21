/**
 * 이미지 미리보기 처리
 */
export const getImagePreviewReaders = (fileArray) => {
  return fileArray.map((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(`Failed to read file: ${file.name}`);
        }
      };
      reader.onerror = () => reject(`Error reading file: ${file.name}`);
      reader.readAsDataURL(file);
    });
  });
};
