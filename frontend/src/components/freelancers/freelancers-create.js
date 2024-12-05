import { FreelancersService } from "../../services/freelancers-service.js";
import { FileUtils } from "../../utils/file-utils.js";
import { ValidationUtils } from "../../utils/validation-utils.js";

export class FreelancesCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        document.getElementById('saveButton').addEventListener('click', this.saveFreelancer.bind(this));

        bsCustomFileInput.init();

        this.findElements();

        this.validations = [
            { element: this.nameElement },
            { element: this.lastNameElement },
            { element: this.educationElement },
            { element: this.locationElement },
            { element: this.skillsElement },
            { element: this.infoElement },
            { element: this.levelElement },
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
        this.levelElement = document.getElementById('level');
        this.avatarElement = document.getElementById('avatar');
    }

    async saveFreelancer(e) {
        e.preventDefault();

        if (ValidationUtils.validateForm(this.validations)) {
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

            const response = await FreelancersService.createFreelancer(params);

            if (response.error) {
                alert(response.error);
                return response.redirect ? this.openNewRoute(response.redirect) : null;
            }

            return this.openNewRoute('/freelancers/view?id=' + response.id);
        }
    }
}