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

export function addTodoItemToStorage(projectUuid, todoListUuid, todos) {
    let tempProjectString = sessionStorage.getItem(projectUuid);
    let tempProject = {};

    if (tempProjectString !== null) {
        tempProject = JSON.parse(tempProjectString);
    }

    tempProject[todoListUuid] = todos;
    sessionStorage.setItem(projectUuid, JSON.stringify(tempProject));
}

export function removeTodoItemFromStorage(projectUuid, todoListUuid, todoUuid) {
    let tempProjectString = sessionStorage.getItem(projectUuid);
    let tempProject = {};

    if (tempProjectString !== null) {
        tempProject = JSON.parse(tempProjectString);
    }

    let tempTodoItems = tempProject[todoListUuid];
    tempTodoItems = tempTodoItems.filter((todoItem) => todoItem.uuid !== todoUuid);
    tempProject[todoListUuid] = tempTodoItems;
    sessionStorage.setItem(projectUuid, JSON.stringify(tempProject));
}

export function addTodoListToStorage(projectUuid, todoListUuid) {
    let tempProjectString = sessionStorage.getItem(projectUuid);
    let tempProject = {};

    if (tempProjectString !== null) {
        tempProject = JSON.parse(tempProjectString);
    }

    tempProject[todoListUuid] = [];
    sessionStorage.setItem(projectUuid, JSON.stringify(tempProject));
}

export function removeTodoListFromStorage(projectUuid, todoListUuid) {
    let tempProjectString = sessionStorage.getItem(projectUuid);
    let tempProject = {};

    if (tempProjectString !== null) {
        tempProject = JSON.parse(tempProjectString);
    }

    delete tempProject[todoListUuid];
    sessionStorage.setItem(currentProjectUuid, JSON.stringify(tempProject));
}