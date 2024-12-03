export class ValidationUtils {
    static validateForm(validations) {
        let isValid = true;

        validations.forEach(item => {
            if (!ValidationUtils.validateField(item.element, item.options)) {
                isValid = false;
            }
        });

        return isValid;
    }

    static validateField(input, options) {
        let condition = input.value;
        if (options) {
            if (options.hasOwnProperty('pattern')) {
                condition = input.value && input.value.match(options.pattern);
            } else if (options.hasOwnProperty('compareTo')) {
                condition = input.value && input.value === options.compareTo;
            }
        }

        if (condition) {
            input.classList.remove('is-invalid');
            return true;
        } else {
            input.classList.add('is-invalid');
            return false;
        }
    }
}