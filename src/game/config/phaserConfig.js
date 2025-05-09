import Phaser from "phaser";

export const phaserConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#222',
    pixelArt: true,

    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
};