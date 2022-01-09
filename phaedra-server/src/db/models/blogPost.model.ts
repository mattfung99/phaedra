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
