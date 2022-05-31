const person = { name: "小明", age: "18", sex: "男", info: { region: "深圳" } };

const defineProperty = (obj, key, val) => {
  if (typeof val === "object") {
    circulation(val);
  }
  Object.defineProperty(obj, key, {
    get() {
      return val;
    },

    set(newVal) {
      if (typeof newVal === "object") {
        console.log(`set ${key}的值为${JSON.stringify(newVal)}`);
        circulation(newVal);
      } else {
        console.log(`set ${key}的值为${newVal}`);
      }
      val = newVal;
    },
  });
};

const circulation = (obj) => {
  if (typeof obj !== "object" || obj === null) {
    return;
  }

  Object.keys(obj).forEach((key) => {
    defineProperty(obj, key, obj[key]);
  });
};

circulation(person);
person.info.region = "广州";
console.log(person.info.region);
person.info.region = { name: "天河", address: "体育西路" };
console.log(person.info.region.name);
person.info.region.name = "海珠";
console.log(person.info.region.name);
