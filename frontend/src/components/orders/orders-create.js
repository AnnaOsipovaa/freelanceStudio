export class OrdersCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        $('#calendar-scheduled').datetimepicker({
            inline: true,
            icons: {
                time: 'far fa-clock'
            },
            locale: 'ru',
            useCurrent: false
        });

        $('#calendar-complete').datetimepicker({
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

        $('#calendar-dedline').datetimepicker({
            inline: true,
            icons: {
                time: 'far fa-clock'
            },
            locale: 'ru',
            useCurrent: false
        });
    }
}