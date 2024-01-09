// let search = new Search('pizza');
// search.doSearch().then(r => console.log(r));
// require("@babel/polyfill");
import Search from "./model/Search";
import { clearLoader, elements, renderLoader } from "./view/base";
import * as searchView from "./view/searchView";
import Recipe from "./model/Recipes";
/*
*-Web app төлөв
*-Хайлтын query үр дүн
*-Тухайн үзүүлж байгаа жор
*-Лайкласан жорууд
*-Захиалж байгаа жорын найрлаганууд
*/

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

const r = new Recipe(47746);
r.getRecipe();


/*
* Жорын контроллэр
*/
const controlRecipe = async () => {
    //1) URL- aac ID салгаж авна
const id = window.location.hash.replace('#', '');
// console.log(id);
    //2) Жорын моделийг үүсгэж өгнө.
state.recipe = new Recipe(id);
    //3) UI дэлгэцийг бэлтгэнэ.

    //4) Жороо татаж авчирна.
await state.recipe.getRecipe();
    //5) Жорыг гүйцэтгэх хугацаа болон орцыг тооцоолно.
    
state.recipe.calcTime();
state.recipe.calcHuniiToo();

    //6) Жороо үзүүлнэ.
    console.log(state.recipe);
}
window.addEventListener('hashchange', controlRecipe);