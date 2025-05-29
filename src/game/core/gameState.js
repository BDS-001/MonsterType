//implement state management later
class GameState {
  constructor() {
    this.player = { health: 100, immunity: false };
  }

  playerHit(damage) {
    this.player.health -= damage
    console.log(this.player.health)
  }
}

export default new GameState()