function slider({nextArrow, prevArrow, currentCounter, wrapper, field}) {
    function offerSliderRender (container, slideIndex, data, total) {
        container.innerHTML = 
            `<div class="offer__slider-counter">
                <div class="offer__slider-prev">
                    <img src="icons/left.svg" alt="prev">
                </div>
                <span id="current"></span>
                /
                <span id="total">${total}</span>
                <div class="offer__slider-next">
                    <img src="icons/right.svg" alt="next">
                </div>
            </div>
            <div class="offer__slider-wrapper">
                <div class="offer__slider-inner">
                    
                </div>
            </div>`;
        return container;
        // <img src="${data[slideIndex-1].img}" alt="pepper"></img>
    };

    function getImgSlider(){

    };

    /*  SIMPLE SLIDER */
    /*
    function counter(container, slideIndex, data) {
        const total = data.length < 10 ? `0${data.length}` : data.length;

        offerSliderRender(container, slideIndex, data, total);
        container.addEventListener('click', () => {
            const offerCounterPrev = document.querySelector('.offer__slider-prev');
            const offerCounterNext = document.querySelector('.offer__slider-next');
            
            offerCounterPrev.addEventListener('click', () => {
                slideIndex === 1 ? slideIndex = data.length : --slideIndex;
                offerSliderRender(container, slideIndex, data, total);
            });

            offerCounterNext.addEventListener('click', () => {
                slideIndex === data.length ? slideIndex = 1 : ++slideIndex;
                offerSliderRender(container, slideIndex, data, total);
            });
        });
    };
    */

    function styleTransform (tag, offset) {
        tag.style.transform = `translateX(-${offset}px)`;
    };

    function addNull (container, index) {
        index < 10 ? container.textContent = `0${index}` : container.textContent = index;
    };

    function createSlider() {
        const offerAdvantages = document.querySelector('.offer__advantages');
        const offerSlider = document.createElement('div');
        offerSlider.classList.add('offer__slider');
        offerAdvantages.after(offerSlider);
        

        axios.get('http://localhost:3000/slider')
            .then(data => {return data.data})
            .then(data => {
                let slideIndex = 1;
                let offset = 0;
                const total = data.length < 10 ? `0${data.length}` : data.length;
                

                // counter(offerSlider, slideIndex, data);
                offerSliderRender(offerSlider, slideIndex, data, total);
                let current = document.querySelector(currentCounter);
                addNull (current, slideIndex);
                
                const slidesField = document.querySelector(field);
                const slidesWrapper = document.querySelector(wrapper);
                const width = window.getComputedStyle(slidesWrapper).width;
                const prev = document.querySelector(prevArrow);
                const next = document.querySelector(nextArrow);

                slidesField.style.width = 100 * total + "%";
                slidesField.style.display = 'flex';
                slidesField.style.transition = '0.5s all';

                slidesWrapper.style.overflow = 'hidden';

                offerSlider.style.position = 'relative';

                const indicators = document.createElement('ol'),
                    dots = [];
                indicators.classList.add('carousel-indicators');
                indicators.style.cssText = `
                    position: absolute;
                    right: 0;
                    bottom: 0;
                    left: 0;
                    z-index: 15;
                    display: flex;
                    justify-content: center;
                    margin-right: 15%;
                    margin-left: 15%;
                    list-style: none;
                `;
                offerSlider.append(indicators);

                for (let i = 0; i < data.length; i++) {
                    const dot = document.createElement('li');
                    dot.setAttribute('data-slide-to', i + 1);
                    dot.style.cssText = `
                        box-sizing: content-box;
                        flex: 0 1 auto;
                        width: 30px;
                        height: 6px;
                        margin-right: 3px;
                        margin-left: 3px;
                        cursor: pointer;
                        background-color: #fff;
                        background-clip: padding-box;
                        border-top: 10px solid transparent;
                        border-bottom: 10px solid transparent;
                        opacity: .5;
                        transition: opacity .6s ease;
                    `;
                    if (i == 0) {
                        dot.style.opacity = 1;
                    };
                    indicators.append(dot);
                    dots.push(dot);
                };

                function deleteNotDigits(str) {
                    return +str.replace(/\D/g, '');
                };

                data.forEach(slide => {
                    const src = slide.img;
                    const alt = slide.alt;
                    const offerSlide = document.createElement('div');
                    offerSlide.classList.add('offer__slide');
                    slidesField.append(offerSlide);
                    offerSlide.innerHTML = `<img src="${src}" alt="${alt}" style="width: ${width}"></img>`;
                });

                prev.addEventListener('click', () => {
                    offset == 0 ? offset = deleteNotDigits(width) * (total - 1) : offset -= deleteNotDigits(width);
                    styleTransform (slidesField, offset);
                    
                    addNull (current, slideIndex);

                    dots.forEach( dot => dot.style.opacity = '.5');
                    dots[slideIndex-1].style.opacity = 1;
                });

                next.addEventListener('click', () => {
                    offset == deleteNotDigits(width) * (total - 1) ? offset = 0 : offset += deleteNotDigits(width);
                    styleTransform (slidesField, offset);
                    slideIndex === data.length ? slideIndex = 1 : ++slideIndex;
                    addNull (current, slideIndex);

                    dots.forEach( dot => dot.style.opacity = '.5');
                    dots[slideIndex-1].style.opacity = 1;
                });

                dots.forEach(dot => {
                    dot.addEventListener('click', (e) => {
                        const slideTo = e.target.getAttribute('data-slide-to');

                        slideIndex = slideTo;
                        offset = deleteNotDigits(width) * (slideTo - 1);

                        styleTransform (slidesField, offset);

                        dots.forEach(dot => dot.style.opacity = '.5');
                        dots[slideIndex-1].style.opacity = 1;

                        addNull (current, slideIndex);

                    });
                });
            });
        
    };
    createSlider();
};

export default slider;