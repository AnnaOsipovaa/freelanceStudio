import config from "../config/config.js";

export class CommonUtils {
    static getLevelHtml(level) {
        let levelHtml = null;

        switch (level) {
            case config.freelancerLevels.junior:
                levelHtml = `<span class="badge badge-info">Junior</span>`
                break;
            case config.freelancerLevels.middle:
                levelHtml = `<span class="badge badge-warning">Middle</span>`
                break;
            case config.freelancerLevels.senior:
                levelHtml = `<span class="badge badge-success">Senior</span>`
                break;
            default:
                levelHtml = `<span class="badge badge-secondary">Unknown</span>`
                break;
        }

        return levelHtml;
    }

    static getStatusOrderHtml(status) {
        const info = {
            name: 'Неизвестно',
            color: 'secondary',
            icon: 'times'
        };

        switch (status) {
            case config.ordersLevels.new:
                info.name = 'Новый';
                info.color = 'secondary';
                info.icon = 'star';
                break;
            case config.ordersLevels.confirmed:
                info.name = 'Подтвержден';
                info.color = 'info';
                info.icon = 'eye';
                break;
            case config.ordersLevels.success:
                info.name = 'Выполнен';
                info.color = 'success';
                info.icon = 'check';
                break;
            case config.ordersLevels.canceled:
                info.name = 'Отменен';
                info.color = 'danger';
                info.icon = 'times';
                break;
        }

        return info;
    }
}