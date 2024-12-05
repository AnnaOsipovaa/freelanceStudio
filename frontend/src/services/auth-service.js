import { HttpUtils } from "../utils/http-utils.js";

export class AuthService{
    static async logIn(data){
        const result = await HttpUtils.request('/login', false, 'POST', data);

        if (result.error || 
            !result.response ||
            (result.response && !result.response.accessToken || !result.response.refreshToken || !result.response.id || !result.response.name)
        ) {
            return false;
        }

        return result.response;
    }

    static async signUp(data){
        const result = await HttpUtils.request('/signup', false, 'POST', data);

        if (result.error ||
            !result.response ||
            (result.response && !result.response.accessToken || !result.response.refreshToken || !result.response.id || !result.response.name)
        ) {
            return false;
        }

        return result.response;
    }

    static async logOut(data){
        await HttpUtils.request('/logout', false, 'POST', data);
    }
}