// let search = new Search('pizza');
// search.doSearch().then(r => console.log(r));
// require("@babel/polyfill");
import Search from "./model/Search";
import { elements , renderLoader, clearLoader} from "./view/base";
import * as searchView from "./view/searchView";
/*
*-Web app төлөв
*-Хайлтын query үр дүн
*-Тухайн үзүүлж байгаа жор
*-Лайкласан жорууд
*-Захиалж байгаа жорын найрлаганууд
*/

const state = {};
const controlSearch = async () => {
    // 1) Вэбээс хайлтын түлхүүр үгийг гаргаж авна.
    const query = searchView.getInput();
    
    if(query){
        // 2) Шинээр хайлтын обект үүсгэж өгнө.
        state.search = new Search(query);
        // 3) Хайлт хийхэд зориулцж UI ийг бэлтгэнэ.
        searchView.clearSearchQuery();
        searchView.clearSearchResult();
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