import { v4 as uuidv4 } from 'uuid';
import { Storage } from "./storage";
import { Todo, Priority } from "./todo";

export const TodoList = (projectUuid) => {
    const uuid = uuidv4();
    const currentProjectUuid = projectUuid;
    const todos = [];

    const addTodo = (title = '', description = '', dueDate = new Date(), priority = Priority.Low) => {
        let tempTodo = Todo(title, description, dueDate, priority);
        todos.push(tempTodo);
        Storage.addTodo(currentProjectUuid, uuid, todos);
    }

    const removeTodo = (todoUuid) => {
        todos = todos.filter((todo) => todo.uuid != todoUuid);
        Storage.removeTodo(currentProjectUuid, uuid, todoUuid);
    }

    const updateTodo = () => {

    }

    return { uuid, currentProjectUuid, addTodo, removeTodo, updateTodo }
}