export class AuthUtils {
    static accessTokenKey = 'accessToken';
    static refreshTokenKey = 'refreshToken';
    static userInfoTokenKey = 'userInfo';

    static setAuthInfo(accessToken, refreshToken, userInfo) {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
        localStorage.setItem(this.userInfoTokenKey, JSON.stringify(userInfo));
    }

    static removeAuthInfo() {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userInfoTokenKey);
    }

    static getAuthInfo(key = null) {
        if (key) {
            switch (key) {
                case this.accessTokenKey:
                    return localStorage.getItem(this.accessTokenKey);
                case this.refreshTokenKey:
                    return localStorage.getItem(this.refreshTokenKey);
                case this.userInfoTokenKey:
                    return localStorage.getItem(this.userInfoTokenKey);
                default:
                    return null;
            }
        } else {
            return {
                [this.accessTokenKey]: localStorage.getItem(this.accessTokenKey),
                [this.refreshTokenKey]: localStorage.getItem(this.refreshTokenKey),
                [this.userInfoTokenKey]: localStorage.getItem(this.userInfoTokenKey)
            }
        }
    }
}