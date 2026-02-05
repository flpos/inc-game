interface GameObject {
  loopAction(delta: number): void;
  render(): void;
}

class Counter implements GameObject {
  elapsedTime: number;
  currentTime: number;

  constructor() {
    this.elapsedTime = 0;
    this.currentTime = 0;
  }

  async loopAction(delta: number): Promise<void> {
    this.elapsedTime += delta;
    this.currentTime += delta;

    if (this.currentTime > 1000) {
      console.log(Math.floor(this.elapsedTime / 1000));
      this.currentTime -= 1000;
    }
  }

  render(): void {}
}

abstract class Increment implements GameObject {
  currentTime = 0;

  constructor(readonly intervalInMS: number) {}

  loopAction(delta: number): void {
    this.currentTime += delta;

    if (this.currentTime > 1000) {
      this.action();
      this.currentTime -= 1000;
    }
  }

  abstract action(): void;
  abstract render(): void;
}

class GameWorker extends Increment {
  currentUnits: number;

  constructor(
    readonly updateGlobalCurrency: (value: number) => boolean,
    readonly name: string,
    readonly value: number,
  ) {
    super(1000);
    this.currentUnits = 0;
  }

  action() {
    this.updateGlobalCurrency(this.currentUnits * this.value);
  }

  render() {
    let element = document.querySelector(`button#${this.name}`);
    if (!element) {
      element = document.createElement("button");
      element.id = this.name;
      element.addEventListener("click", this.addUnit.bind(this));
      document.querySelector("body")!.appendChild(element);
    }
    element.innerHTML = `${this.name} - ${this.currentUnits}: ${this.value ** (this.currentUnits + 1)}\$`;
  }

  addUnit() {
    const success = this.updateGlobalCurrency(
      this.value ** (this.currentUnits + 1) * -1,
    );
    if (success) {
      this.currentUnits += 1;
    }
  }
}

class Game {
  gameIsOn = true;
  lastTime: number = 0;

  objects: Array<GameObject> = [];

  constructor() {
    this.setup();
    requestAnimationFrame(this.gameLoop.bind(this));
  }

  gameLoop(timestamp: number) {
    if (!this.lastTime) {
      this.lastTime = timestamp;
    }

    const delta = timestamp - this.lastTime;
    this.lastTime = timestamp;

    for (const object of this.objects) {
      object.loopAction(delta);
    }
    for (const object of this.objects) {
      object.render();
    }
    this.renderMoney();
    requestAnimationFrame(this.gameLoop.bind(this));
  }

  renderMoney() {
    let element = document.querySelector(`#money`);
    if (!element) {
      element = document.createElement("h1");
      element.id = "money";
      document.querySelector("body")!.appendChild(element);
    }
    element.innerHTML = `Money: ${this.globalCurrency}`;
  }

  globalCurrency = 1;
  updateGlobalCurrency(delta: number) {
    if (this.globalCurrency + delta < 0) {
      return false;
    }

    this.globalCurrency += delta;
    return true;
  }

  setup() {
    this.objects.push(
      new GameWorker(this.updateGlobalCurrency.bind(this), "estagiário", 1),
    );
    this.objects.push(
      new GameWorker(this.updateGlobalCurrency.bind(this), "iniciante", 10),
    );
    this.objects.push(
      new GameWorker(this.updateGlobalCurrency.bind(this), "mestre", 50),
    );

    document.querySelector("body")!.innerHTML = "";
  }
}

new Game();
