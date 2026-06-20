export class Player {
  constructor(tshirt, id) {
    this.tshirt = tshirt;
    this.id = id;
  }

  static fromJSON(data) {
    if (!data) {
      return new Player("", 0);
    }
    return new Player(data.tshirt ?? "", data.id ?? 0);
  }

  toJSON() {
    return { tshirt: this.tshirt, id: this.id };
  }
}

export function createPlayer(tshirt, id) {
  return new Player(tshirt, id);
}
