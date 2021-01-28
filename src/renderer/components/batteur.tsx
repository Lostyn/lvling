import React, { Component } from 'react'
import Metronome from '../core/Metronome';

type BatteurState = {
    play: boolean
}

class Batteur extends Component<{}, BatteurState> {
    state = {
        play: false
    }

    audio: HTMLAudioElement = new Audio('static/tap.mp3');
    metronome: Metronome = new Metronome(600);

    componentDidMount() {
        this.metronome.on('tic', this.tap);
        //this.audio.addEventListener('ended', () => this.setState({ play: false }));
    }
    
    componentWillUnmount() {
        this.metronome.off('tic', this.tap);
        //this.audio.removeEventListener('ended', () => this.setState({ play: false }));  
    }

    tap = () => {
        this.audio.play();
    }

    togglePlay = () => {
        this.setState({ play: !this.metronome.playing }, () => {
            this.state.play ? this.metronome.play() : this.metronome.pause();
        });
    }

    render() {
        return (
            <button onClick={this.togglePlay}>{this.state.play ? 'Pause' : 'Play'}</button>
        );
    }
}

export default Batteur;