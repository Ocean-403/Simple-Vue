const file = {};
let fileName = "肯德基";

// doc.innerHTML = file;
// 在file上添加属性name，值为fileName
Object.defineProperty(file, "name", {
  get: () => {
    console.log("get");
    return fileName;
  },

  set: (val) => {
    console.log(`set,值为${val}`);
    fileName = val;
  },
});

// 当读取file.name时 触发get方法
console.log(file.name);

// 修改fileName，重新获取file.name
fileName = "麦当劳";
console.log(file.name);

// 修改file.name 触发set方法
file.name = "麦当劳";
console.log(file.name);
console.log(fileName);
