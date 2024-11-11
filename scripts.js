const box = document.getElementById("cont");
const POSTS_PER_LOAD = 3; 
let postCount = 0;
let postsCache = [];

async function fetchPosts() {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts");
        postsCache = await response.json();
    } catch (error) {
        console.error("Error loading posts:", error);
    }
}

async function loadNewPosts() {
    const newPosts = getNextPosts();
    newPosts.forEach(post => appendPost(post.title, post.body));
}

function getNextPosts() {
    const start = postCount % postsCache.length;
    const end = (postCount + POSTS_PER_LOAD) % postsCache.length;
    postCount += POSTS_PER_LOAD;
    return start < end ? postsCache.slice(start, end) : [...postsCache.slice(start), ...postsCache.slice(0, end)];
}

function appendPost(title, body) {
    const postElement = document.createElement("div");
    postElement.classList.add("col-md-4", "box");
    postElement.innerHTML = `
        <div class="card">
            <div class="card-body">
                <h5 class="title">${title}</h5>
                <p class="main">${body}</p>
            </div>
        </div>
    `;
    box.appendChild(postElement);
}

function handleScroll() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        loadNewPosts(); 
    }
}

window.addEventListener("scroll", debounce(handleScroll, 200));

function debounce(func, delay) {
    let timer;
    return function() {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, arguments), delay);
    };
}

fetchPosts().then(() => {
    for (let i = 0; i < POSTS_PER_LOAD; i++) {
        appendPost(postsCache[i].title, postsCache[i].body);
    }

    setInterval(loadNewPosts, 20000); 
});



