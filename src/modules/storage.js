import { Todo } from "./todo";
import { Project } from "./project";

export const Storage = (() => {
    const _storageKey = 'todo-list-storage';    
    const _isSessionStorageAvailable = isStorageAvailable('sessionStorage');
    let _local = {};
    let _activeProjectUuid = '';
    let _defaultUuid = '';

    const _set = () => {
        if (_isSessionStorageAvailable) {
            sessionStorage.setItem(_storageKey, JSON.stringify(_local));
        }
    }

    const get = () => _local;

    const getActiveProject = (getUuid = false) => getUuid ? _activeProjectUuid : _local[_activeProjectUuid];

    const setActiveProject = (uuid = '') => {
        _activeProjectUuid = uuid || _defaultUuid;
    }  

    const addTodo = () => {
        let tempTodo = Todo();
        _local[_activeProjectUuid].todos[tempTodo.uuid] = tempTodo;
        _set();
        return tempTodo;
    };

    const updateTodo = (todo) => {
        _local[_activeProjectUuid].todos[todo.uuid] = todo;
        _set();
    }

    const removeTodo = (todoUuid) => {
        let tempTodos = _local[_activeProjectUuid].todos;
        delete tempTodos[todoUuid];
        _local[_activeProjectUuid].todos = tempTodos;
        _set();
    }

    const addProject = () => {
        const tempProject = Project();
        _local[tempProject.uuid] = tempProject;
        _set();
        return tempProject;
    }

    const updateProjectTitle = (project) => {
        _local[project.uuid].title = project.title;
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
            _set();

            for (const projectUuid in _local) {
                if (_local[projectUuid].title === 'default') {
                    _defaultUuid = projectUuid;
                    break;
                }
            }
            
            setActiveProject();
        }
    })();

    return { get, getActiveProject, setActiveProject, addTodo, updateTodo, removeTodo, addProject, updateProjectTitle, removeProject };    
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