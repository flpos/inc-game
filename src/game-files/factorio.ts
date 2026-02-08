enum Resource {
  Coal = "coal",
  Iron = "iron",
  Copper = "copper",
  Stone = "stone",
  IronPlate = "ironplate",
  CopperPlate = "copperplate",
  IronGearWheel = "irongearwheel",
  CopperWire = "copperwire",
}

const ResourceName: Record<Resource, string> = {
  [Resource.Coal]: "Coal",
  [Resource.Iron]: "Iron",
  [Resource.Copper]: "Copper",
  [Resource.Stone]: "Stone",
  [Resource.IronPlate]: "Iron Plate",
  [Resource.CopperPlate]: "Copper Plate",
  [Resource.IronGearWheel]: "Iron Gear Wheel",
  [Resource.CopperWire]: "Copper Wire",
};

interface GameObject {
  process(delta: number): void;
  render(): void;
}

class BaseProducer implements GameObject {
  stock = 0;
  harvest = 0;
  isHarvesting = false;

  root: HTMLDivElement;
  counter: HTMLSpanElement;
  harvestButton: HTMLButtonElement;
  progressBar: HTMLProgressElement;

  constructor(
    readonly resource: Resource,
    readonly timeToHarvest: number,
    readonly harvestYield: number,
  ) {
    this.root = document.createElement("div");
    const title = document.createElement("h3");
    title.innerHTML = ResourceName[this.resource];
    this.root.appendChild(title);

    this.counter = document.createElement("span");
    this.root.appendChild(this.counter);

    this.progressBar = document.createElement("progress");
    this.progressBar.style.display = "block";
    this.root.appendChild(this.progressBar);

    this.harvestButton = document.createElement("button");
    this.harvestButton.addEventListener(
      "click",
      this.startProduction.bind(this),
    );
    this.harvestButton.innerHTML = "Harvest!";
    this.root.appendChild(this.harvestButton);

    document.querySelector(".producers")!.appendChild(this.root);
  }

  startProduction() {
    this.isHarvesting = true;
  }

  render() {
    this.counter.innerHTML = Math.floor(this.stock).toString();
    if (this.isHarvesting) {
      this.progressBar.value = this.harvest / this.timeToHarvest;
    } else {
      this.progressBar.value = 0;
    }
  }

  process(delta: number) {
    if (this.isHarvesting) {
      this.harvest += delta / 1000;
      if (this.harvest >= this.timeToHarvest) {
        this.harvest = 0;
        this.isHarvesting = false;
        this.stock += this.harvestYield;
      }
    }
  }
}

class CoalProducer extends BaseProducer {
  constructor() {
    super(Resource.Coal, 1, 1);
  }
}

class StoneProducer extends BaseProducer {
  constructor() {
    super(Resource.Stone, 1, 1);
  }
}

class IronProducer extends BaseProducer {
  constructor() {
    super(Resource.Iron, 1, 1);
  }
}

class CopperProducer extends BaseProducer {
  constructor() {
    super(Resource.Copper, 1, 1);
  }
}

class Game {
  lastTime: number | undefined;
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
      object.process(delta);
    }
    for (const object of this.objects) {
      object.render();
    }
    requestAnimationFrame(this.gameLoop.bind(this));
  }

  setup() {
    this.objects.push(new CoalProducer());
    this.objects.push(new StoneProducer());
    this.objects.push(new IronProducer());
    this.objects.push(new CopperProducer());
  }
}

new Game();
