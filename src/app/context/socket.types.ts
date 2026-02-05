export const SocketEvent = {
    JOIN_WORKSPACE: 'join_workspace',
    LEAVE_WORKSPACE: 'leave_workspace',
    JOIN_PAGE: 'join_page',
    LEAVE_PAGE: 'leave_page',

    PAGE_UPDATED: 'page_updated',
    PAGE_PUBLISHED: 'page_published',
    COMMENT_ADDED: 'comment_added',
    ACTIVITY_CREATED: 'activity_created',

    USER_EDITING: 'user_editing',
    USER_STOPPED_EDITING: 'user_stopped_editing',

    ERROR: 'error',
} as const;

export type SocketEvent = typeof SocketEvent[keyof typeof SocketEvent];

export interface EditingUser {
    userId: string;
    firstName: string;
    lastName: string;
    pageId: string;
}
