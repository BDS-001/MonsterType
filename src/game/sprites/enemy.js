import Phaser from "phaser";
import wordBank from "../data/wordbank";

/**
 * Enemy class that spawns with a word that players need to type
 */
export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, minDistance, maxDistance) {
        // Constants
        const ENEMY_SCALE = 8;
        const TEXT_STYLE = { 
            fontFamily: 'Arial', 
            fontSize: 16, 
            color: '#ffffff' 
        };
        
        // Select a random word from the word bank
        const wordCategory = 'easy';
        const wordbankIndex = Math.floor(Math.random() * wordBank[wordCategory].length);
        const word = wordBank[wordCategory][wordbankIndex];
        
        // Calculate random spawn position
        const spawnPosition = calculateRandomPosition(scene.player, minDistance, maxDistance);
        
        // Call the parent constructor
        super(scene, spawnPosition.x, spawnPosition.y, 'enemy');
        
        // Store references
        this.scene = scene;
        this.word = word;
        
        // Add this sprite to the scene
        scene.add.existing(this);
        this.setScale(ENEMY_SCALE);
        
        // Create the text that displays the word
        this.healthText = scene.add.text(spawnPosition.x, spawnPosition.y, this.word, TEXT_STYLE);
        
        // Center the text on the sprite
        this.healthText.setOrigin(0.5);
    }

    updateWord(letter) {
        // Check if the typed letter matches the first letter of the word
        if (letter === this.word[0]) {
            // Remove the first letter from the word
            this.word = this.word.slice(1);
            
            // Update the displayed text
            this.healthText.setText(this.word);
        }
    }

    destroy(fromScene) {
        // First destroy the text
        if (this.healthText) {
            this.healthText.destroy();
        }
        
        // Then call parent's destroy to destroy the sprite itself
        super.destroy(fromScene);
    }
    
    update(letter) {
        // Update word if a letter was typed
        if (letter) {
            this.updateWord(letter);
        }
        
        // Destroy the enemy if the word is complete
        if (this.word.length < 1) {
            this.destroy();
        }
    }
}

function calculateRandomPosition(target, minDistance, maxDistance) {
    const angle = Math.random() * Math.PI * 2;
    const distance = minDistance + Math.random() * (maxDistance - minDistance);
    
    const x = target.x + Math.cos(angle) * distance;
    const y = target.y + Math.sin(angle) * distance;
    
    return { x, y };
}