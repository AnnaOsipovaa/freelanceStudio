import config from "../../config/config.js";
import { FreelancersService } from "../../services/freelancers-service.js";
import { CommonUtils } from "../../utils/common-utils.js";

export class FreelancersList {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.getFreelancers();
    }

    async getFreelancers() {
        const response = await FreelancersService.getFreelancers();

        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        this.showRecords(response.freelancers);
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