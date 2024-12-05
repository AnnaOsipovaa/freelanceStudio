import { OrdersService } from "../../services/orders-service.js";
import { CommonUtils } from "../../utils/common-utils.js";

export class OrdersList {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.getOrders();
    }

    async getOrders() { 
        const response = await OrdersService.getOrders();

        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        this.showRecords(response.orders);
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

            trElement.insertCell().innerHTML = CommonUtils.generateGridToolsColumn('orders', element.id);
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