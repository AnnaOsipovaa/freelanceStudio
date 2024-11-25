import { CommonUtils } from "../../utils/common-utils.js";
import { HttpUtils } from "../../utils/http-utils.js";

export class OrdersList {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.getOrders();
    }

    async getOrders() {
        const result = await HttpUtils.request('/orders');

        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.error || !result.response || (result.response && (result.response.error || !result.response.orders))) {
            return alert('Возникла ошибка при запросе заказов. Обратитесь в поддержку');
        }

        this.showRecords(result.response.orders);
    }

    showRecords(orders) {
        const recordsElements = document.getElementById('records');

        orders.forEach(element => {
            const trElement = document.createElement('tr');
            trElement.insertCell().innerText = element.number;
            trElement.insertCell().innerText = element.owner.name + ' ' + element.owner.lastName;
            trElement.insertCell().innerHTML = `<a href="/freelancers/view?id=${element.freelancer.id}">${element.freelancer.name + ' ' + element.freelancer.lastName}</a>`;
            trElement.insertCell().innerText = (new Date(element.scheduledDate)).toLocaleString('ru-Ru');
            trElement.insertCell().innerText = (new Date(element.deadlineDate)).toLocaleString('ru-Ru');

            const statusInfo = CommonUtils.getStatusOrderHtml(element.status);
            trElement.insertCell().innerHTML = `<span class="badge badge-${statusInfo.color}">${statusInfo.name}</span>`;

            trElement.insertCell().innerText = element.completeDate ? (new Date(element.completeDate)).toLocaleString('ru-Ru') : '';

            trElement.insertCell().innerHTML = `<div class="order-tools">
                <a href="/orders/view?id=${element.id}"><i class="fas fa-eye"></i></a>
                <a href="/orders/edit?id=${element.id}"><i class="fas fa-edit"></i></a>
                <a href="/orders/delete?id=${element.id}"><i class="fas fa-trash"></i></a>
                </div>`;
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