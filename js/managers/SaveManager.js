export default class SaveManager {
    static SAVE_KEY = 'platformer_save';

    static saveGame(data) {
        const saveData = {
            ...data,
            timestamp: Date.now()
        };
        localStorage.setItem(this.SAVE_KEY, JSON.stringify(saveData));
    }

    static loadGame() {
        try {
            const saveData = localStorage.getItem(this.SAVE_KEY);
            return saveData ? JSON.parse(saveData) : null;
        } catch (error) {
            console.error('加载存档失败:', error);
            return null;
        }
    }

    static clearSave() {
        localStorage.removeItem(this.SAVE_KEY);
    }

    static hasSave() {
        return localStorage.getItem(this.SAVE_KEY) !== null;
    }
}
