export function remove(key) {
    window.localStorage.removeItem(key)
}
export function set(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value))
}

export function get(key) {
    const d = window.localStorage.getItem(key)
    if(d && d != 'undefined') {
        return JSON.parse(d)
    }
    return d
}


export function arrAdd(key, item) {
    const arr = get(key)
    if(arr) {
        arr.unshift(item)
        set(key, arr)
    }else {
        set(key, [item])
    }
}


const roleName = "chatai:role"

export function roleGet() {
    const arr = get(roleName)
    if(!arr) {
        return []
    }else {
        return arr
    }
}

export function roleAdd(item) {
    arrAdd(roleName, item)
}

export function roleRemove(roleId) {
    const arr = roleGet()
    const newArr = arr.filter(e => e.id != roleId)
    set(roleName, newArr)
    clearRecords(roleId)
}

const recordsName = "chatai:records:"

export function loadRecords(roleId) {
    const arr = get(recordsName + roleId)
    if(!arr) return []
    console.log("load records");
    return arr
}

export function addRecord(roleId, item) {
    const arr = loadRecords(roleId)
    arr.push(item)
    set(recordsName + roleId, arr)
}

export function clearRecords(roleId) {
    window.localStorage.removeItem(recordsName + roleId)
    // set(recordsName + roleId, [])
}
