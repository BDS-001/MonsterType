import Phaser from "phaser";
import wordBank from "../data/wordbank";

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, minDistance, maxDistance) {

        //calculate the word index
        const wordbankIndex = Math.floor(Math.random() * wordBank['easy'].length)
        
        //calculate the random coordiantes
        const angle = Math.random() * Math.PI * 2
        const distance = minDistance + Math.random() * (maxDistance - minDistance)
        const x = scene.player.x + Math.cos(angle) * distance;
        const y = scene.player.y + Math.sin(angle) * distance;

        super(scene, x, y, 'enemy');
        this.scene = scene;
        scene.add.existing(this);
        this.setScale(8);
        this.word = wordBank['easy'][wordbankIndex]
        
        this.healthText = scene.add.text(x, y, this.word, { 
            fontFamily: 'Arial', 
            fontSize: 16, 
            color: '#ffffff' 
        });
        
        // Center the text on the sprite
        this.healthText.setOrigin(0.5);
    }

    updateWord(letter) {
        if (letter === this.word[0]) this.word = this.word.slice(1)
        this.healthText.text = this.word
    }

    destroy(fromScene) {
        // First destroy the text
        if (this.healthText) this.healthText.destroy();
        
        // Then call parent's destroy to destroy the sprite itself
        super.destroy(fromScene);
    }
    
    update(letter) {
        if (letter) this.updateWord(letter)
        if (this.word.length < 1) this.destroy()
        return
    }
}