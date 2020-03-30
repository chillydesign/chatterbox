import { User } from './user.model';

export class Message {



    public id: number;
    public content: string;
    public user_id: string;
    public user: User;
    public created_at: string;
    public conversation_id: number;


    constructor(obj?: any) {

        if (obj) {
            Object.assign(this, obj);


            if (obj.user) {
                this.user = new User(obj.user);
            }
        }

    }

}