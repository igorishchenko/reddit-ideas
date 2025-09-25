export type RedditPost = {
  id: string;
  subreddit: string;
  title: string;
  url: string;
  upvotes: number;
  numComments: number;
  createdAt: string; // ISO string
};

export type DerivedIdea = {
  id: string;
  name: string;
  pitch: string;
  painPoint: string;
  sources: { label: string; url: string }[];
  score: number; // 0-100
  topic: string;
  isNew?: boolean;
};
