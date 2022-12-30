import { fetchPixabay } from "./fetchPixabay";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const refs = {
    searchForm: document.querySelector("#search-form"),
    searchInput: document.querySelector("input"),
    gallery: document.querySelector(".gallery"),
    loadMoreBtn: document.querySelector(".load-more"),
}


let pageNumber;
let searchRequest;
const perPageQuantity = 40;

const lightbox = new SimpleLightbox('.photo-card a', {
    captions: true,
    captionsData: 'alt',
    captionDelay: 250,
});

refs.loadMoreBtn.setAttribute("hidden", true);
refs.searchForm.addEventListener("submit", onSubmit);
refs.loadMoreBtn.addEventListener("click", onLoadMoreBtn);

async function onSubmit (event) {
    event.preventDefault();

    try {
        refs.gallery.innerHTML = '';
        pageNumber = 1;
        searchRequest = refs.searchInput.value;

        if (!searchRequest){
            Notify.info("Please enter your search query!");
            refs.loadMoreBtn.setAttribute("hidden", true);
            return
        }

        const response = await fetchPixabay(searchRequest, pageNumber, perPageQuantity);
        const {data:{hits, totalHits}} = response;
        
        if (hits.length === 0){
            refs.loadMoreBtn.setAttribute("hidden", true);
            Notify.failure("Sorry, there are no images matching your search query. Please try again.");
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
        lightbox.refresh();
    } catch (error) {
        console.log(error.message)};
};

async function onLoadMoreBtn(){
    pageNumber +=1;
    searchRequest = refs.searchInput.value;

    const response = await fetchPixabay(searchRequest, pageNumber, perPageQuantity);
    const {data:{hits, totalHits}} = response;
    renderGalleryCards(hits);
    lightbox.refresh();      

    if(pageNumber === Math.ceil(totalHits/perPageQuantity)){
        refs.loadMoreBtn.setAttribute("hidden", true);
        Notify.info("We're sorry, but you've reached the end of search results.");
    };
};

function renderGalleryCards(cards) {
    const galleryCardsMarkup = cards.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads})=>{
        return `<div class="photo-card">
        <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
        
        <div class="info">
          <p class="info-item">
            <b>Likes</b>${likes}
          </p>
          <p class="info-item">
            <b>Views</b>${views}
          </p>
          <p class="info-item">
            <b>Comments</b>${comments}
          </p>
          <p class="info-item">
            <b>Downloads</b>${downloads}
          </p>
        </div>
      </div>`
    }).join('');   
    refs.gallery.insertAdjacentHTML("beforeend", galleryCardsMarkup);
};