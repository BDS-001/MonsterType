import './style.css';
import Game from './game';

const test = document.createElement('p')
document.getElementById('app').appendChild(test)
new Game(test)