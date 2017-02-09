// @flow-runtime


// class Interface {
//
//     constructor(a: string, b: number) {
//         var c: number = 10;
//         console.log(c);
//     }
//
//     validateInterfaceImplementation() {
//
//     }
// }
//
// new Interface('1', 1);

// type User = {getName(param: number): string};
// // const bob: User = {
// //     name: 'Bob',
// //     getName: (param: number): string => {
// //   	     return 'hello'
// //     },
// //     getAge: (): number => {
// //         return 10
// //     }
// // }
// // console.log(bob);
//
// class Interface {
//
//     constructor() {
//         console.log(this);
//         (this: User);
//     }
//
// }
//
// class bob extends Interface {
//
//     constructor(name: string) {
//         super();
//     }
//
//     getName(param: string): string {
//         return 'bob';
//     }
//
// }
//
// var b_ = new bob('hello');
// b_.getName('hmmm');

//
// console.log(bob);
//
// interface Comparable<T> {
//   compare(a: T, b: T): number;
// }
//
// class a implements Comparable<number> {
//
//     compare(a, b: number): number {
//         return a + b;
//     }
//
// }
//
// var a_ = new a();
// console.log(a_.compare(1, 20));
//
// var f = function(a: number, b: string, ...rest: Array<void>): string {
//     console.log(arguments);
// }
//
// f(10, 'hello', 20)

// var _validateFunctions = new WeakMap();
//
// class a {
//
//     constructor() {
//         console.log(this.validateFunctions());
//         _validateFunctions.set(this, this.validateFunctions);
//     }
//
//     validateFunctions() {
//         return 'hello';
//     }
//     foo(a: number): string {}
// }
//
// class b extends a {
//
//     constructor() {
//         super();
//     }
//
//     validateFunctions() {
//         return 'heeeelo'
//     }
//
//     foo(a: string): number {
//     }
// }
//
// var b_ = new b();
// console.log(b_.foo('hello'));
//
// class Interface {
//
//     constructor() {
//
//     }
//
// }

// var Interface = require('./test.js').Interface;
//
// const _a = 9;
//
// class a extends Interface {
//     constructor() {
//         super();
//     }
//
//     c() {
//         console.log('c');
//     }
// }
//
// var a_ = new a();
// a_.b();

// type
//
// class Interface {
//
// }
//
// type a = {
//     name: string,
//     age: number,
//     getName(): string,
//     getAge(): number
// }
//
// var a_: a = {
//     name: 'riyansh',
//     age: 10,
//     getName(): string {
//         return name
//     },
//     getAge(): number {
//         return age
//     }
//
// }
//
// console.log(a_.getName);



// const x: fooInterface = {
//     bar: (param: number): number => {
//         return 10;
//     }
// }
//
// type User = {getName(param: number): string};
// const bob: User = {
//     name: 'Bob',
//     getName: (param: number): string => {
//   	     return 'hello'
//     },
//     getAge: (): number => {
//         return 10
//     }
// }
// console.log(bob);

// type fooInterface = {
//     bar(param: string): number;
// }
//
// console.log('before');
// console.log(fooInterface.assert);
// console.log('after');
//
// class Interface {
//     constructor(t: TypeAlias) {
//         console.log('interface : constructor : called');
//         console.log(t);
//     }
// }
//
//
// class FooInterface extends Interface {
//     constructor() {
//         super();
//     }
// }
//
// class Foo extends FooInterface {
//
//     bar(param:number): string {
//         return 'hello';
//     }
// }
//
// var f: fooInterface = new Foo();
// console.log(f.bar(10));
