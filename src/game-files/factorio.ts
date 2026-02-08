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

class AddStorage implements GameObject {
  constructor(addGameObject: (gameObject: GameObject) => void) {
    const addStorageButton = document.createElement("button");
    addStorageButton.addEventListener("click", () =>
      addGameObject(new Storage()),
    );
    addStorageButton.innerHTML = "Add Storage";
    document.querySelector(".storages")!.appendChild(addStorageButton);
  }

  process(): void {}
  render(): void {}
}

class Storage implements GameObject {
  resources: Partial<Record<Resource, number>> = {};

  root: HTMLDivElement;
  nameElement: HTMLSpanElement;
  progressElement: HTMLProgressElement;
  inventoryElement: HTMLUListElement;

  constructor(readonly capacity: number = 50) {
    this.root = document.createElement("div");

    this.nameElement = document.createElement("span");
    this.nameElement.innerHTML = "Storage";
    this.root.appendChild(this.nameElement);

    this.progressElement = document.createElement("progress");
    this.root.appendChild(this.progressElement);

    this.inventoryElement = document.createElement("ul");
    this.root.appendChild(this.inventoryElement);

    document.querySelector(".storages")!.appendChild(this.root);
  }
  process(): void {}
  render(): void {
    this.progressElement.value = this.getUsage();
    const elements = Object.entries(this.resources)
      .filter(([, stock]) => !!stock)
      .map(([resource, stock]) => {
        const li = document.createElement("li");
        const name = document.createElement("span");
        name.innerHTML = `${ResourceName[resource as Resource]}: `;
        li.appendChild(name);
        const stockSpan = document.createElement("span");
        stockSpan.innerHTML = stock.toString();
        li.appendChild(stockSpan);
        return li;
      });
    this.inventoryElement.innerHTML = "";
    elements.forEach((element) => {
      this.inventoryElement.appendChild(element);
    });
  }

  countResources(): number {
    let count = 0;
    for (const resource of Object.values(this.resources)) {
      count += resource;
    }
    return count;
  }

  getUsage(): number {
    return this.countResources() / this.capacity;
  }

  hasSpace(): boolean {
    return this.getUsage() !== 1;
  }
}

class BaseProducer implements GameObject {
  capacity = 10;
  stock = 0;
  harvest = 0;
  isHarvesting = false;
  storage: Storage | null = null;

  root: HTMLDivElement;
  counter: HTMLSpanElement;
  harvestButton: HTMLButtonElement;
  moveToStorageButton: HTMLButtonElement;
  progressBar: HTMLProgressElement;

  getStorage: (() => Storage | undefined) | undefined;

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

    this.moveToStorageButton = document.createElement("button");
    this.moveToStorageButton.addEventListener(
      "click",
      this.moveToStorage.bind(this),
    );
    this.moveToStorageButton.innerHTML = "Move To Storage";
    this.root.appendChild(this.moveToStorageButton);

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
      if (this.harvest >= this.timeToHarvest && this.stock < this.capacity) {
        this.harvest = 0;
        this.isHarvesting = false;
        this.stock += this.harvestYield;
      }
    }
  }

  moveToStorage() {
    if (!this.getStorage) return;

    const storage = this.getStorage();
    if (!storage) return;

    if (!storage.resources[this.resource]) {
      storage.resources[this.resource] = this.stock;
    } else {
      storage.resources[this.resource] += this.stock;
    }
    this.stock = 0;
  }

  conectToStorages(getStorage: () => Storage | undefined) {
    this.getStorage = getStorage;
    return this;
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
  producers: Array<GameObject> = [];
  storages: Array<GameObject> = [new Storage()];

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

    for (const object of [...this.producers, ...this.storages]) {
      object.process(delta);
    }
    for (const object of [...this.producers, ...this.storages]) {
      object.render();
    }
    requestAnimationFrame(this.gameLoop.bind(this));
  }

  getStorage() {
    return this.storages.find((storage) =>
      (storage as Storage).hasSpace(),
    ) as Storage;
  }

  queryResource(resource: Resource, quantity: number) {
    let total = this.storages.reduce((acc, curr) => {
      const storage = curr as Storage;
      const stock = storage.resources[resource];
      if (stock) {
        return acc + stock;
      }
      return acc;
    }, 0);

    return total >= quantity;
  }

  setup() {
    this.producers.push(
      new CoalProducer().conectToStorages(this.getStorage.bind(this)),
    );
    this.producers.push(
      new StoneProducer().conectToStorages(this.getStorage.bind(this)),
    );
    this.producers.push(
      new IronProducer().conectToStorages(this.getStorage.bind(this)),
    );
    this.producers.push(
      new CopperProducer().conectToStorages(this.getStorage.bind(this)),
    );

    new AddStorage(this.storages.push.bind(this.storages));
  }
}

new Game();
