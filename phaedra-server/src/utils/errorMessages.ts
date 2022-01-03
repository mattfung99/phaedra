const negativeOrNanInputError = (url: string) => {
  return { error: `Incorrect usage for ${url}, id must be a positive integer` };
};

const dneError = (entity: string, errorMessage: string) => {
  return { error: `${entity} ${errorMessage}` };
};

const invalidExtension = (entity: string, extensionTypes: string) => {
  return { error: `${entity} must be of extension types ${extensionTypes}` };
};

const inputError = (url: string) => {
  return { error: `Incorrect usage for ${url}, must be a valid id` };
};

const imageNegativeOrNanInputError = negativeOrNanInputError('/api/v1/image/:id');
const imageDNEError = dneError('image', 'does not exist');
const imageMimetypeError = invalidExtension('image', 'png, jpg, jpeg');
const blogPostNegativeOrNanInputError = negativeOrNanInputError('/api/v1/blog-post/:id');
const blogPostDNEError = dneError('blog_post', 'does not exist');

export { imageNegativeOrNanInputError, imageDNEError, imageMimetypeError, blogPostNegativeOrNanInputError, blogPostDNEError };
