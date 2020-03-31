import { User } from './user.model';
import { environment } from 'src/environments/environment';

export class Message {



    public id: number;
    public content: string;
    public user_id: string;
    public user: User;
    public created_at: string;
    public conversation_id: number;
    public file: string;
    public file_url: string;


    constructor(obj?: any) {

        if (obj) {
            Object.assign(this, obj);


            if (obj.user) {
                this.user = new User(obj.user);
            }

            if (obj.file) {
                this.file_url = environment.api_url + this.file_url;
            }
        }

    }

}