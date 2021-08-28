class EventEmitter {
    constructor() {
        this.events = {};
    }
    subscribe(subject, listener) {
        if (typeof this.events[subject] !== 'object') {
            this.events[subject] = [];
        }
        this.events[subject].push(listener);
        return () => this.removeListener(subject, listener);
    }

    removeListener(subject, listener) {
        if (typeof this.events[subject] === 'object') {
            const idx = this.events[subject].indexOf(listener);
            if (idx > -1) {
                this.events[subject].splice(idx, 1);
            }
        }
    }
    emit(subject, ...args) {
        if (typeof this.events[subject] === 'object') {
            this.events[subject].forEach(listener => listener.apply(this, args));
        }
    }

    once(subject, listener) {
        const remove = this.on(subject, (...args) => {
            remove();
            listener.apply(this, args);
        });
    }
};
