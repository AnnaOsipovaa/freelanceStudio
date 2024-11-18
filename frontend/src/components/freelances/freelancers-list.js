
import config from "../../config/config.js";
import { HttpUtils } from "../../utils/http-utils.js";

export class FreelancesList {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.getFreelances();
    }

    async getFreelances() {
        const result = await HttpUtils.request('/freelancers');

        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.error || !result.response || (result.response && (result.response.error || !result.response.freelancers))) {
            return alert('Возникла ошибка при запросе фрилансеров. Обратитесь в поддержку');
        }

        this.showRecords(result.response.freelancers);
    }

    showRecords(freelancers) {
        const recordsElements = document.getElementById('records');

        freelancers.forEach((element, index) => {
            const trElement = document.createElement('tr');
            trElement.insertCell().innerText = index + 1;
            trElement.insertCell().innerHTML = element.avatar ? `<img class="freelancer-avatar" src="${config.host + element.avatar}" alt="фото">` : '';
            trElement.insertCell().innerText = element.name + ' ' + element.lastName;
            trElement.insertCell().innerText = element.email;

            let levelHtml = null;
            switch (element.level) {
                case config.freelancerLevels.junior:
                    levelHtml = `<span class="badge badge-info">${element.level}</span>`
                    break;
                case config.freelancerLevels.middle:
                    levelHtml = `<span class="badge badge-warning">${element.level}</span>`
                    break;
                case config.freelancerLevels.senior:
                    levelHtml = `<span class="badge badge-success">${element.level}</span>`
                    break;
                default:
                    levelHtml = `<span class="badge badge-secondary">Unknown</span>`
                    break;
            }

            trElement.insertCell().innerHTML = levelHtml;
            trElement.insertCell().innerText = element.education;
            trElement.insertCell().innerText = element.location;
            trElement.insertCell().innerText = element.skills;
            trElement.insertCell().innerHTML = `<div class="freelancer-tools">
                <a href="/freelancers/view?id=${element.id}"><i class="fas fa-eye"></i></a>
                <a href="/freelancers/edit?id=${element.id}"><i class="fas fa-edit"></i></a>
                <a href="/freelancers/delete?id=${element.id}"><i class="fas fa-trash"></i></a>
                </div>`;
            recordsElements.appendChild(trElement);
        });
    }
}