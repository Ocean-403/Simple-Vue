/* eslint-disable no-param-reassign */

const person = { name: '小明', age: '18', sex: '男' };

const defineProperty = (obj, key, val) => {
  Object.defineProperty(obj, key, {
    get() {
      return val;
    },

    set(newVal) {
      console.log(`set${key}的值为${newVal}`);
      val = newVal;
    },
  });
};

Object.keys(person).forEach((key) => {
  defineProperty(person, key, person[key]);
});

console.log(person.name);
person.age = '19';
console.log(person.age);
