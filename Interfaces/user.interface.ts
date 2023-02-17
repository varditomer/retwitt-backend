export interface User {
    password?: string, 
    username?: string, 
    _id?: string,
    createdAt?: number,
    firstName: string,
    lastName: string,
    about: string,
    profileImg: string,
    coverImg: string,
    follows: string[],
    followers: string[],
    savedTweets: string[],
    isGuest: boolean
}

export interface UserCredentials {
    password: string,
    username: string,
}
