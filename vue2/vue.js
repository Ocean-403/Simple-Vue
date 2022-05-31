class Vue {
  constructor(option) {
    this.$el =
      typeof option.el === "string"
        ? document.querySelector(option.el)
        : option.el;

    this.$data = option.data || {};

    new Observer(this.$data);

    new Complier(this);
  }
}

// 数据劫持
class Observer {
  constructor(data) {
    this.traverse(data);
  }

  traverse(data) {
    if (!data || typeof data !== "object") return;

    const dep = new Dep();
    Object.keys(data).forEach((key) => {
      // 假如get set直接操作data[key] 会循环调用 栈溢出
      let value = data[key];

      this.traverse(value);

      const _this = this;

      Object.defineProperty(data, key, {
        enumerable: true,
        configurable: true,

        get() {
          console.log(`get了属性${key}的值为${value}`);
          Dep.temp && dep.addSub(Dep.temp);
          return value;
        },

        set(newVal) {
          console.log(`set了属性${key}的值为${value}`);
          if (value === newVal) return;
          value = newVal;

          _this.traverse(newVal);
          dep.notify();
        },
      });
    });
  }
}


// 渲染编译器
class Complier {
  constructor(vm) {
    this.vm = vm;

    this.el = vm.$el;

    this.complie(this.el);
  }

  complie(el) {
    const nodes = [...el.childNodes];
    nodes.forEach((node) => {
      if (node.nodeType === 3) {
        // {{ name }}
        this.complieText(node);
      } else if (node.nodeType === 1) {
        this.complieElement(node);
      }

      // 还有子节点
      if (node.childNodes && node.childNodes.length > 0) {
        this.complie(node);
      }
    });
  }

  complieText(node) {
    const reg = /\{\{\s*(\S+)\s*\}\}/;
    const val = node.textContent;
    const keyS = val.match(reg);
    if (!keyS) {
      return;
    }
    const [, key] = keyS;

    const arr = key.split(".");

    const value = arr.reduce((total, current) => total[current], this.vm.$data);

    node.textContent = val.replace(reg, value);

    new Watcher(this.vm, key, (newVal) => {
      node.textContent = val.replace(reg, newVal);
    });
  }

  complieElement(node) {
    [...node.attributes].forEach((attr) => {
      const attrName = attr.name;

      if (attrName.startsWith("v-")) {
        const key = attr.value;
        const arr = key.split(".");
        const value = arr.reduce(
          (total, current) => total[current],
          this.vm.$data
        );
        if (attrName === "v-text") {
          node.textContent = value;
          new Watcher(this.vm, key, (newVal) => {
            node.textContent = newVal;
          });
        } else if (attrName === "v-model") {
          node.value = value;

          new Watcher(this.vm, key, (newVal) => {
            node.value = newVal;
          });

          function setValue(obj, params, value) {
            if (params.length === 1) {
              obj[params] = value;
            } else {
              const P = params[0];
              const Newparams = params.slice(1);
              setValue(obj[P], Newparams, value);
            }
          }

          node.addEventListener("input", (e) => {
            setValue(this.vm.$data, arr, e.target.value);
          });
        }
      }
    });
  }
}

// 用于存放订阅者和通知订阅者更新
class Dep {
  constructor() {
    this.subs = [];
  }

  addSub(sub) {
    this.subs.push(sub);
  }

  notify() {
    this.subs.forEach((sub) => {
      sub.update();
    });
  }
}

// 订阅者
class Watcher {
  constructor(vm, key, callback) {
    this.vm = vm;
    this.key = key;
    this.callback = callback;
    Dep.temp = this; //缓存当前的this，this是一个watcher对象

    this.value = key
      .split(".")
      .reduce((total, current) => total[current], vm.$data);
    // 重中之重 通过获取对应的值 触发get方法 往dep里添加一了一个watch对象

    Dep.temp = null; // 防止订阅者多次加入到依赖实例数组里
  }

  update() {
    // data改变 触发set方法 调用dep里的notify方法 更新元素
    const newVal = this.key
      .split(".")
      .reduce((total, current) => total[current], vm.$data);

    this.callback(newVal);
  }
}
