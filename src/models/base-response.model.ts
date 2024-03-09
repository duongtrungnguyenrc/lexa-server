export default class BaseResponseModel {
    private statusCode?: number;
    private message: string;
    private data?: any;

    constructor(message: string, data?: any, statusCode?: number) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
    }
}
