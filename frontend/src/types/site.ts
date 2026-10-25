export interface Profile {
  name: string;
  role: string;
  location: string;
  bio: string;
  about: string;
  now: string;
  availability: string;
  email: string;
}
export interface Article {
  id: string;
  kind: string;
  date: string;
  title: string;
  excerpt: string;
  paragraphs: string[];
  featured: boolean;
}
export interface Moment {
  id: string;
  date: string;
  title: string;
  text: string;
  tag: string;
}
export interface ProfileSave {
  profile: Profile;
  persisted: boolean;
}
export interface SiteService {
  getProfile(): Promise<Profile>;
  getArticles(): Promise<Article[]>;
  getArticle(id: string): Promise<Article | null>;
  getMoments(): Promise<Moment[]>;
  saveProfile(profile: Profile): Promise<ProfileSave>;
  resetProfile(): Promise<ProfileSave>;
}
