import { AuthUtils } from "../../utils/auth-utils.js";
import { HttpUtils } from "../../utils/http-utils.js";
import { ValidationUtils } from "../../utils/validation-utils.js";

export class Signup {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/');
        }

        this.findElements();

        document.getElementById('process-button').addEventListener('click', this.signUp.bind(this));
    }

    findElements(){
        this.nameElement = document.getElementById('name');
        this.lastNameElement = document.getElementById('lastName');
        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.passwordRepeatElement = document.getElementById('passwordRepeat');
        this.agree = document.getElementById('agree');
        this.commonErrorElement = document.getElementById('common-error');
    }

    async signUp() {
        this.commonErrorElement.style.display = 'none';

        this.validations = [
            { element: this.nameElement },
            { element: this.lastNameElement },
            { element: this.emailElement, options: { pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/ } },
            { element: this.passwordElement, options: { pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/ } },
            { element: this.passwordRepeatElement, options: { compareTo: this.passwordElement.value } },
            { element: this.agree, options: { checked: true } }
        ];
        
        if (ValidationUtils.validateForm(this.validations)) {
            const result = await HttpUtils.request('/signup', false, 'POST', {
                name: this.nameElement.value,
                lastName: this.lastNameElement.value,
                email: this.emailElement.value,
                password: this.passwordElement.value,
            });

            if (result.error ||
                !result.response ||
                (result.response && !result.response.accessToken || !result.response.refreshToken || !result.response.id || !result.response.name)
            ) {
                this.commonErrorElement.style.display = 'block';
                return;
            }

            AuthUtils.setAuthInfo(result.response.accessToken, result.response.refreshToken, {
                id: result.response.id,
                name: result.response.name
            });

            this.openNewRoute('/');

        } else {

        }
    }
}