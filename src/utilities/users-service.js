import * as usersAPI from "./users-api";

export async function signUp(userData) {
    const token = await usersAPI.signUp(userData)

    return token;
};
// we are returning the promise of the token; we are going to wait for the promise of attrieving the user data