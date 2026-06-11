class Sidebar {
    constructor(hashParams, windowLocationObj, context, callbacks = {}) {
        this.hashParams = hashParams;
        this.windowLocationObj = windowLocationObj;
        this.context = context;
        this.callbacks = callbacks;
        this.application = document.body;
        this.sidebarButton = document.getElementById('sidebar-button');
        this.settingsForm = document.getElementById('settings-form');
        this.runTimeElement = document.getElementsByName('runTime')[0];
        this.runTimeElement.value = -1 * this.context.runTime / 1000;
        this.reloadIntervalElement = document.getElementsByName('reloadInterval')[0];
        this.reloadIntervalElement.value = this.context.reloadInterval;
        this.commentElement = document.getElementsByName('comment')[0];
        this.commentElement.value = this.context.comment;
        this.bboxLinkElement = document.getElementById('bbox-link');
        this._updateBboxLink();
    }

    initializeEventListeners() {
        this.sidebarButton.addEventListener('click', () => {
            this.application.classList.toggle('sidebar-visible');
        });

        this.runTimeElement.addEventListener('change', () => {
            this._updateRuntime(-1 * this.runTimeElement.value);
        });

        this.reloadIntervalElement.addEventListener('change', () => {
            this._updateReloadInterval(this.reloadIntervalElement.value);
        });

        this.settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this._updateComment(this.commentElement.value);
        });
        ['keyup', 'change'].forEach((eventName) => {
            this.commentElement.addEventListener(eventName, (e) => {
                this._updateComment(this.commentElement.value);
            });
        });

        window.addEventListener('hashchange', () => {
            this._updateBboxLink();
        });
    }

    _updateRuntime(newRunTime) {
        this._updateHash('runTime', newRunTime);
        this.context.runTime = newRunTime * 1000;
    }

    _updateReloadInterval(value) {
        const minutes = Number(value) >= 1 ? Math.round(Number(value)) : this.context.reloadInterval;
        this.reloadIntervalElement.value = minutes;
        this._updateHash('reloadInterval', minutes);
        this.context.reloadInterval = minutes;
        if (this.callbacks.onReloadIntervalChange) {
            this.callbacks.onReloadIntervalChange();
        }
    }

    _updateComment(comment) {
        this._updateHash('comment', comment);
        this.context.comment = comment;
    }

    _updateHash(key, value) {
        this.hashParams.set(key, value);
        this.windowLocationObj.hash = '#' + this.hashParams.toString();
    }

    _updateBboxLink() {
        const bboxUrl = new URL('bbox.html', this.windowLocationObj.href);
        bboxUrl.hash = this.hashParams;
        this.bboxLinkElement.setAttribute('href', bboxUrl);
    }
}

export { Sidebar };
