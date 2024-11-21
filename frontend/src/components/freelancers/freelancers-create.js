import config from "../../config/config.js";
import { FileUtils } from "../../utils/file-utils.js";
import { HttpUtils } from "../../utils/http-utils.js";

export class FreelancesCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        document.getElementById('saveButton').addEventListener('click', this.saveFreelances.bind(this));

        bsCustomFileInput.init();

        this.nameElement = document.getElementById('name');
        this.lastNameElement = document.getElementById('last-name');
        this.emailElement = document.getElementById('email');
        this.educationElement = document.getElementById('education');
        this.locationElement = document.getElementById('location');
        this.skillsElement = document.getElementById('skills');
        this.infoElement = document.getElementById('info');
        this.levelElement = document.getElementById('level');
        this.avatarElement = document.getElementById('avatar');
    }

    async saveFreelances(e) {
        e.preventDefault();

        if (this.validateForm()) {
            const params =  {
                name: this.nameElement.value,
                lastName: this.lastNameElement.value,
                email: this.emailElement.value,
                education: this.educationElement.value,
                location: this.locationElement.value,
                skills: this.skillsElement.value,
                info: this.infoElement.value,
                level: this.levelElement.value
            }

            if(this.avatarElement.files && this.avatarElement.files.length > 0){
                params.avatarBase64 = await FileUtils.convertFileToBase64(this.avatarElement.files[0]);
            }

            const result = await HttpUtils.request('/freelancers', true, 'POST', params);

            if (result.redirect) {
                return this.openNewRoute(result.redirect);
            }

            if (result.error || !result.response || (result.response && result.response.error)) {
                return alert('Возникла ошибка при создании фрилансера. Обратитесь в поддержку');
            }

            return this.openNewRoute('/freelancers/view?id=' + result.response.id);
        }
    }

    validateForm() {
        let isValid = true;

        let textInputArray = [
            this.nameElement,
            this.lastNameElement,
            this.educationElement,
            this.locationElement,
            this.skillsElement,
            this.infoElement,
            this.levelElement
        ];

        textInputArray.forEach(input => {
            if (input.value) {
                input.classList.remove('is-invalid');
            } else {
                input.classList.add('is-invalid');
                isValid = false;
            }
        });

        if (this.emailElement.value && this.emailElement.value.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)) {
            this.emailElement.classList.remove('is-invalid');
        } else {
            this.emailElement.classList.add('is-invalid');
            isValid = false;
        }

        return isValid;
    }
}