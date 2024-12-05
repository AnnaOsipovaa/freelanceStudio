import config from "../../config/config.js";
import { FreelancersService } from "../../services/freelancers-service.js";
import { CommonUtils } from "../../utils/common-utils.js";
import { FileUtils } from "../../utils/file-utils.js";
import { UrlUtils } from "../../utils/url-utils.js";
import { ValidationUtils } from "../../utils/validation-utils.js";

export class FreelancesEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        const id = UrlUtils.getUrlParam('id');

        if (!id) {
            return this.openNewRoute('/');
        }

        document.getElementById('updateButton').addEventListener('click', this.updateFreelancer.bind(this));

        bsCustomFileInput.init();

        this.findElements();

        this.getFreelancer(id);

        this.validations = [
            { element: this.nameElement },
            { element: this.lastNameElement },
            { element: this.educationElement },
            { element: this.locationElement },
            { element: this.skillsElement },
            { element: this.infoElement },
            { element: this.levelSelectElement },
            { element: this.emailElement, options: { pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/ } }
        ];
    }

    findElements(){
        this.nameElement = document.getElementById('name');
        this.lastNameElement = document.getElementById('last-name');
        this.emailElement = document.getElementById('email');
        this.educationElement = document.getElementById('education');
        this.locationElement = document.getElementById('location');
        this.skillsElement = document.getElementById('skills');
        this.infoElement = document.getElementById('info');
        this.levelSelectElement = document.getElementById('level-select');
        this.avatarElement = document.getElementById('avatar');
    }

    async getFreelancer(id) { 
        const response = await FreelancersService.getFreelancer(id);

        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }
        this.freelancerOriginalData = response.freelancer;
        this.showFreelancer(response.freelancer);
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

        if (ValidationUtils.validateForm(this.validations)) {

            const changedData = {};
            if (this.nameElement.value !== this.freelancerOriginalData.name) {
                changedData.name = this.nameElement.value;
            }
            if (this.lastNameElement.value !== this.freelancerOriginalData.lastName) {
                changedData.lastName = this.lastNameElement.value;
            }
            if (this.emailElement.value !== this.freelancerOriginalData.email) {
                changedData.email = this.emailElement.value;
            }
            if (this.educationElement.value !== this.freelancerOriginalData.education) {
                changedData.education = this.educationElement.value;
            }
            if (this.locationElement.value !== this.freelancerOriginalData.location) {
                changedData.location = this.locationElement.value;
            }
            if (this.skillsElement.value !== this.freelancerOriginalData.skills) {
                changedData.skills = this.skillsElement.value;
            }
            if (this.infoElement.value !== this.freelancerOriginalData.info) {
                changedData.info = this.infoElement.value;
            }
            if (this.levelSelectElement.value !== this.freelancerOriginalData.level) {
                changedData.level = this.levelSelectElement.value;
            }
            if (this.avatarElement.files && this.avatarElement.files.length > 0) {
                changedData.avatarBase64 = await FileUtils.convertFileToBase64(this.avatarElement.files[0]);
            }

            if (Object.keys(changedData).length > 0) {
                const response = await FreelancersService.updateFreelancer(this.freelancerOriginalData.id, changedData);
                
                if (response.error) {
                    alert(response.error);
                    return response.redirect ? this.openNewRoute(response.redirect) : null;
                }

                return this.openNewRoute('/freelancers/view?id=' + this.freelancerOriginalData.id);
            }
        }
    }
}