/**
 * Created by Дмитрий on 15.03.2017.
 */

/*
    Результат, который может возвращать документ из базы данных или ошибку
    status - сообщение для клиента
    message - причина для вывода в лог

    data - документ (которого может и не быть)
* */
module.exports.FetchDocResult = class FetchDocResult {
    constructor(success, message, data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }
};
/* при получении error некоторые из обработчиков будут отсылать клиенту 404, 500 и так далее*/
module.exports.ErrorResult = class ErrorResult {
    constructor(reason, err) {
        this.reason = reason;
        this.err= err;
    }
};
/* success - булево поле, указывающее на успешность операции. Message - для вывода пользователю*/
module.exports.CreateResult = class CreateResult {
    constructor(success, message, err) {
        this.status = success;
        this.message = message;
        this.err = err;
    }
};
/* результат обращения к внешнему модулю по http. Оборачивает только ответы от модуля, возвращается ontology_provider-м */
module.exports.HttpGetResult = class HttpGetResult {
    constructor(success, message, data, err) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.err = err;
    }
};

