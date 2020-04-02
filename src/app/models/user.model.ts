export class User {
    public username: string;
    public email: string;
    public created_at: string;
    public password_confirmation: string;
    public password: string;
    public current_password: string;
    public id: number;
    public is_an_admin: boolean;
    public is_approved: boolean;

    constructor(obj?: any) {

        if (obj) {
            Object.assign(this, obj);
        }

    }


}
