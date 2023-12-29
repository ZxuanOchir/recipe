const arr = [23,44,12];

let myFunc = a => {
    console.log(`too :${a}`);
}
const arr2 = [...arr, 44, 1223];
myFunc(arr2[1]);
let x, y, z;    // Statement 1
x = 5;          // Statement 2
y = 6;          // Statement 3
z = x + y