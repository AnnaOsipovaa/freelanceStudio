import config from "../../config/config.js";
import { CommonUtils } from "../../utils/common-utils.js";
import { FileUtils } from "../../utils/file-utils.js";
import { HttpUtils } from "../../utils/http-utils.js";

export class FreelancesEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');

        if (!id) {
            return this.openNewRoute('/');
        }

        document.getElementById('updateButton').addEventListener('click', this.updateFreelancer.bind(this));

        bsCustomFileInput.init();

        this.nameElement = document.getElementById('name');
        this.lastNameElement = document.getElementById('last-name');
        this.emailElement = document.getElementById('email');
        this.educationElement = document.getElementById('education');
        this.locationElement = document.getElementById('location');
        this.skillsElement = document.getElementById('skills');
        this.infoElement = document.getElementById('info');
        this.levelSelectElement = document.getElementById('level-select');
        this.avatarElement = document.getElementById('avatar');

        this.getFreelancer(id);
    }

    async getFreelancer(id) {
        const result = await HttpUtils.request('/freelancers/' + id);

        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.error || !result.response || (result.response && result.response.error)) {
            return alert('Возникла ошибка при запросе фрилансера. Обратитесь в поддержку');
        }

        this.freelancerOriginalData = result.response;
        this.showFreelancer(result.response);
    }

    showFreelancer(freelancer) {
        let breadcrumbFreelancer = document.getElementById('breadcrumb-freelancer');
        breadcrumbFreelancer.innerText = freelancer.name + ' ' + freelancer.lastName;
        breadcrumbFreelancer.href = '/freelancers/view?id=' + freelancer.id;

        if (freelancer.avatar) {
            this.avatarElement.src = config.host + freelancer.avatar;
        }
        document.getElementById('level').innerHTML = CommonUtils.getLevelHtml(freelancer.level);

        this.nameElement.value = freelancer.name;
        this.lastNameElement.value = freelancer.lastName;
        this.emailElement.value = freelancer.email;
        this.educationElement.value = freelancer.education;
        this.locationElement.value = freelancer.location;
        this.skillsElement.value = freelancer.skills;
        this.infoElement.value = freelancer.info;

        for (let i = 0; i < this.levelSelectElement.options.length; i++) {
            if (this.levelSelectElement.options[i].value === freelancer.level) {
                this.levelSelectElement.selectedIndex = i;
                break;
            }
        }
    }

    async updateFreelancer(e) {
        e.preventDefault();

        if (this.validateForm()) {

            const changedData = {};
            if(this.nameElement.value !== this.freelancerOriginalData.name){
                changedData.name = this.nameElement.value;
            }
            if(this.lastNameElement.value !== this.freelancerOriginalData.lastName){
                changedData.lastName = this.lastNameElement.value;
            }
            if(this.emailElement.value !== this.freelancerOriginalData.email){
                changedData.email = this.emailElement.value;
            }
            if(this.educationElement.value !== this.freelancerOriginalData.education){
                changedData.education = this.educationElement.value;
            }
            if(this.locationElement.value !== this.freelancerOriginalData.location){
                changedData.location = this.locationElement.value;
            }
            if(this.skillsElement.value !== this.freelancerOriginalData.skills){
                changedData.skills = this.skillsElement.value;
            }
            if(this.infoElement.value !== this.freelancerOriginalData.info){
                changedData.info = this.infoElement.value;
            }
            if(this.levelSelectElement.value !== this.freelancerOriginalData.level){
                changedData.level = this.levelSelectElement.value;
            }
            if(this.avatarElement.files && this.avatarElement.files.length > 0){
                changedData.avatarBase64 = await FileUtils.convertFileToBase64(this.avatarElement.files[0]);
            }

            if(Object.keys(changedData).length > 0){
                const result = await HttpUtils.request('/freelancers/' + this.freelancerOriginalData.id, true, 'PUT', changedData);

                if (result.redirect) {
                    return this.openNewRoute(result.redirect);
                }
    
                if (result.error || !result.response || (result.response && result.response.error)) {
                    return alert('Возникла ошибка при обновление фрилансера. Обратитесь в поддержку');
                }
    
                return this.openNewRoute('/freelancers/view?id=' + this.freelancerOriginalData.id);
            }
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
            this.levelSelectElement
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