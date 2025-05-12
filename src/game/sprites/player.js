import Phaser from "phaser";

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player');
        
        // Reference to the scene
        this.scene = scene;
        
        // Add this sprite to the scene
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Constants
        const PLAYER_SCALE = 8;
        
        // Set the scale of the player sprite
        this.setScale(PLAYER_SCALE);
    }
    
    update() {
        return
    }
}