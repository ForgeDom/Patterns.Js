//Task2
function logDecorator(fn) {
    return function (...args) {
        console.log(`Виклик функції: ${fn.name} з аргументами:`, args);
        const result = fn.apply(this, args);
        console.log(`Результат функції ${fn.name}:`, result);
        return result;
    };
}

//Task3
class OldPrinter{
printOld(text) {
    console.log(`Старий принтер друкує: ${text}`);
  }
}
//Task3
class PrinterAdapter{
    constructor(oldPrinter) {
    this.oldPrinter = oldPrinter;
  }

  print(text) {
    this.oldPrinter.printOld(text);
  }
}
//Task4
function addToCoffeeModuleDecorator(fn) {
  return function (...args) {
    const result = fn(...args); 
    const coffeeModule = new CoffeeModule(); 
    coffeeModule.addOrder(result);
    return result; 
  };
}
//Task1
class CoffeeModule {
    #orders = [];
    static #instance;
    constructor() {
        if (CoffeeModule.#instance) {
            return CoffeeModule.#instance;
        }
        CoffeeModule.#instance = this;
        //Task3
        this.addOrder = logDecorator(this.addOrder.bind(this));
    }

    addOrder(order) {
        console.log(`Додано замовлення: ${order.type} (${order.size})`);
        this.#orders.push(order);
    }
    getOrders() {
        return [...this.#orders];
    }
    clearOrders() {
        this.#orders = [];
    }
    //Task3
    printAllOrders(printer) {
    this.getOrders().forEach(order => printer.print(order));
  }
}
//Task4
class CoffeeFactory {
  static createCoffee(type, size) {
    switch (type) {
      case "espresso":
        return { type: "espresso", size };
      case "latte":
        return { type: "latte", size };
      default:
        throw new Error("Невідомий тип кави!");
    }
  }
}
// const module1 = new CoffeeModule();
// const module2 = new CoffeeModule();

// module1.addOrder("Latte");
// module2.addOrder("Espresso");

// console.log(module1.getOrders()); 
// console.log(module1 === module2); 


// const oldPrinter = new OldPrinter();
// const printerAdapter = new PrinterAdapter(oldPrinter);

// const coffeeModule = new CoffeeModule();
// coffeeModule.addOrder("Latte");
// coffeeModule.addOrder("Espresso");
// coffeeModule.addOrder("Cappuccino");

// coffeeModule.printAllOrders(printerAdapter);    

CoffeeFactory.createCoffee = addToCoffeeModuleDecorator(CoffeeFactory.createCoffee);

CoffeeFactory.createCoffee("espresso", "small");
CoffeeFactory.createCoffee("latte", "large");
CoffeeFactory.createCoffee("espresso", "medium");

const module1 = new CoffeeModule();
console.log("Усі замовлення:", module1.getOrders());