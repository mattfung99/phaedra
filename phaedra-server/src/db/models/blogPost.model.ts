export interface BlogPost {
  id: number;
  title: string;
  author: string;
  created_at: string;
  updated_at: string;
  image_caption: string;
  preview: string;
  content: string;
  is_draft: boolean;
  image_id: number;
  user_id: number;
}

export interface BlogPostList {
  id: number;
  title: string;
  author: string;
  created_at: string;
  updated_at: string;
  image_caption: string;
  preview: string;
  image_id: number;
}
