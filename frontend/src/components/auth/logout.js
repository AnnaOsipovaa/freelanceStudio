import { AuthUtils } from "../../utils/auth-utils";
import { HttpUtils } from "../../utils/http-utils.js";

export class Logout {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) && !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            return this.openNewRoute('/login');
        }

        this.logout();
    }

    async logout() {
        await HttpUtils.request('/logout', false, 'POST', {
            refreshToken: AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)
        });

        AuthUtils.removeAuthInfo();

        this.openNewRoute('/login');
    }
}