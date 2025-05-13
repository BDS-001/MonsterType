import Phaser from "phaser";
import settings from "../config/gameConfig";

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player');
        
        // Reference to the scene
        this.scene = scene;
        
        // Add this sprite to the scene
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Set the scale of the player sprite
        this.setScale(settings.SPRITE_SCALE);
    }
    
    update() {
        return
    }
}