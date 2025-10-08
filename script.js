class OldLamp {
  oldTurnOn() {
    console.log("[Старий пристрій] Лампа увімкнена старим методом");
  }
  oldTurnOff() {
    console.log("[Старий пристрій] Лампа вимкнена старим методом");
  }
}

class OldDeviceAdapter {
  constructor(oldDevice) {
    this.oldDevice = oldDevice;
    this.isOn = false;
  }
  on() {
    this.oldDevice.oldTurnOn();
    this.isOn = true;
  }
  off() {
    this.oldDevice.oldTurnOff();
    this.isOn = false;
  }
}

class Light {
  constructor() {
    this.isOn = false;
  }
  on() {
    this.isOn = true;
    console.log("Світло увімкнено");
  }
  off() {
    this.isOn = false;
    console.log("Світло вимкнено");
  }
}

class Door {
  constructor() {
    this.isLocked = true;
    this.isOpen = false;
  }
  lock() {
    this.isLocked = true;
    this.isOpen = false;
    console.log("Двері зачинені");
  }
  unlock() {
    this.isLocked = false;
    this.isOpen = true;
    console.log("Двері відчинені");
  }
}

class SafeLightProxy {
  constructor(light, door) {
    this.light = light;
    this.door = door;
  }
  on() {
    if (this.door.isOpen) {
      console.log("Не можна вмикати світло, поки двері відчинені!");
      return;
    }
    this.light.on();
  }
  off() {
    if (this.door.isOpen) {
      console.log("Не можна вимикати світло, поки двері відчинені!");
      return;
    }
    this.light.off();
  }
}

class LightOnCommand {
  constructor(light) {
    this.light = light;
  }
  execute() {
    this.light.on();
  }
}

class LightOffCommand {
  constructor(light) {
    this.light = light;
  }
  execute() {
    this.light.off();
  }
}

class DoorLockCommand {
  constructor(door) {
    this.door = door;
  }
  execute() {
    this.door.lock();
  }
}

class DoorUnlockCommand {
  constructor(door) {
    this.door = door;
  }
  execute() {
    this.door.unlock();
  }
}


class LogCommand {
  constructor(command) {
    this.command = command;
  }
  execute() {
    console.log(`Виконується команда: ${this.command.constructor.name}`);
    this.command.execute();
    console.log(`Завершено: ${this.command.constructor.name}`);
  }
}


class EcoMode {
  heat() {
    console.log("Опалення в економному режимі");
  }
}
class ComfortMode {
  heat() {
    console.log("Опалення в комфортному режимі");
  }
}

class HeatingSystem {
  constructor(strategy) {
    this.strategy = strategy;
  }
  setStrategy(strategy) {
    this.strategy = strategy;
  }
  heat() {
    this.strategy.heat();
  }
}


class TemperatureSensor {
  constructor() {
    this.observers = [];
    this.temperature = 20;
  }
  addObserver(observer) {
    this.observers.push(observer);
  }
  setTemperature(value) {
    this.temperature = value;
    console.log(`Температура: ${value}°C`);
    this.notifyObservers();
  }
  notifyObservers() {
    for (const obs of this.observers) {
      obs.update(this.temperature);
    }
  }
}

class HeatingObserver {
  constructor(heatingSystem) {
    this.heatingSystem = heatingSystem;
  }
  update(temp) {
    if (temp < 18) {
      console.log("Холодно — вмикаємо комфортний режим");
      this.heatingSystem.setStrategy(new ComfortMode());
    } else {
      console.log("Тепло — переходимо на економний режим");
      this.heatingSystem.setStrategy(new EcoMode());
    }
    this.heatingSystem.heat();
  }
}


class HouseChatRoom {
  constructor() {
    this.users = {};
  }
  register(user) {
    this.users[user.name] = user;
    user.chatroom = this;
  }
  send(message, from, to) {
    if (to) {
      console.log(` ${from.name} - ${to.name}: ${message}`);
    } else {
      for (const name in this.users) {
        if (this.users[name] !== from) {
          console.log(`${from.name} - ${name}: ${message}`);
        }
      }
    }
  }
}

class User {
  constructor(name) {
    this.name = name;
    this.chatroom = null;
  }
  send(message, to) {
    this.chatroom.send(message, this, to);
  }
}


class RemoteControl {
  pressButton(command) {
    command.execute();
  }
}

class House {
  static #instance;
  #users = [];
  #gadgets = [];

  constructor() {
    if (House.#instance) {
      return House.#instance;
    }
    House.#instance = this;

    const door = new Door();
    const light = new SafeLightProxy(new Light(), door);

    const oldLamp = new OldDeviceAdapter(new OldLamp());
    this.#gadgets.push(light, door, oldLamp);

    this.remote = new RemoteControl();
    this.lightOn = new LogCommand(new LightOnCommand(light));
    this.lightOff = new LogCommand(new LightOffCommand(light));
    this.doorLock = new LogCommand(new DoorLockCommand(door));
    this.doorUnlock = new LogCommand(new DoorUnlockCommand(door));

    this.heatingSystem = new HeatingSystem(new EcoMode());
    this.sensor = new TemperatureSensor();
    this.sensor.addObserver(new HeatingObserver(this.heatingSystem));

    this.chatroom = new HouseChatRoom();
  }

  addUser(name) {
    const user = new User(name);
    this.#users.push(user);
    this.chatroom.register(user);
    return user;
  }

  getUsers() {
    return [...this.#users];
  }

  getGadgets() {
    return [...this.#gadgets];
  }
}

const house1 = new House();
const house2 = new House();
console.log("Singleton перевірка:", house1 === house2);

const alice = house1.addUser("Alice");
const bob = house1.addUser("Bob");

console.log("\n--- Команди (Command + Proxy + Decorator) ---");
house1.remote.pressButton(house1.doorUnlock);
house1.remote.pressButton(house1.lightOn);  
house1.remote.pressButton(house1.doorLock);
house1.remote.pressButton(house1.lightOn);  
house1.remote.pressButton(house1.lightOff);

console.log("\n--- Старий пристрій через Adapter ---");
const [ , , oldLamp ] = house1.getGadgets();
oldLamp.on();
oldLamp.off();

console.log("\n--- Mediator (чат між мешканцями) ---");
alice.send("Привіт усім!");
bob.send("Привіт, Алісо!", alice);

console.log("\n--- Observer + Strategy (опалення) ---");
house1.sensor.setTemperature(16);
house1.sensor.setTemperature(22);
