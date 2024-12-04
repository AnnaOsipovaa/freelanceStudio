import config from "../../config/config.js";
import { CommonUtils } from "../../utils/common-utils.js";
import { HttpUtils } from "../../utils/http-utils.js";

export class FreelancersList {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.getFreelancers();
    }

    async getFreelancers() {
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
            trElement.insertCell().innerHTML = CommonUtils.getLevelHtml(element.level);
            trElement.insertCell().innerText = element.education;
            trElement.insertCell().innerText = element.location;
            trElement.insertCell().innerText = element.skills;
            trElement.insertCell().innerHTML = CommonUtils.generateGridToolsColumn('freelancers', element.id);
            recordsElements.appendChild(trElement);
        });

        new DataTable('#data-table', {
            language: {
                "lengthMenu": "Показывать _MENU_ записей на странице",
                "search": "Фильтр:",
                "info": "Страница _PAGE_ из _PAGES_ ",
                "paginate": {
                    "next": "Вперед",
                    "previous": "Назад"
                },
            }
        });
    }
}