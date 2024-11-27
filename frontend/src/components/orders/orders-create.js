import { HttpUtils } from "../../utils/http-utils.js";

export class OrdersCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.freelancersSelect = document.getElementById('freelancerSelect');

        document.getElementById('saveButton').addEventListener('click', this.saveOrder.bind(this));

        this.amountElement = document.getElementById('amount');
        this.descriptionElement = document.getElementById('description');
        this.statusSelectElement = document.getElementById('statusSelect');
        this.freelancerSelectElement = document.getElementById('freelancerSelect');
        this.scheduledCardElement = document.getElementById('scheduledCard');
        this.deadlineCardElement = document.getElementById('deadlineCard');

        this.calendarScheduledDate = false;
        this.calendarCompleteDate = false;
        this.calendarDeadlineDate = false;

        this.initCalendar();
        this.getFreelancers();
    }

    initCalendar() {
        const calendarScheduledElement = $('#calendarScheduled');
        const calendarCompleteElement = $('#calendarComplete');
        const calendarDeadlineElement = $('#calendarDeadline');

        calendarScheduledElement.datetimepicker({
            inline: true,
            icons: {
                time: 'far fa-clock'
            },
            locale: 'ru',
            useCurrent: false
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
            }
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
            useCurrent: false
        });
        calendarDeadlineElement.on('change.datetimepicker', (e) => {
            this.calendarDeadlineDate = e.date;
        });
    }

    async getFreelancers() {
        const result = await HttpUtils.request('/freelancers');

        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.error || !result.response || (result.response && (result.response.error || !result.response.freelancers))) {
            return alert('Возникла ошибка при запросе фрилансеров. Обратитесь в поддержку');
        }

        this.fillFreelancersSelect(result.response.freelancers);
    }

    fillFreelancersSelect(freelancers) {
        freelancers.forEach(element => {
            const optionElement = document.createElement('option');
            optionElement.value = element.id;
            optionElement.innerText = element.name + ' ' + element.lastName;
            this.freelancersSelect.appendChild(optionElement);
        });

        $('.select2bs4').select2({
            theme: 'bootstrap4'
        })
    }

    async saveOrder(e) {
        e.preventDefault();

        if (this.validateForm()) {
            const params = {
                description: this.descriptionElement.value,
                deadlineDate: this.deadlineDate,
                scheduledDate: this.scheduledDate,
                freelancer: this.freelancerSelectElement.value,
                status: this.statusSelectElement.value,
                amount: parseInt(this.amountElement.value)
            }

            if (this.completeDate) {
                params.completeDate = this.completeDate;
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