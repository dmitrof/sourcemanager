/**
 * Created by Дмитрий on 15.03.2017.
 */

/*
    Результат, который может возвращать документ из базы данных или ошибку
    status - сообщение для клиента
    message - причина для вывода в лог

    data - документ (которого может и не быть)
* */
class FetchDocResult {
    constructor(status, message, data) {
        this.status = status;
        this.message = message;
        this.data = data;
    }
}
/* при получении error некоторые из обработчиков будут отсылать клиенту 404, 500 и так далее*/
class ErrorResult {
    constructor(reason, err) {
        this.reason = reason;
        this.err= err;
    }
}

class SaveResult {
    constructor(status, reason) {
        this.status = status;
        this.reason = reason;
    }
}

module.exports.FetchDocResult = FetchDocResult;
module.exports.ErrorResult = ErrorResult;