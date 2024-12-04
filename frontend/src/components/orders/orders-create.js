import { HttpUtils } from "../../utils/http-utils.js";
import { ValidationUtils } from "../../utils/validation-utils.js";

export class OrdersCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.freelancersSelect = document.getElementById('freelancerSelect');

        document.getElementById('saveButton').addEventListener('click', this.saveOrder.bind(this));

        this.findElements();

        this.calendarScheduledDate = false;
        this.calendarCompleteDate = false;
        this.calendarDeadlineDate = false;

        this.initCalendar();
        this.getFreelancers();
    }

    findElements(){
        this.amountElement = document.getElementById('amount');
        this.descriptionElement = document.getElementById('description');
        this.statusSelectElement = document.getElementById('statusSelect');
        this.freelancerSelectElement = document.getElementById('freelancerSelect');
        this.scheduledCardElement = document.getElementById('scheduledCard');
        this.deadlineCardElement = document.getElementById('deadlineCard');
    }

    initCalendar() {
        const calendarScheduledElement = $('#calendarScheduled');
        const calendarCompleteElement = $('#calendarComplete');
        const calendarDeadlineElement = $('#calendarDeadline');

        const calendarOptions = {
            inline: true,
            icons: {
                time: 'far fa-clock'
            },
            locale: 'ru',
            useCurrent: false
        }
        
        calendarScheduledElement.datetimepicker(calendarOptions);
        calendarScheduledElement.on('change.datetimepicker', (e) => {
            this.calendarScheduledDate = e.date;
        });

        calendarDeadlineElement.datetimepicker(calendarOptions);
        calendarDeadlineElement.on('change.datetimepicker', (e) => {
            this.calendarDeadlineDate = e.date;
        });

        calendarOptions.buttons = {
            showClear: true
        };

        calendarCompleteElement.datetimepicker(calendarOptions);
        calendarCompleteElement.on('change.datetimepicker', (e) => {
            this.calendarCompleteDate = e.date;
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

        this.validations = [
            { element: this.amountElement },
            { element: this.descriptionElement },
            { element: this.scheduledCardElement, options: { checkProperty: this.calendarScheduledDate } },
            { element: this.deadlineCardElement, options: { checkProperty: this.calendarDeadlineDate } }
        ];

        if (ValidationUtils.validateForm(this.validations)) {
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
}