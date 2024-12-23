import config from "../config/config.js";
import { AuthUtils } from "./auth-utils.js";

export class HttpUtils {
    static async request(url, useAuth = true, method = 'GET', body = null) {

        const result = {
            error: false,
            redirect: false,
            response: null
        }

        const params = {
            method: method,
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            }
        }

        let token = null;

        if (useAuth) {
            token = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);
            if (token) {
                params.headers.authorization = token;
            }
        }

        if (body) {
            params.body = JSON.stringify(body);
        }

        let response = null;

        try {
            response = await fetch(config.api + url, params);
            result.response = await response.json();
        } catch (error) {
            result.error = true;
            return result;
        }

        if (response.status < 200 || response.status >= 300) {
            result.error = true;

            if (useAuth && response.status === 401) {
                if (!token) {
                    result.redirect = '/login';
                } else {
                    const updateTokenResult = await AuthUtils.updateRefreshToken();

                    if (updateTokenResult) {
                        return this.request(url, useAuth, method, body);
                    } else {
                        result.redirect = '/login';
                    }
                }
            }
        }

        return result;
    }
}