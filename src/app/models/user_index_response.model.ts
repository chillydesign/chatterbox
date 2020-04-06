import { User } from './user.model';

export interface UserIndexResponse {
    users: User[];
    total_count: number;
}
