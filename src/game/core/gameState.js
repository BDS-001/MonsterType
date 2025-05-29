//implement state management later
class GameState {
  constructor() {
    this.player = { health: 100, immunity: false };
  }

  takeDamage(damage) {
    this.player.health -= damage
  }
}

export default new GameState()