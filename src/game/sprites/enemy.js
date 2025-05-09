import Phaser from "phaser";

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'enemy');
        this.scene = scene;
        scene.add.existing(this);
        this.setScale(8);
    }
    
    update() {
        return
    }
}