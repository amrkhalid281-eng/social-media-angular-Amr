export interface IUserProfile {
    isFollowing: boolean;
    user: User;
}

export interface User {
    _id: string;
    name: string;
    username: string;
    email: string;
    dateOfBirth: string;
    gender: string;
    photo: string;
    cover: string;
    followers: any[];
    following: Following[];
    createdAt: string;
    passwordChangedAt: string;
    followersCount: number;
    followingCount: number;
    bookmarksCount: number;
    id: string;
}

interface Following {
    _id: string;
    name: string;
    photo: string;
    followersCount: number;
    followingCount: number;
    bookmarksCount: number;
    id: string;
}