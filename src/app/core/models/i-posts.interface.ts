export interface IPosts {
    _id: string;
    image?: string;
    privacy: string;
    user: User;
    sharedPost: SharedPost | null;
    likes: string[];
    createdAt: string;
    commentsCount: number;
    topComment: TopComment;
    sharesCount: number;
    likesCount: number;
    isShare: boolean;
    id: string;
    bookmarked: boolean;
    body?: string;
}

interface TopComment {
    _id: string;
    content?: string;
    image?:string;
    commentCreator: User;
    post: string;
    parentComment: null;
    likes: string[];
    createdAt: string;
}

interface User {
    _id: string;
    name: string;
    username: string;
    photo: string;
}

interface SharedPost {
    _id: string;
    image?: string;
    body?:string;
    privacy: string;
    user: User;
    sharedPost: null;
    likes: string[];
    createdAt: string;
    commentsCount: number;
    topComment: null;
    sharesCount: number;
    likesCount: number;
    isShare: boolean;
    id: string;
}

