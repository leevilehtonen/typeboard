import { HttpError } from "routing-controllers";

export class ConflictError extends HttpError {
    constructor(item: string) {
        super(409, `There was a conflict in ${item ? item : "params"}`);
    }
    public toJson() {
        return {
            status : this.httpCode,
            name : this.name,
            message: this.message,
        };
    }
}
