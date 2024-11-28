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

        this.calendarScheduledDate = null;
        this.calendarCompleteDate = null;
        this.calendarDeadlineDate = null;

        this.init(id);
    }

    async init(id) {
        const order = await this.getOrder(id);
        if (order) {
            this.showOrder(order);
            const freelancers = await this.getFreelancers();
            if (freelancers) {
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
            if (e.date) {
                this.calendarCompleteDate = e.date;
            } else {
                if (this.orderOriginalData.completeDate) {
                    this.calendarCompleteDate = false;
                }else{
                    this.calendarCompleteDate = null;
                }
            }
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
            const changedData = {};
            if (parseInt(this.amountElement.value) !== parseInt(this.orderOriginalData.amount)) {
                changedData.amount = parseInt(this.amountElement.value);
            }
            if (this.descriptionElement.value !== this.orderOriginalData.description) {
                changedData.description = this.descriptionElement.value;
            }
            if (this.statusSelectElement.value !== this.orderOriginalData.status) {
                changedData.status = this.statusSelectElement.value;
            }
            if (this.freelancerSelectElement.value !== this.orderOriginalData.freelancer.id) {
                changedData.freelancer = this.freelancerSelectElement.value;
            }
            if (this.calendarCompleteDate || this.calendarCompleteDate === false) {
                changedData.completeDate = this.calendarCompleteDate ? this.calendarCompleteDate.toISOString() : null;
            }
            if (this.calendarDeadlineDate) {
                changedData.deadlineDate = this.calendarDeadlineDate.toISOString();
            }
            if (this.calendarScheduledDate) {
                changedData.scheduledDate = this.calendarScheduledDate.toISOString();
            }

            if (Object.keys(changedData).length > 0) {
                const result = await HttpUtils.request('/orders/' + this.orderOriginalData.id, true, 'PUT', changedData);

                if (result.redirect) {
                    return this.openNewRoute(result.redirect);
                }

                if (result.error || !result.response || (result.response && result.response.error)) {
                    return alert('Возникла ошибка при обновлении заказа. Обратитесь в поддержку');
                }

                return this.openNewRoute('/orders/view?id=' + this.orderOriginalData.id);
            }
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

        return isValid;
    }
}