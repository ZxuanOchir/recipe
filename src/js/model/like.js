export default class Likes {
    constructor(){
        this.readDataFromLocalStorage();

        if(!this.likes) this.likes = [];
    }

    addLike(id, title, publisher, image){
        const like = {id, title, publisher, image};

        this.likes.push(like);

        //storage ruu hadgalna.
        this.saveDataToLocalStorage();
        return like;
    }

    deleteLike(id){
                // id гэдэг ID-тэй like-ийг индексийг массиваас хайж олно.
                const index = this.likes.findIndex(el => el.id === id)
                // Уг индекс дээрх элемэнтийг массиваас устгана.
                this.likes.splice(index, 1);

                //storage ruu hadgalna.
                this.saveDataToLocalStorage();
    }

    isLiked(id) {
        // if(this.likes.findIndex(el => el.id === id) === -1 ) return false;
        // else return true;

            return this.likes.findIndex(el => el.id === id) !== -1;
        
    }

    getNumberOfLikes(){
        return this.likes.length;
    }

    saveDataToLocalStorage(){
        localStorage.setItem('likes', JSON.stringify(this.likes));
        //massiv buh el davtaad srting bolgoj zalgaad JSON bolgono...
    }

    readDataFromLocalStorage(){
        this.likes = JSON.parse(localStorage.getItem('likes'));
    }
}