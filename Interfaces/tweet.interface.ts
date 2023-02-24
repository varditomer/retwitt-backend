import { ObjectId } from "mongodb";


export interface Reply {
    _id: string,
    createdAt: number,
    createdBy: string,
    content: string,
    imgUrl?: string,
    likes: string[],
}

export interface Tweet extends NewTweetFields {
    _id?: ObjectId,
    createdAt?: number,
    hashtags: string[],
    replies: Reply[],
    reTweetedBy: string[],
    savedBy: string[],
    likes: string[],
}

export interface NewTweetFields {
    createdBy: string,
    imgUrl: string,
    isEveryOneCanReply: boolean,
    retweet: boolean,
    content: string,
}