export interface INotification {
    _id: string;
    type: string;
    message?: string;
    isRead: boolean;
    createdAt: string;
    actor?: {
        _id: string;
        name: string;
        username?: string;
        photo?: string;
    };
    entity?: {
        _id?: string;
        body?: string;
        content?: string;
    };
}
