import { OrdersService } from "../../services/orders-service.js";
import { HttpUtils } from "../../utils/http-utils.js";
import { UrlUtils } from "../../utils/url-utils.js";

export class OrdersDelete{
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        const id = UrlUtils.getUrlParam('id');
        
        if (!id) {
            return this.openNewRoute('/');
        }

        this.deleteFreelancer(id);
    }

    async deleteFreelancer(id) {
        const response = await OrdersService.deleteOrder(id);

        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        return this.openNewRoute('/orders');
    }
}