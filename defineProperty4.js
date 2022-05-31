let array = [1, 2, 3];
const obj = {};

Object.defineProperty(obj, 'array', {
  get() {
    return array;
  },

  set(newVal) {
    console.log(`set ${newVal}`);
    array = newVal;
  },
});

console.log(obj.array);
obj.array = [1];
obj.array.push(2);
console.log('obj.array: ', obj.array);
obj.array.splice(0, 1, 3);
console.log('obj.array: ', obj.array);
