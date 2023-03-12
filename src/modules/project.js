import { v4 as uuidv4 } from 'uuid';
import { Storage } from "./storage";
import { TodoList } from "./todo";

export const Project = (title = '') => {
    const uuid = uuidv4();
    const title = title;
    const todoLists = {};

    const addTodoList = () => {
        let tempTodoList = TodoList(uuid);
        todoLists[tempTodoList.uuid] = tempTodoList;
        Storage.addTodoList(uuid, tempTodoList.uuid);
    }

    const removeTodoList = (todoListUuid) => {
        delete todoLists[todoListUuid];
        Storage.removeTodoList(uuid, todoListUuid);
    }

    const updateTodoList = () => {

    }

    return { uuid, title, addTodoList, removeTodoList, updateTodoList };
}