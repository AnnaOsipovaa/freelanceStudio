import config from "../../config/config.js";
import { FreelancersService } from "../../services/freelancers-service.js";
import { CommonUtils } from "../../utils/common-utils.js";
import { UrlUtils } from "../../utils/url-utils.js";

export class FreelancesView {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        const id = UrlUtils.getUrlParam('id');

        if (!id) {
            return this.openNewRoute('/');
        }

        document.getElementById('edit-link').href = '/freelancers/edit?id=' + id;
        document.getElementById('delete-link').href = '/freelancers/delete?id=' + id;

        this.getFreelancer(id);
    }

    async getFreelancer(id) { 
        const response = await FreelancersService.getFreelancer(id);

        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        this.showFreelancer(response.freelancer);
    }

    showFreelancer(freelancer) {
        if (freelancer.avatar) {
            document.getElementById('avatar').src = config.host + freelancer.avatar;
        }

        document.getElementById('name').innerText = freelancer.name + ' ' + freelancer.lastName;
        document.getElementById('level').innerHTML = CommonUtils.getLevelHtml(freelancer.level);
        document.getElementById('email').innerText = freelancer.email;
        document.getElementById('education').innerText = freelancer.education;
        document.getElementById('location').innerText = freelancer.location;
        document.getElementById('skills').innerText = freelancer.skills;
        document.getElementById('info').innerText = freelancer.info;

        if (freelancer.createdAt) {
            const date = new Date(freelancer.createdAt);
            document.getElementById('created').innerText = date.toLocaleString('ru-Ru');
        }
    }
}