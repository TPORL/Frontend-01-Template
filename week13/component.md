## 组件

## 对象与组件的区别

对象

- Properties
- Methods
- Inherit

组件

- Properties
- Methods
- Inherit

- Attributes
- Config
- State
- Event
- Lifecycle
- Children

## Attribute, Property, Config, State 的区别

- Attribute: 通常用于在 markup 上设置组件属性的默认值，也可以用 JS get/set
- Property: 通常用于在 JS 中 get/set 组件属性，值可能会经过内部加工
- Config: 通常用于在 JS 中设置默认值(属性或者状态)
- State: 记录组件状态，通常用户进行操作后发生改变

## Lifecycle 大致流程

- Create
- Mount
- Render / Update
- Unmount
- Destroy
