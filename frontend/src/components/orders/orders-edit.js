import { HttpUtils } from "../../utils/http-utils.js";

export class OrdersEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');

        if (!id) {
            return this.openNewRoute('/');
        }

        this.freelancersSelect = document.getElementById('freelancerSelect');

        document.getElementById('updateButton').addEventListener('click', this.updateOrder.bind(this));

        this.orderNumberElement = document.getElementById('orderNumber');
        this.amountElement = document.getElementById('amount');
        this.descriptionElement = document.getElementById('description');
        this.statusSelectElement = document.getElementById('statusSelect');
        this.freelancerSelectElement = document.getElementById('freelancerSelect');
        this.scheduledCardElement = document.getElementById('scheduledCard');
        this.deadlineCardElement = document.getElementById('deadlineCard');

        this.calendarScheduledDate = false;
        this.calendarCompleteDate = false;
        this.calendarDeadlineDate = false;

        this.init(id);
    }

    async init(id){
        const order = await this.getOrder(id);
        if(order){
            this.showOrder(order);
            const freelancers = await this.getFreelancers();
            if(freelancers){
                this.fillFreelancersSelect(freelancers, order.freelancer.id);
            }
            this.initCalendar(order);
        }
    }

    initCalendar(order) {
        const calendarScheduledElement = $('#calendarScheduled');
        const calendarCompleteElement = $('#calendarComplete');
        const calendarDeadlineElement = $('#calendarDeadline');

        calendarScheduledElement.datetimepicker({
            inline: true,
            icons: {
                time: 'far fa-clock'
            },
            locale: 'ru',
            useCurrent: false,
            date: order.scheduledDate
        });
        calendarScheduledElement.on('change.datetimepicker', (e) => {
            this.calendarScheduledDate = e.date;
        });

        calendarCompleteElement.datetimepicker({
            inline: true,
            icons: {
                time: 'far fa-clock'
            },
            locale: 'ru',
            useCurrent: false,
            buttons: {
                showClear: true
            },
            date: order.completeDate
        });
        calendarCompleteElement.on('change.datetimepicker', (e) => {
            this.calendarCompleteDate = e.date;
        });

        calendarDeadlineElement.datetimepicker({
            inline: true,
            icons: {
                time: 'far fa-clock'
            },
            locale: 'ru',
            useCurrent: false,
            date: order.deadlineDate
        });
        calendarDeadlineElement.on('change.datetimepicker', (e) => {
            this.calendarDeadlineDate = e.date;
        });
    }

    async getOrder(id) {
        const result = await HttpUtils.request('/orders/' + id);

        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.error || !result.response || (result.response && result.response.error)) {
            return alert('Возникла ошибка при запросе заказа. Обратитесь в поддержку');
        }

        this.orderOriginalData = result.response;
        return result.response;
    }

    showOrder(order) {
        this.orderNumberElement.innerText = order.number;
        this.orderNumberElement.href = `/orders/view?id=${order.id}`;
        this.amountElement.value = order.amount;
        this.descriptionElement.value = order.description;

        for (let i = 0; i < this.statusSelectElement.options.length; i++) {
            if (this.statusSelectElement.options[i].value === order.status) {
                this.statusSelectElement.selectedIndex = i;
                break;
            }
        }
    }

    async getFreelancers() {
        const result = await HttpUtils.request('/freelancers');

        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.error || !result.response || (result.response && (result.response.error || !result.response.freelancers))) {
            return alert('Возникла ошибка при запросе фрилансеров. Обратитесь в поддержку');
        }

        return result.response.freelancers;
    }

    fillFreelancersSelect(freelancers, id) {
        freelancers.forEach(element => {
            const optionElement = document.createElement('option');
            optionElement.value = element.id;
            optionElement.innerText = element.name + ' ' + element.lastName;
            if (element.id === id) {
                optionElement.selected = true;
            }
            this.freelancersSelect.appendChild(optionElement);
        });

        $('.select2bs4').select2({
            theme: 'bootstrap4'
        })
    }

    async updateOrder(e) {
        e.preventDefault();

        if (this.validateForm()) {
            const params = {
                description: this.descriptionElement.value,
                deadlineDate: this.calendarDeadlineDate.toISOString(),
                scheduledDate: this.calendarScheduledDate.toISOString(),
                freelancer: this.freelancerSelectElement.value,
                status: this.statusSelectElement.value,
                amount: parseInt(this.amountElement.value)
            }

            if (this.calendarCompleteDate) {
                params.completeDate = this.calendarCompleteDate.toISOString();
            }

            const result = await HttpUtils.request('/orders', true, 'POST', params);

            if (result.redirect) {
                return this.openNewRoute(result.redirect);
            }

            if (result.error || !result.response || (result.response && result.response.error)) {
                return alert('Возникла ошибка при создании заказа. Обратитесь в поддержку');
            }

            return this.openNewRoute('/orders/view?id=' + result.response.id);
        }
    }

    validateForm() {
        let isValid = true;

        let textInputArray = [
            this.amountElement,
            this.descriptionElement,
        ];

        textInputArray.forEach(input => {
            if (input.value) {
                input.classList.remove('is-invalid');
            } else {
                input.classList.add('is-invalid');
                isValid = false;
            }
        });


        if (this.calendarScheduledDate) {
            this.scheduledCardElement.classList.remove('is-invalid');
        } else {
            this.scheduledCardElement.classList.add('is-invalid');
            isValid = false;
        }

        if (this.calendarCompleteDate) {
            this.deadlineCardElement.classList.remove('is-invalid');
        } else {
            this.deadlineCardElement.classList.add('is-invalid');
            isValid = false;
        }

        return isValid;
    }
}