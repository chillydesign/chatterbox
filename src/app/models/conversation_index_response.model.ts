import { Conversation } from './conversation.model';

export interface ConversationIndexResponse {
    conversations: Conversation[];
    total_count: number;
}
