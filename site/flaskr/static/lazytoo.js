const defaults = {
    imageLoadedClass: 'js-lazy-image--handled',
    imageSelector: '.js-lazy-image',
    // If the image gets within 50px in the Y axis, start the download.
    rootMargin: '50px 0px',
    threshold: 0.01
};

let config,
    images,
    imageCount,
    observer,
    current;

/**
 * Fetches the image for the given URL
 * @param {string} url
 */
function fetchImage(url) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        // image.crossOrigin = "Anonymous";
        // image.setAttribute('crossOrigin', '')
        image.src = url;
        image.onload = resolve;
        image.onerror = reject;
    });
}

/**
 * Preloads the image
 * @param {object} image
 */
function preloadImage(image) {
    const src = image.dataset.src;
    if (!src) {
        return;
    }

    return fetchImage(src).then(() => { applyImage(image, src); });
}

/**
 * Load all of the images immediately
 * @param {NodeListOf<Element>} images
 */
function loadImagesImmediately(images) {
    // foreach() is not supported in IE
    for (let i = 0; i < images.length; i++) {
        let image = images[i];
        preloadImage(image);
    }
}

/**
 * Disconnect the observer
 */
function disconnect() {
    if (!observer) {
        return;
    }

    observer.disconnect();
}

/**
 * On intersection
 * @param {array} entries
 */
function onIntersection(entries) {
    // Disconnect if we've already loaded all of the images
    if (imageCount === 0) {
        console.log("loaded all images, disconnecting")
        disconnect();
        return;
    }

    // Loop through the entries
    for (let i = 0; i < entries.length; i++) {
        let entry = entries[i];
        // Are we in viewport?
        if (entry.intersectionRatio > 0) {
            imageCount--;

            // begin our stuff
            let currentChapter = getCurrentLoadedChapter();
            if (current != currentChapter) {
                getPageUrl(currentChapter).then(result => {
                    observer.observe(result);
                    imageCount++
                    console.log(result)
                });
                current = currentChapter
            };
            // let img = await pageUrl;
            // console.log(img);
            // console.log(pageUrl);
            
            // observer.observe(img)

            // their stuff again
            // Stop watching and load the image
            observer.unobserve(entry.target);
            preloadImage(entry.target);
            console.log("preloadImage in onIntersection")
            console.log(entry.target)
        }
    }
}

/**
 * Apply the image
 * @param {object} img
 * @param {string} src
 */
function applyImage(img, src) {
    // Prevent this from being lazy loaded a second time.
    img.classList.add(config.imageLoadedClass);
    img.src = src;
}

let LazyLoad = {

    init: (options) => {
        config = { ...defaults, ...options };

        images = document.querySelectorAll(config.imageSelector);
        imageCount = images.length;

        // If we don't have support for intersection observer, loads the images immediately
        if (!('IntersectionObserver' in window)) {
            loadImagesImmediately(images);
            console.log("loaded images immediately because no intersection observer")
        } else {
            // It is supported, load the images
            observer = new IntersectionObserver(onIntersection, config);
            // console.log("intersectionObserver supported")

            // foreach() is not supported in IE
            for (let i = 0; i < images.length; i++) {
                let image = images[i];
                if (image.classList.contains(config.imageLoadedClass)) {
                    continue;
                }

                observer.observe(image);
            }
        }
    }
};

function getCurrentLoadedChapter() {
    const element = document.getElementById("img-container")
    let data_src = element.lastElementChild.getAttribute("data-src");
    // console.log(html)
    console.log(data_src);
    let currentChapter = splitChapterUrl(data_src)
    return currentChapter;
}

function splitChapterUrl(arg) {
    console.log(arg)
    // ../../static/images/1/8-b.png
    const regex = /.*\/(\d+\/\d+\-[ab])\.png/;
    const found = arg.match(regex);
    console.log(found);
    return found[1];
}

async function getPageUrl(arg) {
    return await new Promise((resolve, reject) => {
        fetch('/api/nextpage?current=' + arg)
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            resolve(generateNewPageUrl(data.url));
        })
        .catch((error) => {
            console.error('Error:', error);
            reject("nada")
        });
    });
}

function generateNewPageUrl(next_url) {
    const container = document.getElementById("img-container");
    var image = document.createElement("img");
    image.setAttribute("data-src", next_url);
    image.classList.add("js-lazy-image")
    container.appendChild(image)
    return image;
}

export default LazyLoad;
