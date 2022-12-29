import axios from "axios";

export const fetchPixabay = (searchRequest, pageNumber, perPageQuantity) => {
    const BASE_URL = "https://pixabay.com/api/";
    const PIXABAY_KEY = "32394556-d2b9cb8d34e30816bca32634a";

    const response = axios.get(`${BASE_URL}?key=${PIXABAY_KEY}&q=${searchRequest}&image_type=photo&orientation=horizontal&safesearch=true&page=${pageNumber}&per_page=${perPageQuantity}`);
    
    return response;
}