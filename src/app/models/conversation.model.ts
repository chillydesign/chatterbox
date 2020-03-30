

import { Message } from './message.model';
import { User } from './user.model';

export class Conversation {


    public id: number;
    public title: string;
    public user_id: string;
    public created_at: string;
    public messages_count: number;
    public deleted: number;

    public user: User;
    public messages: Message[];



    constructor(obj?: any) {

        if (obj) {
            Object.assign(this, obj);


            if (obj.messages) {
                this.messages = obj.messages.map(o => new Message(o));
            }
            if (obj.user) {
                this.user = new User(obj.user);
            }

        }

    }

}
