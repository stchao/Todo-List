export function isStorageAvailable(type) {
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

export function addTodoItemToStorage(uuid, currentProjectUuid, todoItems) {
    let tempProjectString = sessionStorage.getItem(currentProjectUuid);
    let tempProject = {};

    if (tempProjectString !== null) {
        tempProject = JSON.parse(tempProjectString);
    }

    tempProject[uuid] = todoItems;
    sessionStorage.setItem(currentProjectUuid, JSON.stringify(tempProject));
}

export function removeTodoItemFromStorage(uuid, currentProjectUuid, todoItemUuid) {
    let tempProjectString = sessionStorage.getItem(currentProjectUuid);
    let tempProject = {};

    if (tempProjectString !== null) {
        tempProject = JSON.parse(tempProjectString);
    }

    let tempTodoItems = tempProject[uuid];
    tempTodoItems = tempTodoItems.filter((todoItem) => todoItem.uuid !== todoItemUuid);
    tempProject[uuid] = tempTodoItems;
    sessionStorage.setItem(currentProjectUuid, JSON.stringify(tempProject));
}