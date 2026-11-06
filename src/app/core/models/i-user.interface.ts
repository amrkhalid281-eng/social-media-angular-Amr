export interface IUser {
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