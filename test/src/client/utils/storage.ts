// 本地存储
export const setStorage = (name: string, data: string) => {
  let dataType = typeof data;
  // json对象
  if (dataType === "object") {
    window.localStorage.setItem(name, JSON.stringify(data));
  }
  // 基础类型
  else if (["number", "string", "boolean"].indexOf(dataType) >= 0) {
    window.localStorage.setItem(name, data);
  }
  // 其他不支持的类型
  else {
    alert("该类型不能用于本地存储");
  }
};

// 取出本地存储内容
export const getStorage = (name: string): string => {
  let data = window.localStorage.getItem(name);
  return data ? JSON.parse(data) : "";
};

// 删除本地存储
export const removeStorage = (name: string): void =>
  window.localStorage.removeItem(name);
