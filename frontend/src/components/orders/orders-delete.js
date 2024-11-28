import { HttpUtils } from "../../utils/http-utils.js";

export class OrdersDelete{
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');

        if (!id) {
            return this.openNewRoute('/');
        }

        this.deleteFreelancer(id);
    }

    async deleteFreelancer(id) {
        const result = await HttpUtils.request('/orders/' + id, true, 'DELETE');

        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.error || !result.response || (result.response && result.response.error)) {
            return alert('Возникла ошибка при удалении заказа. Обратитесь в поддержку');
        }

        return this.openNewRoute('/orders');
    }
}