import { AuthService } from "../../services/auth-service.js";
import { AuthUtils } from "../../utils/auth-utils.js";
import { HttpUtils } from "../../utils/http-utils.js";
import { ValidationUtils } from "../../utils/validation-utils.js";

export class Login {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/');
        }

        this.findElements();

        document.getElementById('process-button').addEventListener('click', this.login.bind(this));

        this.validations = [
            { element: this.passwordElement },
            { element: this.emailElement, options: { pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/ } }
        ];
    }

    findElements(){
        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.remember = document.getElementById('remember');
        this.commonErrorElement = document.getElementById('common-error');
    }

    async login() {
        this.commonErrorElement.style.display = 'none';

        if (ValidationUtils.validateForm(this.validations)) {

            const loginResult = await AuthService.logIn({
                email: this.emailElement.value,
                password: this.passwordElement.value,
                rememberMe: this.remember.checked
            });

            if (!loginResult) {
                this.commonErrorElement.style.display = 'block';
                return;
            }

            AuthUtils.setAuthInfo(loginResult.accessToken, loginResult.refreshToken, {
                id: loginResult.id,
                name: loginResult.name
            });

            this.openNewRoute('/');
        }
    }
}