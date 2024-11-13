import { AuthUtils } from "../utils/auth-utils";

export class Logout{
    constructor(openNewRoute){
        this.openNewRoute = openNewRoute;

        if(!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) && !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)){
            return this.openNewRoute('/login');
        }

        this.logout();
    }

    async logout(){
        const response = await fetch('http://localhost:3000/api/logout', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                refreshToken: AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)
            })
        });

        const result = await response.json();

        AuthUtils.removeAuthInfo();

        this.openNewRoute('/login');
    }
}