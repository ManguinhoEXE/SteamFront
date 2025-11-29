export class Transaction {
  constructor(id, game, amount, date, type) {
    this.id = id;
    this.game = game;
    this.amount = amount;
    this.date = date;
    this.type = type; // 'historial' | 'deposito'
  }
}
