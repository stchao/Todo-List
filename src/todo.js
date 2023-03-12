import { isStorageAvailable, addTodoItemToStorage, removeTodoItemFromStorage } from "./storage";
import { v4 as uuidv4 } from 'uuid';

const Priority = {
    Low: 1,
    Medium: 2,
    High: 3
}

const TodoItem = (title = '', description = '', dueDate = new Date(), priority = Priority.Low, isCompleted = false) => {
    return { 
        uuid: uuidv4(), 
        title, 
        description, 
        dueDate, 
        priority, 
        lastModifiedDate: new Date(), 
        isCompleted 
    };
}

export const TodoList = (projectUuid) => {
    const uuid = uuidv4();
    const currentProjectUuid = projectUuid;
    const isSessionStorageAvailable = isStorageAvailable('sessionStorage');
    const todoItems = [];

    const addTodoItem = (title = '', description = '', dueDate = new Date(), priority = Priority.Low) => {
        let tempTodo = TodoItem(title, description, dueDate, priority);
        todoItems.push(tempTodo);

        if (isSessionStorageAvailable) {
            addTodoItemToStorage(uuid, currentProjectUuid, todoItems);
        }
    }

    const removeTodoItem = (todoItemUuid) => {
        todoItems = todoItems.filter((todoItem) => todoItem.uuid != todoItemUuid);

        if (isSessionStorageAvailable) {
            removeTodoItemFromStorage(uuid, currentProjectUuid, todoItemUuid);
        }
    }

    const updateTodoItem = () => {

    }

    return { uuid, currentProjectUuid, addTodoItem, removeTodoItem, updateTodoItem }
}


