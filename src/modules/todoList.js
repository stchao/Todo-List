import { isStorageAvailable, addTodoItemToStorage, removeTodoItemFromStorage } from "./storage";
import { Todo, Priority } from "./todo";
import { v4 as uuidv4 } from 'uuid';

export const TodoList = (projectUuid) => {
    const uuid = uuidv4();
    const currentProjectUuid = projectUuid;
    const isSessionStorageAvailable = isStorageAvailable('sessionStorage');
    const todos = [];

    const addTodo = (title = '', description = '', dueDate = new Date(), priority = Priority.Low) => {
        let tempTodo = Todo(title, description, dueDate, priority);
        todos.push(tempTodo);

        if (isSessionStorageAvailable) {
            addTodoItemToStorage(currentProjectUuid, uuid, todos);
        }
    }

    const removeTodo = (todoUuid) => {
        todos = todos.filter((todo) => todo.uuid != todoUuid);

        if (isSessionStorageAvailable) {
            removeTodoItemFromStorage(currentProjectUuid, uuid, todoUuid);
        }
    }

    const updateTodo = () => {

    }

    return { uuid, currentProjectUuid, addTodo, removeTodo, updateTodo }
}