// File: ./src/game/entities/projectile.js
import Phaser from "phaser";
import settings from "../config/gameConfig";

export default class Projectile extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y) {
        super(scene, x, y, 'projectile');
        
        // Reference to the scene
        this.scene = scene;
        
        // Add this sprite to the scene
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Set the scale of the projectile
        this.setScale(settings.SPRITE_SCALE / 2);
        
        // Set active and visible to false initially
        this.setActive(false);
        this.setVisible(false);
        
        this.speed = 2000;
    }
    
    fire(x, y, targetX, targetY) {
        // Position the projectile at the starting point
        this.setPosition(x, y);
        
        // Make it active and visible
        this.setActive(true);
        this.setVisible(true);
        
        // Calculate direction towards target
        const directionX = targetX - x;
        const directionY = targetY - y;
        
        // Normalize the direction vector
        const length = Math.sqrt(directionX * directionX + directionY * directionY);
        const normalizedX = directionX / length;
        const normalizedY = directionY / length;
        
        // Set velocity based on direction and speed
        this.setVelocity(normalizedX * this.speed, normalizedY * this.speed);
        
        // Rotate projectile to face direction of travel
        this.rotation = Math.atan2(directionY, directionX);
    }
    
    update() {
        // Deactivate when projectile leaves the screen
        const bounds = this.scene.physics.world.bounds;
        if (this.x < bounds.x || this.x > bounds.width || 
            this.y < bounds.y || this.y > bounds.height) {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}