import { FreelancersService } from "../../services/freelancers-service.js";
import { UrlUtils } from "../../utils/url-utils.js";

export class FreelancesDelete{
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        const id = UrlUtils.getUrlParam('id');

        if (!id) {
            return this.openNewRoute('/');
        }

        this.deleteFreelancer(id);
    }

    async deleteFreelancer(id) {
        const response = await FreelancersService.deleteFreelancer(id);

        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        return this.openNewRoute('/freelancers');
    }
}