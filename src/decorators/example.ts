function loggedMethod(originalMethod: any, context: ClassMethodDecoratorContext) {
    const methodName = String(context.name);

    function replacementMethod(this: any, ...args: any[]) {
        console.log('this is this')
        console.log(this)
        console.log('these are args')
        console.log(args);
        console.log(`LOG: Entering method '${methodName}'.`)
        const result = originalMethod.call(this, ...args);
        console.log(`LOG: Exiting method '${methodName}'.`)
        return result;
    }

    return replacementMethod;
}

function autobind(_originalMethod: any, context: ClassMethodDecoratorContext) {
    const methodName = context.name;
    if (context.private) {
        throw  new Error(`'bound' cannot decorate private properties like ${methodName as string}.`)
    }
    context.addInitializer(function () {
        (this as any)[methodName] = (this as any)[methodName].bind(this)
    })
}

class Person {
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    @autobind
    @loggedMethod
    greet(phrase: string) {
        console.log(`Hello, my name is ${this.name}. ${phrase}`)
    }
}

const p = new Person('Ron');
const greet = p.greet;

greet('test');