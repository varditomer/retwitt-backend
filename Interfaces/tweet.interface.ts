import { ObjectId } from "mongodb";


export interface Reply {
    _id: string,
    createdAt: number,
    createdBy: string,
    content: string,
    imgUrl?: string,
    likes: string[],
}

export interface Tweet  {
    _id?: ObjectId,
    createdAt?: number,
    hashtags: string[],
    replies: Reply[],
    retweetedBy: [
        {
            retweeterId: string,
            retweetId: string
        }?
    ]
    savedBy: string[],
    likes: string[],

    createdBy: string,
    imgUrl: string,
    isEveryOneCanReply: boolean,
    isRetweet: boolean,
    content: string,
}

export interface Retweet {
    _id?: string,
    createdAt?: number,
    createdBy: string,
    retweetedTweetId: string
    isRetweet: boolean
}

export interface hashtags {
    _id?: string,
    hashtagsList: hashtag[]
}

export interface hashtag {
    key: string,
    occurrences: number
}