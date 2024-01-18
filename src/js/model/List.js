import uniqid from "uniqid"
export default class List{
    constructor(){
        this.items = [];
    }

    deleteItem(id){
        // id гэдэг ID-тэй орцын индексийг массиваас хайж олно.
        const index = this.items.findIndex(el => el.id === id)
        // Уг индекс дээрх элемэнтийг массиваас устгана.
        this.items.splice(index, 1);
    }

    addItem(item) {
        let newItem = {
                id : uniqid(),
                item : item //hoeul adil nertei baival ES6 shuud item gj ugj blno xD;
        }
        this.items.push(newItem);

        return newItem;
    }
}