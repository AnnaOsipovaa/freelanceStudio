import { HttpUtils } from "../../utils/http-utils.js";
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
        const result = await HttpUtils.request('/freelancers/' + id, true, 'DELETE');

        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.error || !result.response || (result.response && result.response.error)) {
            return alert('Возникла ошибка при удалении фрилансера. Обратитесь в поддержку');
        }

        return this.openNewRoute('/freelancers');
    }
}