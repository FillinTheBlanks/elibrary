const storage = {
    getItem: async (key) => {
        return localStorage.getItem(key)
    },
    setItem: async (key, value) => {
        localStorage.setItem(key, value)
    },
    removeItem: async (key) => {
        localStorage.removeItem(key)
    }
}

export default storage