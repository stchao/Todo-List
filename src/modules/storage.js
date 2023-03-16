import { Todo } from "./todo";
import { Project } from "./project";

export const Storage = (function() {
    const _storageKey = 'todo-list-storage';    
    const _isSessionStorageAvailable = isStorageAvailable('sessionStorage');
    let _local = {};

    const get = () => _local;
    
    const _set = () => {
        if (_isSessionStorageAvailable) {
            sessionStorage.setItem(_storageKey, JSON.stringify(_local));
        }
    }

    const addTodo = (projectUuid) => {
        let tempTodo = Todo();
        _local[projectUuid].todos[tempTodo.uuid] = tempTodo;
        _set();
    };

    const removeTodo = (projectUuid, todoUuid) => {
        let tempTodos = _local[projectUuid].todos;
        tempTodos = tempTodos.filter((todoItem) => todoItem.uuid !== todoUuid);
        _local[projectUuid].todos = tempTodos;
        _set();
    }

    const addProject = () => {
        const tempProject = Project();
        _local[tempProject.uuid] = tempProject;
        _set();
    }

    const removeProject = (project) => {
        delete _local[project.uuid];
        _set();
    }

    const _loadDefaultData = (tempStorageString) => {
        const tempStorage = JSON.parse(tempStorageString);
        const isStorageEmpty = Object.keys(tempStorage).length === 0;

        if (!isStorageEmpty) {
            return tempStorage;
        }
        
        const tempProject = Project('default');
        return { [tempProject.uuid]: tempProject } ;
    }

    // Load initial data from session storage
    (function _loadInitialDataFromSession() {
        if (_isSessionStorageAvailable) {
            const tempStorageString = sessionStorage.getItem(_storageKey) ?? '{}';
            _local = _loadDefaultData(tempStorageString);
        }
    })();

    return { get, addTodo, removeTodo, addProject, removeProject };    
})();

function isStorageAvailable(type) {
    let storage;
    try {
        storage = window[type];
        const x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch (e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}