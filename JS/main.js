'use strict';

// Проверка локального хранилища на наличие необходимых данных --- Checking local storage for required data 
(function instantCheckStorage() {
    if (localStorage.getItem("WildBook's books") != null && localStorage.getItem("WildBook's cart") != null && localStorage.getItem("WildBook's profiles") != null) {
        return;
    }

    else {
        localStorage.setItem("WildBook's books", JSON.stringify(booksData));
        localStorage.setItem("WildBook's cart", JSON.stringify(cartData));
        localStorage.setItem("WildBook's profiles", JSON.stringify(profilesData));
    };
    
} () );

// Установка плавной прокрутки якорям --- Setting a smooth scrolling to anchors
(function setSmoothBehaviour() {
    let anchors = document.querySelectorAll('a[href^="#"]');

    for (let iterator of anchors) {
        iterator.addEventListener('click', function (event) {
            event.preventDefault();
            let path = iterator.getAttribute('href'), element = document.querySelector(path).scrollIntoView({
                block: 'center',
                behavior: 'smooth'
            });
        });
    };
}());

let $buttonUp = $('.buttonUp');
$buttonUp.hide();

$buttonUp.on('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Рендер кнопки наверх --- Button's up render
(function renderButtonUp() {
    window.addEventListener('scroll', renderButtonUp)
    let $scrolledCoords = $(document).scrollTop(),
        $windowHeight = $(window).height();

    if ($scrolledCoords > $windowHeight) {
        $buttonUp.fadeIn(400);
    }

    else {
        $buttonUp.fadeOut(400);
    };
}());

//Инициализация и настройка слайдера --- Slider's initialization and customization
(function slickSlider() {
    $('.slider').slick({
        arrows: false,
        dots: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        fade: true,
        speed: 1000,
        autoplay: true,
        autoplaySpeed: 10000,
        responsive: [
            {
                breakpoint: 1025,
                settings: {
                    dots: false
                }
            }
        ]
    });

}());

function parseJSON() {
    return JSON.parse(localStorage.getItem("WildBook's books"));
};

function parseProfilesData() {
    return JSON.parse(localStorage.getItem("WildBook's profiles"));
};

function parseCartData() {
    return JSON.parse(localStorage.getItem("WildBook's cart"));
};

let buttonEntrance = document.querySelector('.modalEntrance__button'),
    buttonBlock = document.querySelector('.menu__item_profileBlock'),
    profilePhoto = document.querySelector('.modalProfile__photo'),
    profileEmail = document.querySelector('#profileEmail'),
    profileLogin = document.querySelector('#profileLogin'),
    profilePassword = document.querySelector('#profilePassword'),
    cart = document.querySelector('#cart'),
    cartItems = parseCartData(),
    cartButton = document.querySelector('#cartButton'),
    cartActive,
    isActive,
    profiles = parseProfilesData();

buttonEntrance.addEventListener('click', function(event) {
    event.preventDefault(); 
    profileEntrance();
});

// Проверка на наличие аккаунта пользователя и соответствующая рендеровка контента --- Checking for an user account and rendering necessary content
function profileEntrance() {
    let login = document.querySelector('#accountLogin'),
        password = document.querySelector('#accountPassword'),
        buttonProfile = document.querySelector('[data-fancybox="modalAccount"]'),
        userData = {
            "login": login.value,
            "password": password.value
        };
   
    profiles.forEach(element => {
        if (userData.login === element.login && userData.password === element.password) {
            isActive = true;
            cartActive = true;
            element.active = true;

            localStorage.setItem("WildBook's profiles", JSON.stringify(profiles));

            $.fancybox.close();
            buttonProfile.remove();

            let newButton = document.createElement('a');

            newButton.classList.add('menu__link', 'menu__link_style');
            newButton.innerText = element.login;
            newButton.setAttribute('data-fancybox', 'modalProfile');
            newButton.setAttribute('data-src', '#modalProfile');
            newButton.style.cursor = 'pointer';
            buttonBlock.prepend(newButton);

            profilePhoto.setAttribute('src', `${element.photo}`);
            profileEmail.value = element.email;
            profileLogin.value = element.login;
            profilePassword.value = element.password;

            checkCart();
        }

        else {
            return;
        };
    });
};

//Изменение данных аккаунта и подальшее занесение их в хранилище --- An user's data account changing and setting it into local storage
let buttonProfileEdit = document.querySelector('.modalProfile__edit'),
    photoChanged,
    profileIndex;

buttonProfileEdit.addEventListener('click', function(event) {
    event.preventDefault();

    let newUserData = {
        "email": profileEmail.value,
        "login": profileLogin.value,
        "password": profilePassword.value,
        "photo": profilePhoto.src,
        "active": true
    },
        question;

    profiles.forEach(element => {
        profileIndex = profiles.indexOf(element);
       
        if (newUserData.email !== element.email || newUserData.login !== element.login || newUserData.password !== element.password || photoChanged === true) {
            question = confirm('Применить внесенные изменения?');
                
            if (question === true) {
                photoChanged = false;

                if (element.admin === true) {
                    let newAdminData = {
                        "email": profileEmail.value,
                        "login": profileLogin.value,
                        "password": profilePassword.value,
                        "photo": profilePhoto.src,
                        "admin": true,
                        "active": true
                    };

                    profiles[profileIndex] = newAdminData;
                    localStorage.setItem("WildBook's profiles", JSON.stringify(profiles));
                }

                else {
                    profiles[profileIndex] = newUserData;
                    localStorage.setItem("WildBook's profiles", JSON.stringify(profiles));
                };
            }
        
            else {
                return;
            };
        }
        
        else {
            return;
        };
    });
});

//Выход из аккаунта --- Log out from the account
let buttonExit = document.querySelector('.modalProfile__exit');

buttonExit.addEventListener('click', function(event) {
    event.preventDefault();

    let questionExit = confirm('Вы уверены, что хотите выйти?');

    if (questionExit === true) {
        cartActive = false;
        isActive = false;
    
        profiles.forEach(el => {
            el.active = false;
        });

        localStorage.setItem("WildBook's profiles", JSON.stringify(profiles));
        changeProfileButton();
        checkCart();
    }

    else {
        return;
    };
});

//Рендер новой кнопки входа в аккаунт --- A new entrance button render
function changeProfileButton() {
    let oldButton = document.querySelector('.menu__link_style'),
        newButton = document.createElement('a');

    $.fancybox.close();
    oldButton.remove();

    newButton.classList.add('menu__link', 'menu__link_style');
    newButton.innerText = 'Личный кабинет';
    newButton.setAttribute('data-fancybox', 'modalAccount');
    newButton.setAttribute('data-src', '#modalAccount');
    newButton.style.cursor = 'pointer';
    buttonBlock.prepend(newButton);
};

let email = document.querySelector('#regEmail'),
    login = document.querySelector('#regLogin'),
    password = document.querySelector('#regPassword'),
    photo = document.querySelector('.modalReg__photo'),
    inputPhoto = document.querySelector('.modalReg__setPhoto');

//Регистрация нового аккаунта --- A new account registration
function profileRegistration() {
    let regButton = document.querySelector('.modalReg__button');

    regButton.addEventListener('click', () => {
        if (email.value === '' || login.value === '' || password.value === '') {
            regButton.removeAttribute('data-fancybox');
        }
    
        else {
            regButton.setAttribute('data-fancybox', 'modalSuccessfulReg');

            let regData = {
                "email": email.value,
                "login": login.value,
                "password": password.value,
                "photo": photo.src
            };

            profiles.push(regData);
            localStorage.setItem("WildBook's profiles", JSON.stringify(profiles));
        };
    });
};

profileRegistration();

//Изменение профильного изображения --- Changing a profile picture 
function chooseFileProfile(event) {
    let choosedFile = event.target,
        reader = new FileReader();
    
    reader.onload = function() {
        let dataUrl = reader.result,
            output = document.querySelector('.modalProfile__photo');
        
        output.src = dataUrl;
    };  

    reader.readAsDataURL(choosedFile.files[0]);
    photoChanged = true;
};

function chooseFile(event) {
    let choosedFile = event.target,
        reader = new FileReader();
    
    reader.onload = function() {
        let dataUrl = reader.result,
            output = document.querySelector('.modalReg__photo');
        
        output.src = dataUrl;
    };  

    reader.readAsDataURL(choosedFile.files[0]);
};

//Успешная регистрация и выход из аккаунта --- Successful registration and log out from the account
let buttonRegExit = document.querySelector('.modalSuccessReg__button');

buttonRegExit.addEventListener('click', () => {
    let allModals = document.querySelectorAll('.modal');

    allModals.forEach(element => {
        $.fancybox.close();
    });

    email.value = '';
    login.value = '';
    password.value = '';
    photo.src = './img/ProfilesPhotos/no-photo.jpg';
});

//Проверка корзины на доступность --- Checking cart for availability
function checkCart() {
    if (cartActive === true) {
        cart.classList.remove('menu__icon_style');
    }

    else {
        cart.classList.add('menu__icon_style');
    };
};

//Создание книг -- Book's information creating
function createNewBooks(imgPath = './img/books/Books-error.png', bookName = 'Название книги не найдено.') {
    return `<img src="${imgPath}" alt="New book" class="section4__img">
            <div class="section4__text">
                <h4 class="section4__h4" data-book="book">${bookName}</h4>
            </div>`
};

//Создание полной информации о книге --- Creating the whole information about book
function createInfoNewBooks(bookId = `${Math.random()}`, imgPath = './img/books/Books-error.png', bookName = 'Название книги не найдено.', bookPublishing = 'Издательство книги не найдено.', bookGenre = 'Жанр книги не найден.', bookAuthor = 'Автор книги не найден', bookYear = 'Год выпуска книги не найден', bookDesc = 'Описание книги не найдено', bookPrice = 'Цена книги не найдена.') {
    return `<div class="section4__info" data-id="${bookId}">
                <div class="section4__pic">
                    <img src="${imgPath}" alt="New book" class="section4__picture">
                </div>
                <div class="section4__information">
                    <h3 class="section4__h3 section4__h3_style">${bookName}</h3>
                    <h3 class="section4__h3"><span class="section4__inline">Издательство:</span> ${bookPublishing}</h3>
                    <h3 class="section4__h3"><span class="section4__inline">Жанр:</span> ${bookGenre}</h3>
                    <span class="section4__author"><span class="section4__inline">Автор:</span> ${bookAuthor}</span>
                    <span class="section4__author"><span class="section4__inline">Год издания:</span> ${bookYear}</span>
                    <p class="section4__desc">${bookDesc}</p>
                    <span class="section4__author"><span class="section4__inline">Цена:</span> ${bookPrice}₴</span>
                    <div class="section4__control">
                        <span class="section4__amount">Количество: </span>
                        <button type="button" class="section4__btnMinus">-</button>
                        <div class="section4__inputBlock">
                            <input type="number" class="section4__count" min="1" max="20" value="1" data-oldprice="${bookPrice}"></input>
                        </div>
                        <button type="button" class="section4__btnPlus">+</button>
                    </div>
                    <div class="section4__btnBuy">
                        <div class="section4__hint">Вы не зарегистрированы.</div>
                    </div>
                </div>
            </div>`
};

//Рендер новых книг --- Rendering new books 
function renderNewBooks() {
    parseJSON().forEach(element => {
        if (element.New === true) {
            let slider = document.querySelector('.section4__slider'),
                sliderItem = document.createElement('div'),
                ratingItem = document.createElement('div');

            sliderItem.classList.add('section4__slider-item');
            ratingItem.classList.add('section4__stars');
            sliderItem.setAttribute('data-book', "viewBook");
            sliderItem.dataset.id = element.id;
            sliderItem.innerHTML = createNewBooks(element.imageUrl, element.name, element.price, element.stars);

            slider.append(sliderItem);

            let sliderTexts = document.querySelectorAll('.section4__text');

            for (let i = 0; i < element.rating; i++) {
                let star = document.createElement('div');
                star.classList.add('section4__star');
                star.innerText = '★';

                ratingItem.append(star);
            };

            for (let j = element.rating; j < 5; j++) {
                let defaultStar = document.createElement('div');
                defaultStar.classList.add('section4__star', 'section4__star_style');
                defaultStar.innerText = '★';

                ratingItem.append(defaultStar);
            };

            sliderTexts.forEach(elem => {
                elem.append(ratingItem);
            });
        }

        else {
            return;
        };
    });
};

renderNewBooks();

(function slickSliderBooks() {
    $('.section4__slider').slick({
        arrows: false,
        dots: true,
        slidesToShow: 5,
        slidesToScroll: 5,
        speed: 700,
        infinite: false,
        responsive: [
            {
                breakpoint: 940,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4
                }
            },

            {
                breakpoint: 805,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3
                } 
            },

            {
                breakpoint: 580,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    infinite: true
                } 
            },

            {
                breakpoint: 421,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    speed: 650
                } 
            }
        ]
    });
}());

//Рендер информации о новых книгах --- Rendering a whole information about new books
function renderInfoNewBooks(bookId, imgPath, bookName, bookPublishing, bookGenre, bookAuthor, bookYear, bookDesc, bookPrice) {
    let subMain = document.querySelector('.section4__submain');
    subMain.innerHTML = createInfoNewBooks(bookId, imgPath, bookName, bookPublishing, bookGenre, bookAuthor, bookYear, bookDesc, bookPrice);

    let inputCount = document.querySelector('.section4__count'),
        controlBlock = document.querySelector('.section4__control'),
        buttonBuy = document.createElement('button'),
        buyBlock = document.querySelector('.section4__btnBuy');

    buttonBuy.classList.add('section4__buttonBuy');
    buttonBuy.innerText = 'В корзину';
    buyBlock.prepend(buttonBuy); 

    if (isActive === true) {
        controlBlock.classList.remove('section4__control_style');
        buttonBuy.classList.remove('section4__buttonBuy_style');
        buttonBuy.removeAttribute('disabled');

        let cartSpan = document.querySelector('#cartCount'),
            cartCount = +cart.innerText,
            btnMinus = document.querySelector('.section4__btnMinus'),
            btnPlus = document.querySelector('.section4__btnPlus'),
            inputDataset = bookPrice,
            cartOrder = {
                "orderId": bookId,
                "orderPrice": bookPrice,
                "orderAmount": +inputCount.value
            };

        btnMinus.addEventListener('click', function() {
            if (inputCount.value > 1) {
                inputCount.value--;
                decreaseBookAmount();
            }

            else {
                return;
            };
        });

        btnPlus.addEventListener('click', function() {
            if (inputCount.value < 20) {
                inputCount.value++;
                increaseBookAmount();
            }

            else {
                return;
            };
        });

        //Увеличение стоимости книги ---  Increasing book's cost
        function increaseBookAmount() {
            let cur = +inputCount.dataset.oldprice;
            inputDataset += cur;
            inputCount.dataset.increasedprice = inputDataset;

            cartOrder = {
                "orderId": bookId,
                "orderPrice": inputDataset,
                "orderAmount": +inputCount.value
            };
        };
        
        //Уменьшение стоимости книги --- Decreasing book's cost
        function decreaseBookAmount() {
            let cur = +inputCount.dataset.oldprice;
            inputDataset -= cur;
            inputCount.dataset.increasedprice = inputDataset;

            cartOrder = {
                "orderId": bookId,
                "orderPrice": inputDataset,
                "orderAmount": +inputCount.value
            };
        };

        buttonBuy.addEventListener('click', function(event) {
            event.preventDefault();
            
            alert('Книга успешно добавлена в корзину.');

            let cartItem = document.createElement('div'),
                buttonBuyBlock = document.querySelector('.modalCart__buyBlock');

            cartItem.classList.add('modalCart__item');
            cartItem.dataset.id = bookId;
            cartItem.dataset.price = inputDataset;
            cartItem.dataset.amount = +inputCount.value;
            buttonBuyBlock.style.display = 'flex';
            cartItems.push(cartOrder);

            cartCount = cartItems.length;
            cartSpan.innerText = cartCount;

            localStorage.setItem("WildBook's cart", JSON.stringify(cartItems));
            
            cartItem.innerHTML = createCartItem(imgPath, bookName, cartOrder.orderPrice, cartOrder.orderAmount);
            cartItemsBlock.append(cartItem);

            let cartTotalPrice = document.querySelector('#finalPrice'),
                priceTexts = document.querySelectorAll('.modalCart__price'),
                allPrices = 0;

            let renderTotalPrice = (price) => {
                cartTotalPrice.textContent = `${price}₴`;
            };
            
            //Немедленный рендер итоговой цены --- Immediate final price render
            ( function instantRenderTotalPrice() {
                priceTexts.forEach(element => {
                    return allPrices += parseInt(element.textContent);
                });
            
                renderTotalPrice(allPrices);
        
            } () );

            $(".modalCart__delete").each(function() { 
                $(this).on('click', deleteCartItem);
            });
            
            //Удаление товаров из корзины --- Deleting cart items from the cart
            function deleteCartItem() {
                $(this).closest($('.modalCart__item')).remove();
                priceTexts = document.querySelectorAll('.modalCart__price');
        
                render_total_price_after_delete(priceTexts);
                updateStorage($('.modalCart__item'));
            
                cartCount = cartItems.length;
                cartSpan.innerText = cartCount;
            };
        
            function render_total_price_after_delete(cartLength) {
                let newTotalPrice = 0;
        
                cartLength.forEach(element => {
                    return newTotalPrice += parseInt(element.textContent);
                });
        
                renderTotalPrice(newTotalPrice);
            };
        
            function updateStorage(itemsArray) {
                let $newCartItem;
                cartItems = [];
               
                itemsArray.each(function() {
                    $newCartItem = {
                        "orderId": +$(this).attr("data-id"),
                        "orderPrice": +$(this).attr("data-price"),
                        "orderAmount": +$(this).attr("data-amount")
                    };
        
                    cartItems.push($newCartItem);
                });
        
                localStorage.setItem("WildBook's cart", JSON.stringify(cartItems));

                if (cartItems.length === 0) {
                    buttonBuyBlock.style.display = 'none';
                };
            };
        });
    }

    else {
        controlBlock.classList.add('section4__control_style');
        buttonBuy.classList.add('section4__buttonBuy_style');
        buttonBuy.setAttribute('disabled', 'disabled');
    };
};

//Получение необходимой книги по ID --- Receiving a book by ID
function returnBook(bookId) {
    let currentBook;

    parseJSON().forEach(element => {
        if (+bookId === +element.id) {
            currentBook = element;
        }

        else {
            return;
        };
    });

    return currentBook;
};

let sliderItems = document.querySelectorAll('.section4__slider-item');

(function showDefaultNewBook() {
    let allNewBooks = [];

    parseJSON().forEach(element => {
        if (element.New === true) {
            allNewBooks.push(element.id);
        }

        else {
            return;
        };
    });

    renderInfoNewBooks(returnBook(allNewBooks[0]).id, returnBook(allNewBooks[0]).imageUrl, returnBook(allNewBooks[0]).name, returnBook(allNewBooks[0]).publishingHouse, returnBook(allNewBooks[0]).genre, returnBook(allNewBooks[0]).author, returnBook(allNewBooks[0]).year, returnBook(allNewBooks[0]).description, returnBook(allNewBooks[0]).price);

}());

function bookClick() {
    sliderItems.forEach(element => {
        element.addEventListener('click', () => {
            let tappedBook = returnBook(element.dataset.id);

            history.pushState(null, null, `?id=${tappedBook.id}#view`);

            renderInfoNewBooks(tappedBook.id, tappedBook.imageUrl, tappedBook.name, tappedBook.publishingHouse, tappedBook.genre, tappedBook.author, tappedBook.year, tappedBook.description, tappedBook.price);
        });
    });
};

bookClick();

//Проверка адресной строки --- Checking url adress
(function checkAdress() {
    let adressHash = location.hash.slice(1),
        adressSearch = location.search.slice(4);

    if (adressHash === '' && adressSearch === '') {
        return;
    }

    else {
        if (adressHash === 'view') {
            renderInfoNewBooks(returnBook(adressSearch).id, returnBook(adressSearch).imageUrl, returnBook(adressSearch).name, returnBook(adressSearch).publishingHouse, returnBook(adressSearch).genre, returnBook(adressSearch).author, returnBook(adressSearch).year, returnBook(adressSearch).description, returnBook(adressSearch).price);

            $('html').animate({
                scrollTop: $('#newBooks').offset().top
            }, 650);
        }

        else {
            return;
        };
    };
}());

//Немедленная рендеровка всего необходимого контента и запуск скриптов обработки данных -- An immediate render the whole content and launching data processing scripts
$(document).ready(function() {
    let buttonProfile = document.querySelector('.menu__link_style');
    
    profiles.forEach(element => {
        if (element["active"]) {
            isActive = true;
            cartActive = true;
            $.fancybox.close();
            buttonProfile.remove();

            let newButton = document.createElement('a');

            newButton.classList.add('menu__link', 'menu__link_style');
            newButton.innerText = element.login;
            newButton.setAttribute('data-fancybox', 'modalProfile');
            newButton.setAttribute('data-src', '#modalProfile');
            newButton.style.cursor = 'pointer';
            buttonBlock.prepend(newButton);

            profilePhoto.setAttribute('src', `${element.photo}`);
            profileEmail.value = element.email;
            profileLogin.value = element.login;
            profilePassword.value = element.password;

            checkCart(); 
        }

        else {
            return;
        };
    });
});

let modalCart = document.querySelector('#modalCart'),
    cartImage = document.querySelector('.modalCart__image'),
    cartItemsBlock = document.querySelector('.modalCart__items');

function createCartItem(imgPath, bookName, bookPrice, bookAmount) {
    return `<div class="modalCart__remove">
                <i class="far fa-trash-alt modalCart__delete"></i>
            </div>
            <img src="${imgPath}" alt="${bookName}" class="modalCart__image">
            <div class="modalCart__info">
                <p class="modalCart__name">Название: ${bookName}</p>
                <div class="modalCart__count"><span class="modalCart__span">Количество: ${bookAmount}</span></div>
                <div>Цена: <span class="modalCart__price">${bookPrice}</span>₴</div>
            </div>`;
};

cartButton.addEventListener('click', () => {
    if (cartActive === true) {
        cartButton.setAttribute("data-fancybox", "modalCart");
        cartButton.setAttribute("data-src", "#modalCart");
        cartButton.setAttribute("href", "javascript:;");
    }

    else {
        alert('Зарегистрируйтесь, что бы иметь доступ к своей личной корзине.');
        cartButton.style.cursor = 'pointer';
        cartButton.removeAttribute("data-fancybox", "modalCart");
        cartButton.removeAttribute("data-src", "#modalCart");
        cartButton.removeAttribute("href", "javascript:;");
        return;
    };
});

let cartSpan = document.querySelector('#cartCount'),
    cartCount = +cart.innerText;

( function instantRenderCart() {
    cartItems.forEach(element => {
        let cartItem = document.createElement('div');

        cartItem.classList.add('modalCart__item');
        cartItem.dataset.id = element.orderId;
        cartItem.dataset.price = element.orderPrice;
        cartItem.dataset.amount = element.orderAmount;
        cartCount = cartItems.length;
        cartSpan.innerText = cartCount;

        cartItem.innerHTML = createCartItem(returnBook(element.orderId).imageUrl, returnBook(element.orderId).name, element.orderPrice, element.orderAmount);
        cartItemsBlock.append(cartItem);
    });

    let cartTotalPrice = document.querySelector('#finalPrice'),
        priceTexts = document.querySelectorAll('.modalCart__price'),
        allPrices = 0,
        buttonClear = document.querySelector('.modalCart__buy'),
        buttonBuyBlock = document.querySelector('.modalCart__buyBlock');

    if (cartItems.length === 0) {
        buttonBuyBlock.style.display = 'none'
    };

    let renderTotalPrice = (price) => {
        cartTotalPrice.textContent = `${price}₴`;
    };

    ( function instantRenderTotalPrice() {
        priceTexts.forEach(element => {
            return allPrices += parseInt(element.textContent);
        });

        renderTotalPrice(allPrices);

    } () );

    $(".modalCart__delete").each(function() { 
        $(this).on('click', deleteCartItem);
    });

    function deleteCartItem() {
        $(this).closest($('.modalCart__item')).remove();
        priceTexts = document.querySelectorAll('.modalCart__price');

        render_total_price_after_delete(priceTexts);
        updateStorage($('.modalCart__item'));

        cartCount = cartItems.length;
        cartSpan.innerText = cartCount;

        if (cartItems.length === 0) {
            buttonBuyBlock.style.display = 'none'
        };
    };

    function render_total_price_after_delete(cartLength) {
        let newTotalPrice = 0;

        cartLength.forEach(element => {
            return newTotalPrice += parseInt(element.textContent);
        });

        renderTotalPrice(newTotalPrice);
    };

    function updateStorage(itemsArray) {
        let $newCartItem;
        cartItems = [];

        itemsArray.each(function() {
            $newCartItem = {
                "orderId": +$(this).attr("data-id"),
                "orderPrice": +$(this).attr("data-price"),
                "orderAmount": +$(this).attr("data-amount")
            }

            cartItems.push($newCartItem);
        });

        localStorage.setItem("WildBook's cart", JSON.stringify(cartItems));
    };

    buttonClear.addEventListener('click', () => {
        checkInput();
    });

    function checkInput() {
        let input = document.querySelector('.modalCart__email');

        if (input.value === '' || input.value === ' ') {
            buttonClear.removeAttribute('type');
        }

        else {
            cartItems = [];
            localStorage.setItem("WildBook's cart", JSON.stringify(cartItems));
            buttonClear.setAttribute('type', 'submit');
        };
    };

} () );