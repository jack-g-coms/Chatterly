module.exports = class {
    constructor(userId, username, password) {
        this.userId = userId;
        this.username = username;
        this.password = password;
    }

    getSafeView() {
        const userData = Object.assign({}, this);
        delete userData.password;

        return userData;
    }
}