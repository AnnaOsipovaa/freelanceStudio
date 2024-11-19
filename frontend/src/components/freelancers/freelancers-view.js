import config from "../../config/config.js";
import { HttpUtils } from "../../utils/http-utils.js";

export class FreelancesView {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');

        if (!id) {
            return this.openNewRoute('/');
        }

        document.getElementById('edit-link').href = '/freelancers/edit?id=' + id;
        document.getElementById('delete-link').href = '/freelancers/delete?id=' + id;

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

        this.showFreelancer(result.response);
    }

    showFreelancer(freelancer) {
        if (freelancer.avatar) {
            document.getElementById('avatar').src = config.host + freelancer.avatar;
        }

        document.getElementById('name').innerText = freelancer.name + ' ' + freelancer.lastName;

        let levelHtml = null;
        switch (freelancer.level) {
            case config.freelancerLevels.junior:
                levelHtml = `<span class="badge badge-info">${freelancer.level}</span>`
                break;
            case config.freelancerLevels.middle:
                levelHtml = `<span class="badge badge-warning">${freelancer.level}</span>`
                break;
            case config.freelancerLevels.senior:
                levelHtml = `<span class="badge badge-success">${freelancer.level}</span>`
                break;
            default:
                levelHtml = `<span class="badge badge-secondary">Unknown</span>`
                break;
        }
        document.getElementById('level').innerHTML = levelHtml;

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