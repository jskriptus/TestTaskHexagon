// достает из объекта ключи и значения, а затем сохраняет их в виде массива с объектами [{key, value}]
export const objectToArray = (object) => {
    const keys = Object.keys(object);
    const values = Object.values(object);

    return keys.map((key, index) => ({ key, value: values[index] }));
};
