export interface BlogPost {
  id: number;
  title: string;
  author: string;
  updated_at: string;
  image_caption: string;
  preview: string;
  content: string;
  is_draft: boolean;
  image_id: number;
  user_id: number;
}

export interface AdminBlogPost {
  id: number;
  title: string;
  author: string;
  updated_at: string;
  image_caption: string;
  preview: string;
  content: string;
  is_draft: boolean;
  image_id: number;
  user_id: number;
  filename: string;
}

export interface BlogPostAdminList {
  id: number;
  title: string;
  author: string;
  updated_at: string;
  preview: string;
  is_draft: boolean;
}

export interface BlogPostList {
  id: number;
  title: string;
  author: string;
  updated_at: string;
  preview: string;
  image_id: number;
}

export interface BlogNewPost {
  title: string;
  imageCaption: string;
  preview: string;
}

export interface BlogPostInput {
  title: string;
  image_caption: string;
  preview: string;
  content: string;
  is_draft: number;
  image_id: number;
  user_id: number;
}

export type BlogPostId = {
  blogID: string;
};

export const modifyBlogPost = (values: BlogNewPost, editorContent: string, isDraft: number, imageId: number, userId: number): BlogPostInput => {
  return {
    title: values.title,
    image_caption: values.imageCaption,
    preview: values.preview,
    content: editorContent,
    is_draft: isDraft,
    image_id: imageId,
    user_id: userId
  };
};

export const deleteBlogPost = (): object => {
  return {
    FLAG_TESTING: false
  };
};
