import EventEmitter from 'events';

export default class Metroname extends EventEmitter {
    private tempo: Number;
    private isPlaying: boolean = false;

    private intervalWorker: Worker;

    constructor(tempo: Number) {
        super();

        this.setTempo(tempo);
        this.intervalWorker = new Worker('core/InternalWorker.js');
        this.intervalWorker.onmessage = this.onMessageHandler;
    }

    get playing (): boolean {
        return this.isPlaying;
    }

    play(): void {
        if (!this.isPlaying) {
            this.isPlaying = true;
            this.intervalWorker.postMessage({ 'interval': this.tempo });
        };
    }

    pause(): void {
        if (this.isPlaying) {
            this.isPlaying = false;
            this.intervalWorker.postMessage({ 'interval': 0 });
        }
    }

    toggle(): boolean {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
        return this.isPlaying;
    }

    onMessageHandler = (event) => {
        if (event.data === 'tick') {
            this.sheduler();
        } else {
            console.log('Data from intervalWorker: ', event.data);
        }
    }

    sheduler = () => {
        this.emit('tic');
    }

    setTempo(tempo: Number): void {
        if (this.tempo === tempo)
            return;

        this.tempo = tempo;
    }
}