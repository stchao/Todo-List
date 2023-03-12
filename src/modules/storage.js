export const Storage = (function() {
    const _storageKey = 'todo-list-storage';
    const _local = {};
    const _isSessionStorageAvailable = isStorageAvailable('sessionStorage');

    const getProject = () => _local;
    const _setProject = () => {
        if (_isSessionStorageAvailable) {
            sessionStorage.setItem(_storageKey, JSON.stringify(_local));
        }
    }

    const addTodo = (projectUuid, todoListUuid, todos) => {
        _local[projectUuid][todoListUuid] = todos;
        _setProject();
    };

    const removeTodo = (projectUuid, todoListUuid, todoUuid) => {
        let tempTodos = _local[projectUuid][todoListUuid];
        tempTodos = tempTodos.filter((todoItem) => todoItem.uuid !== todoUuid);
        _local[projectUuid][todoListUuid] = tempTodos;
        _setProject();
    }

    const addTodoList = (projectUuid, todoListUuid) => {
        _local[projectUuid][todoListUuid] = [];
        _setProject();
    }

    const removeTodoList = (projectUuid, todoListUuid) => {
        delete _local[projectUuid][todoListUuid];
        _setProject();
    }

    return { getProject, addTodo, removeTodo, addTodoList, removeTodoList };    
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