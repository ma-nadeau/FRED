import http from "./http";

export const isLoggedIn = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        return false;
    }

    try {
        await http('GET', '/auth/me');
        return true;
    } catch (error) {
        return false;
    }
}

export const getUserDetails = async () => {
    return (await http('GET', '/auth/me')).data;
}
