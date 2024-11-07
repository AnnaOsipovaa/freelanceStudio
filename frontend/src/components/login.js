export class Login {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.remember = document.getElementById('remember');
        this.commonErrorElement = document.getElementById('common-error');
        
        document.getElementById('process-button').addEventListener('click', this.login.bind(this));
    }

    async login() {
        this.commonErrorElement.style.display = 'none';
        
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
                this.commonErrorElement.style.display = 'block';
                return;
            }

            localStorage.setItem('accessToken', result.accessToken);
            localStorage.setItem('refreshToken', result.refreshToken);
            localStorage.setItem('userInfo', JSON.stringify({
                id: result.id,
                name: result.name
            }));

            this.openNewRoute('/');
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