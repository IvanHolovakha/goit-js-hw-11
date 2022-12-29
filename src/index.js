import { fetchPixabay } from "./fetchPixabay";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
// import axios from "axios";

const refs = {
    searchForm: document.querySelector("#search-form"),
    searchInput: document.querySelector("input"),
    gallery: document.querySelector(".gallery"),
    loadMoreBtn: document.querySelector(".load-more"),
}

let pageNumber;
let searchRequest;
const perPageQuantity = 40;

refs.loadMoreBtn.setAttribute("hidden", true);
refs.searchForm.addEventListener("submit", onSubmit);
refs.loadMoreBtn.addEventListener("click", onLoadMoreBtn);

function onSubmit (event) {
    event.preventDefault();

    refs.gallery.innerHTML = '';
    pageNumber = 1;
    searchRequest = refs.searchInput.value;

    if (!searchRequest){
        Notify.info("Please enter your search query!");
        refs.loadMoreBtn.setAttribute("hidden", true);
        return
    }

    fetchPixabay(searchRequest, pageNumber, perPageQuantity).then(({data:{hits, totalHits}}) => {

        if (hits.length === 0){
            Notify.failure("Sorry, there are no images matching your search query. Please try again.")
            return
        }
       
        if(pageNumber === Math.ceil(totalHits/perPageQuantity)){
            refs.loadMoreBtn.setAttribute("hidden", true);
            Notify.info("We're sorry, but you've reached the end of search results.");
        } else {
            refs.loadMoreBtn.removeAttribute("hidden");
        }

        Notify.success(`Hooray! We found ${totalHits} images.`);
        renderGalleryCards(hits);
        refs.gallery.insertAdjacentHTML("beforeend", galleryCardsMarkup);
        
    }).catch (error=>
        console.log(error.message))
    
}

function onLoadMoreBtn(){
    pageNumber +=1;
    searchRequest = refs.searchInput.value;

    fetchPixabay(searchRequest, pageNumber).then(({data:{hits, totalHits}}) => {
        renderGalleryCards(hits);
        refs.gallery.insertAdjacentHTML("beforeend", galleryCardsMarkup);      

        if(pageNumber === Math.ceil(totalHits/perPageQuantity)){
            refs.loadMoreBtn.setAttribute("hidden", true);
            Notify.info("We're sorry, but you've reached the end of search results.");
        }
    })
}

function renderGalleryCards(cards) {
   return galleryCardsMarkup = cards.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads})=>{
        return `<div class="photo-card">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>Likes${likes}</b>
          </p>
          <p class="info-item">
            <b>Views${views}</b>
          </p>
          <p class="info-item">
            <b>Comments${comments}</b>
          </p>
          <p class="info-item">
            <b>Downloads${downloads}</b>
          </p>
        </div>
      </div>`
    }).join('');
    
}