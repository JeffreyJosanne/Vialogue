// // -runtime
// import t from 'flow-runtime';
//
// const fooer = t.function(
//     t.param('param', t.number()),
//     t.return(t.string())
// );
//
// const __foo__ = t.annotate(
//     (a) => {return 'hello'},
//     fooer
// )
//
// class ParseClass {
//
//     constructor() {
//         // var x = t.annotate(
//         //     this.foo,
//         //     fooer
//         // );
//
//         // console.log(fooer);
//         //
//         // console.log(Object.keys(x));
//         //
//         // console.log(fooer.assert(x));
//
//         // console.log(this.foo);
//         // console.log(this.foo.length);
//         // console.log(Object.keys(this.foo.prototype.__proto__));
//
//         console.log(Object.getOwnPropertyNames(this));
//     }
//
// }
//
// class P extends ParseClass {
//
//     constructor() {
//         super();
//     }
//
//     foo(param: string):number {
//         console.log('foo');
//         return 1;
//     }
//
// }
//
// console.log(new P('p').foo('sf'));
// console.log(Object.getOwnPropertyNames(new P()))
"use strict";