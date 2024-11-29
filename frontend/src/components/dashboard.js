import config from "../config/config.js";
import { HttpUtils } from "../utils/http-utils.js";

export class Dashboard {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.init();
    }

    async init() {
        const orders = await this.getOrders();
        if (orders) {
            this.loadOrdersInfo(orders);
            this.loadCalendarInfo(orders);
        }
    }

    async getOrders() {
        const result = await HttpUtils.request('/orders');

        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.error || !result.response || (result.response && (result.response.error || !result.response.orders))) {
            return alert('Возникла ошибка при запросе заказов. Обратитесь в поддержку');
        }

        return result.response.orders;
    }

    loadOrdersInfo(orders) {
        document.getElementById('ordersAllNumber').innerHTML = orders.length;
        document.getElementById('ordersCompletedNumber').innerHTML = orders.filter(item => item.status === config.ordersLevels.success).length;
        document.getElementById('ordersProgressNumber').innerHTML = orders.filter(item => [config.ordersLevels.confirmed, config.ordersLevels.new].includes(item.status)).length;
        document.getElementById('ordersCancelledNumber').innerHTML = orders.filter(item => item.status === config.ordersLevels.canceled).length;
    }

    loadCalendarInfo(orders) {
        const calendarEl = document.getElementById('calendar');

        const date = new Date()
        const d = date.getDate()
        const m = date.getMonth()
        const y = date.getFullYear()

        const events = [];

        orders.forEach(order => {
            let color = null;
            if (order.status === config.ordersLevels.success) {
                color = 'gray';
            }

            if (order.scheduledDate) {
                const scheduledDate = new Date(order.scheduledDate);
                events.push({
                    title: `${order.freelancer.name} ${order.freelancer.lastName} выполняет заказ ${order.number}`,
                    start: scheduledDate,
                    backgroundColor: color ? color : '#00c0ef',
                    borderColor: color ? color : '#00c0ef',
                    allDay: true
                })
            }

            if (order.deadlineDate) {
                const deadlineDate = new Date(order.deadlineDate);
                events.push({
                    title: `Дедлайн заказа ${order.number}`,
                    start: deadlineDate,
                    backgroundColor: color ? color : '#f39c12',
                    borderColor: color ? color : '#f39c12',
                    allDay: true
                })
            }

            if (order.completeDate) {
                const completeDate = new Date(order.completeDate);
                events.push({
                    title: `Заказа ${order.number} выполнен фрилансером ${order.freelancer.name}`,
                    start: completeDate,
                    backgroundColor: color ? color : '#00a65a',
                    borderColor: color ? color : '#00a65a',
                    allDay: true
                })
            }
        });

        const calendar = new FullCalendar.Calendar(calendarEl, {
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: ''
            },
            themeSystem: 'bootstrap',
            firstDay: 1,
            locale: 'ru',
            events: events
        });

        calendar.render();
    }
}