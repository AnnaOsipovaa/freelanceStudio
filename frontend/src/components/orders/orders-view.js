import config from "../../config/config.js";
import { OrdersService } from "../../services/orders-service.js";
import { CommonUtils } from "../../utils/common-utils.js";
import { HttpUtils } from "../../utils/http-utils.js";
import { UrlUtils } from "../../utils/url-utils.js";

export class OrdersView{
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        const id = UrlUtils.getUrlParam('id');

        if (!id) {
            return this.openNewRoute('/');
        }

        document.getElementById('edit-link').href = '/orders/edit?id=' + id;
        document.getElementById('delete-link').href = '/orders/delete?id=' + id;

        this.getOrder(id);
    }

    async getOrder(id) {
        const response = await OrdersService.getOrder(id);

        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        this.showOrder(response.order);
    }

    showOrder(order) {
        const statusInfo = CommonUtils.getStatusOrderHtml(order.status);
        document.getElementById('orderStatus').classList.add(`bg-${statusInfo.color}`);
        document.getElementById('orderStatusIcon').classList.add(`fa-${statusInfo.icon}`);
        document.getElementById('orderStatusValue').innerText = statusInfo.name;

        if(order.scheduledDate){
            document.getElementById('scheduled').innerText = (new Date(order.scheduledDate)).toLocaleDateString('ru-Ru');
        }

        document.getElementById('complete').innerText = order.completeDate ? (new Date(order.completeDate)).toLocaleDateString('ru-Ru') : '(Заказ не выполнен)';
        
        if(order.deadlineDate){
            document.getElementById('deadline').innerText = (new Date(order.deadlineDate)).toLocaleDateString('ru-Ru');
        }

        document.getElementById('order-number').innerText = order.number;

        if (order.freelancer.avatar) {
            document.getElementById('freelancer-avatar').src = config.host + order.freelancer.avatar;
        }
        document.getElementById('freelancer-name').innerHTML =  `<a href="/freelancers/view?id=${order.freelancer.id}">${order.freelancer.name + ' ' + order.freelancer.lastName}</a>`;

        document.getElementById('description').innerHTML = order.description;
        document.getElementById('owner').innerText = order.owner.name + ' ' + order.owner.lastName;
        document.getElementById('amount').innerText = order.amount;
           
        document.getElementById('createdAt').innerText = order.createdAt ? (new Date(order.createdAt)).toLocaleString('ru-Ru') : '';
    }
}