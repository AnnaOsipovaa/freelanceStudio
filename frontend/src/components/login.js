export class Login {
    constructor() {
        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.remember = document.getElementById('remember');

        document.getElementById('process-button').addEventListener('click', this.login.bind(this));
    }

    async login() {
        if (this.validateForm()) {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    login: this.emailElement.value,
                    password: this.passwordElement.value,
                    rememberMe: this.remember.checked
                })
            });

            const result = await response.json();
            if(result.error || !result.accessToken || !result.refreshToken || !result.id || !result.name){

            }

        } else {

        }
    }

    validateForm() {
        let isValid = true;

        if (this.emailElement.value && this.emailElement.value.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)) {
            this.emailElement.classList.remove('is-invalid');
        } else {
            this.emailElement.classList.add('is-invalid');
            isValid = false;
        }

        if (this.passwordElement.value) {
            this.passwordElement.classList.remove('is-invalid');
        } else {
            this.passwordElement.classList.add('is-invalid');
            isValid = false;
        }

        return isValid;
    }
}