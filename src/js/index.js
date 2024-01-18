
// require("@babel/polyfill");
import Search from "./model/Search";
import { clearLoader, elements, renderLoader } from "./view/base";
import * as searchView from "./view/searchView";
import Recipe from "./model/Recipes";
import { renderRecipe, clearRecipe, highlightSelectedRecipe } from "./view/recipeView";
import List from "./model/List";
import Likes from "./model/like";
import * as listView from './view/listView';
import * as likesView from './view/likesView';
/*
*-Web app төлөв
*-Хайлтын query үр дүн
*-Тухайн үзүүлж байгаа жор
*-Лайкласан жорууд
*-Захиалж байгаа жорын найрлаганууд
*/
//CONTROLLER
const state = {};

/*
* Хайлтын контроллэр = Model ==> Controller <== View
*/
const controlSearch = async () => {
    // 1) Вэбээс хайлтын түлхүүр үгийг гаргаж авна.
    const query = searchView.getInput();
    
    if(query){
        // 2) Шинээр хайлтын обект үүсгэж өгнө.
        state.search = new Search(query);
        // 3) Хайлт хийхэд зориулцж UI ийг бэлтгэнэ.
        searchView.clearSearchQuery();// search iin form tseverleh
        searchView.clearSearchResult(); // garj irsen utgani daraa dahin hailt hiihed list tseverleh
        renderLoader(elements.searchResultDiv);
        // 4) Хайлтыг гүйцэтгэнэ.
        await state.search.doSearch();
        // 5) Хайлтын үр дүнг дэлгэцэнд гаргана.
        clearLoader();
        if(state.search.result === undefined) alert('Хайлт илэрц олдсонгүй...')
        else searchView.renderRecipies(state.search.result);
    }

};
elements.searchForm.addEventListener('submit', r => {
    r.preventDefault(); // default submit iig boliulah
    controlSearch();
});

elements.pageButtons.addEventListener("click", e => {
    const btn = e.target.closest('.btn-inline');

    if(btn) {
        const gotoPageNumber = parseInt(btn.dataset.goto, 10);
        searchView.clearSearchResult();
        searchView.renderRecipies(state.search.result, gotoPageNumber);
    }
});
//closest css elementin dom deer bui hamgiin oir elementiig olj ugdug



/*
* Жорын контроллэр
*/
const controlRecipe = async () => {
    //1) URL- aac ID салгаж авна
const id = window.location.hash.replace('#', '');


// console.log(id + ' ene bol id array')
//URL deer ID baigaa esehiig shalgana...
if(id){
//2) Жорын моделийг үүсгэж өгнө.
state.recipe = new Recipe(id);

//3) UI дэлгэцийг бэлтгэнэ.
clearRecipe();
renderLoader(elements.recipeDiv);
highlightSelectedRecipe(id);

//4) Жороо татаж авчирна.
await state.recipe.getRecipe();

//5) Жорыг гүйцэтгэх хугацаа болон орцыг тооцоолно.
clearLoader();
state.recipe.calcTime();
state.recipe.calcHuniiToo();

//6) Жороо үзүүлнэ.
renderRecipe(state.recipe, state.likes.isLiked(id));
}

}
// window.addEventListener('hashchange', controlRecipe);//# change
// window.addEventListener('load', controlRecipe);//browser refresh hadgalah
['hashchange', 'load'].forEach(e => window.addEventListener(e, controlRecipe));

window.addEventListener('load', e => {
    //Shineer like modeliig app ehlhed uusgene.
    if(!state.likes) state.likes = new Likes(); // ! ===> hooson baih ym bol likes iig shineer uusgene.

    //Like Tsesiig gargah esehiig shiideh
    likesView.toggleLikeMenu(state.likes.getNumberOfLikes());

    // Like uud baival tsesend nemj haruulna.
    state.likes.likes.forEach(like => likesView.renderLike(like));
});
/**
 * Найрлаганы контроллер
 * */

const controlList = () => {
    // Найрлаганы моделийг үүсгэнэ.
    state.list = new List();

    // window.tt = state.list;

    // umnu ni haragdaj baisan nairlaguudig arilgana...
    listView.clearItems();

    //Уг модел рүү одоо харагдаж байгаа жорны бүх найрлагийг авч хийнэ.
    state.recipe.ingredients.forEach( e => {
        //Tuhain nairlagiig model ruu hiine ...
        const item = state.list.addItem(e);
        // Tuhain nairlagiig delgetsend gargana.
        listView.renderItem(item);
    });
    //state.recipe.ingredients
};

/**
 *  Like Controller
 */
const controlLike = () => {
    // 1) Like iin model iig uusgene
    if(!state.likes) state.likes = new Likes(); // ! ===> hooson baih ym bol ajillana...


    // 2) Odoo haragdaj baigaa joriin ID g olj avah

    const currentRecipeId = state.recipe.id;
    // console.log(state.recipe.id);
    // 3) Ene joriig Likelasan esehiig shalgah

    if(state.likes.isLiked(currentRecipeId)){
    // 4) Likelasan bol Like iig boliulah
    state.likes.deleteLike(currentRecipeId);
    // Харагдаж байгаа like цэснээс устгана.
    likesView.deleteLike(currentRecipeId);
    //LIKE lasan baidliig boliulah
    likesView.toggleLikeButton(false);
    
    }else{
     // 5) Likelaagui bol likelana

    const newLike = state.likes.addLike(currentRecipeId,state.recipe.title, state.recipe.publisher,state.recipe.image_url);
    //  console.log(state.likes);

    //Like tsesend ene like iig oruulah
    likesView.renderLike(newLike);
    
    //Like iig likelasan bolgoh
    likesView.toggleLikeButton(true);
    }
    
    likesView.toggleLikeMenu(state.likes.getNumberOfLikes())
   
}
elements.recipeDiv.addEventListener('click', e => {
    if(e.target.matches(".recipe__btn, .recipe__btn *")){
        controlList();
        //class iin all element d handah
    }else if(e.target.matches('.recipe__love, .recipe__love *')){
        controlLike();
    }

});

elements.shoppingList.addEventListener('click', e => {
    // Клик хийсэн li элемэнтийн data-itemid аттрибутыг шүүж гаргаж авах
    const id = e.target.closest('.shopping__item').dataset.itemid;
    // li element ternii dataset.itemid ==> const id

    // Олдсон ID тэй орцыг моделоос устгана.
    state.list.deleteItem(id);

    //Дэлгэцээс ийм ID тэй орцыг олж устгана.
    listView.deleteItem(id);
});
