import { v4 as uuidv4 } from 'uuid';

export const Priority = {
    Low: 1,
    Medium: 2,
    High: 3
}

export const Todo = (title = '', description = '', dueDate = new Date(), priority = Priority.Low, lastModifiedDate = new Date(), isCompleted = false, currentUuid = '') => {   
    return { 
        uuid: currentUuid || uuidv4(), 
        title, 
        description, 
        dueDate, 
        priority, 
        lastModifiedDate, 
        isCompleted 
    };
}