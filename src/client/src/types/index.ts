export type ROLE = "FC:ADMIN" | "FC:SUPER:ADMIN" | "FC:USER";
export type STATUS = "SUCCESS" | "ERROR" | "LOADING";
export type ACTIVETHEME = "DARK" | "LIGHT";
export type CACHEABLE = "FC:IRCACHE:EDITOR" | "FC:IRCACHE:LESSON";

export interface ACTION {
  type: string;
  payload?: any;
}

  
export interface JoinRequest {
  id: string;
  discussionId: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any;
}
export interface Discussion {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  isPrivate: boolean;
  isOpen: boolean;
  participants: string[];
  createdAt: any;
  lastActivityAt: any;
  tags: string[];
}

export interface DiscussionMessage {
  id?: string;
  discussionId: string;
  senderAvatar?: string;
  senderName: string;
  senderId: string;
  content: string;
  fileUrl?: string;
  createdAt?: any;
  isDeleted?:boolean;
  updatedAt?: any;
  replyTo?: string;
  reactions?: { [key: string]: string[] };
}

export type ARTICLE = {
  title?: string;
  content?: string;
  slug?: string;
  image?: {
    public_id?: {
      type: string;
    };
    url?: {
      type: string;
    };
  };
  description?: string;
  type?: string;
  sanitizedHtml?: string;
  readDuration?: string;
  category?: string;
  pinnedBy?: USER[];
  savedBy?: USER[];
  postedBy?: USER | string;
  likes?: USER[];
  views?: number;
  tags?: string;
  updatedAt?: Date;
  comments?: [];
  createdAt?: Date;
};
export type COURSEMATERIAL = {
  courseTitle: string;
  courseCode: string;
  session: string;
  level: string;
  file: {
    public_id?: string;
    url?: string;
  };
  downloads: number | 0;
  postedBy: USER;
  createdAt: Date;
};
export type PASTQUESTION = {
  courseTitle?: string;
  courseCode?: string;
  session?: string;
  level?: string;
  file: {
    public_id?: string;
    url?: string;
  };
  downloads: number | 0;
  school?: string;
  pdfFile: {
    public_id?: string;
    url?: string;
  };
  isAnswered?: boolean;

  postedBy?: USER | string;
  createdAt?: Date;
};
export type EVENT = {
  title?: string;
  description?: string;
  category?: string;
  startDate?: Date;
  endDate?: Date;
  slug?: string;
  avenue?: string;
  avatar: {
    public_id?: string;
    url?: string;
  };
  createdBy?: USER | string;
  createdAt?: Date;
};

export interface USER_ROOT_STATE {
  user: {
    loading?: boolean;
    isAuthenticated?: boolean;
    user?: USER;
    token?: string;
    logoutSuccess?: boolean | string;
    error?: any;
  };
  forgotPassword: {
    loading?: boolean;
    message?: string;
    success?: boolean | string;
    error?: any;
  };
  userDetails: {
    loading?: boolean;
    user?: USER;
    error?: any;
  };
  allUsers: {
    loading?: boolean;
    users?: USER[];
    error?: any;
  };
  profile: {
    loading?: boolean;
    isUpdated?: boolean;
    error?: any;
  };
}

export interface ARTICLE_ROOT_STATE {
  newArticle: {
    loading?: boolean;
    success?: boolean;
    article?: ARTICLE;
    error?: any;
  };
  likeArticle: {
    loading?: boolean;
    message?: string;
    success?: boolean;
    error?: any;
  };
  newComment: {
    loading?: boolean;
    success?: boolean;
    error?: any;
  };
  newCommentReply: {
    loading?: boolean;
    success?: boolean;
    error?: any;
  };
  bookmarkArticle: {
    loading?: boolean;
    success?: boolean;
    message?: string;
    error?: any;
  };
  deleteArticle: {
    loading?: boolean;
    success?: boolean;
    message?: string;
    error?: any;
  };
  deleteReply: {
    loading?: boolean;
    success?: boolean;
    message?: string;
    error?: any;
  };
  articleDetails: {
    loading?: boolean;
    success?: boolean;
    article?: ARTICLE;
    error?: any;
  };
  articleSearch: {
    loading?: boolean;
    success?: boolean;
    articles?: ARTICLE[];
    error?: any;
    totalPages?: number;
  };
  updateArticle: {
    loading?: boolean;
    success?: boolean;
    message?: string;
    error?: any;
  };
  deleteComment: {
    loading?: boolean;
    success?: boolean;
    message?: string;
    error?: any;
  };
}
export interface PASTQUESTION_ROOT_STATE {
  newPastquestion: {
    loading?: boolean;
    pastQuestion?: PASTQUESTION;
    success?: boolean;
    error?: any;
  };
  deletePastQuestion: {
    loading?: boolean;
    success?: boolean;
    message?: string;
    error?: any;
  };
  pastQuestionDetails: {
    loading?: boolean;
    success?: boolean;
    pastQuestion?: PASTQUESTION;
    error?: any;
  };
  pastQuestionSearch: {
    loading?: boolean;
    success?: boolean;
    pastQuestions?: PASTQUESTION[];
    error?: any;
    totalPages?: number;
  };
}
export interface NOTIFICATION {
  _id: string;
  type: string;
  slug: string;
  articleFrom?: string;
  eventFrom?: string;
  username?: string;
  message: string;
  avatar?: string;
  image?: string;
  date: string;
  read?: boolean;
}
export interface NOTIFICATIONS {
  notifications: NOTIFICATION[];
}
export interface EVENT_ROOT_STATE {
  newEvent: {
    loading?: boolean;
    success?: boolean;
    event?: EVENT;
    error?: any;
  };

  deleteEvent: {
    loading?: boolean;
    success?: boolean;
    message?: string;
    error?: any;
  };

  eventDetails: {
    loading?: boolean;
    success?: boolean;
    event?: EVENT;
    error?: any;
  };
  eventSearch: {
    loading?: boolean;
    success?: boolean;
    events?: EVENT[];
    error?: any;
  };
  updateEvent: {
    loading?: boolean;
    success?: boolean;
    message?: string;
    error?: any;
  };
}
export type USER = {
  _id?:string;
  username?: string;
  shortname?: string;
  email?: string;
  phonenumber?: string;
  connections?: USER[];
  school?: string;
  bio?: string;
  referralCode?: string;
  role?: ROLE;
  avatar?: {
    public_id?: string;
    url?: string;
  };
  articles?: ARTICLE[];
  savedArticles?: ARTICLE[];
  tokenBalance: number | 0;
  social_handles?: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
    instagram?: string;
    tiktok?: string;
  };
  createdAt?: string;
};

export type COURSE = {
  title: string;
  lastmod?: string;
  summary?: string;
  images?: string[];
  videos?: string[];
  authors?: string[];
  school: string;
  slug: string;
  file: {
    public_id?: string;
    url?: string;
  };
  likes: USER[];
  comments: [];
  views: number;
  courseCode: string;
  session: string;
  level: string;
  uploadedBy: USER;
  createdAt: Date;
};

export type LIKEACTION = {
  LIKE: string;
  UNLIKE: string;
};

export type THEMEVARIANT = {
  light: string;
  dark: string;
};

export type SignInResult = {
  accessToken?: string;
  user?: USER;
  status: STATUS;
};

export type LogInResult = {
  accessToken?: string;
  user?: USER;
  status: STATUS;
};

export type ILesson = {
  _id?: string;
  lessonTitle?: string;
  lessonIndex?: string;
  lessonAim?: string;
  description?: string;
  lessonUrl?: string;
  duration?: number;
  isWatched?: boolean;
  progress?: number;
  lessonMaterial?: string;
};
export type IModule = {
  _id?: string;
  title?: string;
  description?: string;
  avatar?: {
    secureUrl: string;
  };
  lessonCount?: number;
  lessons?: Array<ILesson>;
};
