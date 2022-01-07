export const createFormData = (uploadedImage: string): FormData => {
  const formData = new FormData();
  formData.append('image', uploadedImage);
  return formData;
};

export const createConfigurationContentType = (): object => {
  return {
    headers: {
      'content-type': 'multipart/form-data'
    }
  };
};
