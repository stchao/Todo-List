import { isStorageAvailable, addTodoListToStorage, removeTodoListFromStorage } from "./storage";
import { v4 as uuidv4 } from 'uuid';
import { TodoList } from "./todo";

export const Project = (title = 'default') => {
    const uuid = uuidv4();
    const title = title;
    const isSessionStorageAvailable = isStorageAvailable('sessionStorage');
    const todoLists = {};

    const addTodoList = () => {
        let tempTodoList = TodoList(uuid);
        todoLists[tempTodoList.uuid] = tempTodoList;

        if (isSessionStorageAvailable) {
            addTodoListToStorage(uuid, tempTodoList.uuid);
        }
    }

    const removeTodoList = (todoListUuid) => {
        delete todoLists[todoListUuid];

        if (isSessionStorageAvailable) {
            removeTodoListFromStorage(uuid, todoListUuid);
        }
    }

    const updateTodoList = () => {

    }

    return { uuid, title, addTodoList, removeTodoList, updateTodoList };
}