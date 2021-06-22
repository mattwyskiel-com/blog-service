export interface BlogPost {
  id: number;
  author: string;
  category: string;
  content: string;
  excerpt: string;
  published: string;
  slug: string;
  tags?: string[];
  title: string;
}
