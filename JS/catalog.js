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

window.addEventListener('hashchange', checkAdress);

let $buttonUp = $('.buttonUp');
$buttonUp.hide();

$buttonUp.on('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Рендер кнопки наверх --- Button's up render
( function renderButtonUp() {
    window.addEventListener('scroll', renderButtonUp)
    let $scrolledCoords = $(document).scrollTop(),
        $windowHeight = $(window).height();
    
    if ($scrolledCoords > $windowHeight) {
        $buttonUp.fadeIn(400);
    }

    else {
        $buttonUp.fadeOut(400);
    };
} () );

$(function() {
    $('html').animate({
        scrollTop: $('#catalog').offset().top
    }, 650);
});

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
    adminRight,
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
            if (element.admin === true) {
                adminRight = true;
            }

            element.active = true;

            localStorage.setItem("WildBook's profiles", JSON.stringify(profiles));
         
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
let buttonProfileExit = document.querySelector('.modalProfile__exit');

buttonProfileExit.addEventListener('click', function(event) {
    event.preventDefault();

    let questionExit = confirm('Вы уверены, что хотите выйти?');

    if (questionExit === true) {
        adminRight = false;
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

function chooseFileReg(event) {
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
function createBooks(imgPath = './img/books/Books-error.png', bookName = 'Название книги не найдено.') {
    return `<img src="${imgPath}" alt="Book" class="section2__bookImage">
            <h3 class="section2__name">${bookName}</h3>`;
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

//Рендер рейтинга книг --- Rendering books rating
let returnedId = [],
    aside = document.querySelector('.section2__aside');

function renderBookStars() {
    for (let i = 0; i < returnedId.length; i++) {
        let returnedBooks = returnBook(returnedId[i]),
            asideItem = document.createElement('div'),
            ratingItem = document.createElement('div');
        
        asideItem.classList.add('section2__asideItem');
        ratingItem.classList.add('section2__rating'); 
        asideItem.setAttribute('data-book', "viewBook");
        asideItem.dataset.id = returnedBooks.id;

        asideItem.innerHTML = createBooks(returnedBooks.imageUrl, returnedBooks.name);
        aside.append(asideItem);

        let asideItems = document.querySelectorAll('.section2__asideItem');

        for (let j = 0; j < returnedBooks.rating; j++) {
            let star = document.createElement('div');
            star.classList.add('section2__star');
            star.innerText = '★';

            ratingItem.append(star);
        };

        for (let k = returnedBooks.rating; k < 5; k++) {
            let defaultStar = document.createElement('div');

            defaultStar.classList.add('section2__star', 'section2__star_style');
            defaultStar.innerText = '★';

            ratingItem.append(defaultStar);
        };

        asideItems.forEach(elem => {
            elem.append(ratingItem);
            
            elem.addEventListener('click', () => {
                let tappedBook = returnBook(elem.dataset.id);

                renderInfoBooks(tappedBook.id, tappedBook.imageUrl, tappedBook.name, tappedBook.publishingHouse, tappedBook.genre, tappedBook.author, tappedBook.year, tappedBook.description, tappedBook.price);
                addUrl(tappedBook.id, 'view');
                openEditBooks();
            }); 
        });
    };

    openAddBooks();
};

//Фильтрация книг по рейтингу книг --- Books filtration by rating
function filter_and_render_stars() {
    function getBooksId(price) {
        parseJSON().forEach(elem => {
            if (elem.price === price) {
                returnedId.push(elem.id);

                booksFilteredId = returnedId.filter(function(item, pos) {
                    return returnedId.indexOf(item) == pos;
                });
            }

            else {
                return;
            };
        });
    };

    for (let i = 0; i < booksPrice.length; i++) {
        getBooksId(booksPrice[i]);
    };

    for (let j = 0; j < booksFilteredId.length; j++) {
        let filteredBook = returnBook(booksFilteredId[j]),
            asideItem = document.createElement('div'),
            ratingItem = document.createElement('div');

        asideItem.classList.add('section2__asideItem');
        ratingItem.classList.add('section2__rating'); 
        asideItem.setAttribute('data-book', "viewBook");
        asideItem.dataset.id = filteredBook.id;

        asideItem.innerHTML = createBooks(filteredBook.imageUrl, filteredBook.name);
        aside.append(asideItem);

        let asideItems = document.querySelectorAll('.section2__asideItem');

        for (let k = 0; k < filteredBook.rating; k++) {
            let star = document.createElement('div');
            star.classList.add('section2__star');
            star.innerText = '★';

            ratingItem.append(star);
        };

        for (let o = filteredBook.rating; o < 5; o++) {
            let defaultStar = document.createElement('div');
            defaultStar.classList.add('section2__star', 'section2__star_style');
            defaultStar.innerText = '★';

            ratingItem.append(defaultStar);
        };

        asideItems.forEach(e => {
            e.append(ratingItem);

            e.addEventListener('click', () => {
                let tappedBook = returnBook(e.dataset.id);
    
                renderInfoBooks(tappedBook.id, tappedBook.imageUrl, tappedBook.name, tappedBook.publishingHouse, tappedBook.genre, tappedBook.author, tappedBook.year, tappedBook.description, tappedBook.price);
                addUrl(tappedBook.id, 'view');
                openEditBooks();
            }); 
        });
    };

    openAddBooks();
};

//Фильтрация книг по цене --- Books filtration by cost
( function renderRangeValue() {
    let range = document.querySelector('#range'),
        rangeActiveText = document.querySelector('#activeRange'),
        button = document.querySelector('#filter');
    
    rangeActiveText.innerText = `${range.value}₴`;
    
    range.addEventListener('input', () => {
        rangeActiveText.innerText = `${range.value}₴`;
    });
    
    button.addEventListener('click', () => {
        aside.innerHTML = '';
        returnedId = [];

        let blockAdd = document.createElement('div'),
            buttonAdd = document.createElement('i');

        blockAdd.classList.add('section2__blockAdd');
        buttonAdd.classList.add("far", "fa-plus-square", "section2__add");

        blockAdd.append(buttonAdd);
        aside.append(blockAdd);

        parseJSON().forEach(element => {
            if (element.price <= range.value) {
                returnedId.push(element.id);
            }

            else {
                return;
            }
        });

        renderBookStars();
    }); 
} () );

//Рендер всех книг по умолчанию -- Render all books
function renderDefaultBooks() {
    aside.innerHTML = '';

    let blockAdd = document.createElement('div'),
        buttonAdd = document.createElement('i');

    blockAdd.classList.add('section2__blockAdd');
    buttonAdd.classList.add("far", "fa-plus-square", "section2__add");

    blockAdd.append(buttonAdd);
    aside.append(blockAdd);

    parseJSON().forEach(element => {
        let asideItem = document.createElement('div'),
            ratingItem = document.createElement('div');

        asideItem.classList.add('section2__asideItem');
        ratingItem.classList.add('section2__rating'); 
        asideItem.setAttribute('data-book', "viewBook");
        asideItem.dataset.id = element.id;

        asideItem.innerHTML = createBooks(element.imageUrl, element.name);
        aside.append(asideItem);

        let asideItems = document.querySelectorAll('.section2__asideItem');

        for (let i = 0; i < element.rating; i++) {
            let star = document.createElement('div');
            star.classList.add('section2__star');
            star.innerText = '★';

            ratingItem.append(star);
        };

        for (let j = element.rating; j < 5; j++) {
            let defaultStar = document.createElement('div');
            defaultStar.classList.add('section2__star', 'section2__star_style');
            defaultStar.innerText = '★';

            ratingItem.append(defaultStar);
        };

        asideItems.forEach(elem => {
            elem.append(ratingItem);

            elem.addEventListener('click', () => {
                let tappedBook = returnBook(elem.dataset.id);
    
                renderInfoBooks(tappedBook.id, tappedBook.imageUrl, tappedBook.name, tappedBook.publishingHouse, tappedBook.genre, tappedBook.author, tappedBook.year, tappedBook.description, tappedBook.price);
                addUrl(tappedBook.id, 'view');
                openEditBooks();
            }); 
        });
    });

    openAddBooks();
};

renderDefaultBooks();

//Фильтрация книг - только новые --- Books filtration - only new
function renderNewBooks() {
    aside.innerHTML = '';
    
    let blockAdd = document.createElement('div'),
        buttonAdd = document.createElement('i');

    blockAdd.classList.add('section2__blockAdd');
    buttonAdd.classList.add("far", "fa-plus-square", "section2__add");

    blockAdd.append(buttonAdd);
    aside.append(blockAdd);
    
    parseJSON().forEach(element => {
        if (element.New === true) {
            let asideItem = document.createElement('div'),
            ratingItem = document.createElement('div');
            
            asideItem.classList.add('section2__asideItem');
            ratingItem.classList.add('section2__rating'); 
            asideItem.setAttribute('data-book', "viewBook");
            asideItem.dataset.id = element.id;
            
            asideItem.innerHTML = createBooks(element.imageUrl, element.name);
            aside.append(asideItem);
            
            let asideItems = document.querySelectorAll('.section2__asideItem');

            for (let i = 0; i < element.rating; i++) {
                let star = document.createElement('div');
                star.classList.add('section2__star');
                star.innerText = '★';

                ratingItem.append(star);
            };

            for (let j = element.rating; j < 5; j++) {
                let defaultStar = document.createElement('div');
                defaultStar.classList.add('section2__star', 'section2__star_style');
                defaultStar.innerText = '★';

                ratingItem.append(defaultStar);
            };

            asideItems.forEach(elem => {
                elem.append(ratingItem);

                elem.addEventListener('click', () => {
                    let tappedBook = returnBook(elem.dataset.id);
        
                    renderInfoBooks(tappedBook.id, tappedBook.imageUrl, tappedBook.name, tappedBook.publishingHouse, tappedBook.genre, tappedBook.author, tappedBook.year, tappedBook.description, tappedBook.price);
                    addUrl(tappedBook.id, 'view');
                    openEditBooks();
                }); 
            });

            openAddBooks();
        }
        
        else {
            return;
        };
    });
};

let booksPrice = [],
    booksFilteredId = [];

//Фильтрация книг - от дорогих к дешевым --- Books filtration - from expensive to cheap
function renderMaxToMinBooks() {
    aside.innerHTML = '';
    returnedId = [];

    let blockAdd = document.createElement('div'),
        buttonAdd = document.createElement('i');

    blockAdd.classList.add('section2__blockAdd');
    buttonAdd.classList.add("far", "fa-plus-square", "section2__add");

    blockAdd.append(buttonAdd);
    aside.append(blockAdd);

    parseJSON().forEach(element => {
        booksPrice.push(element.price);
    });
    
    booksPrice.sort(function(a, b) {
        return b - a;
    });
    
    filter_and_render_stars();
};

//Фильтрация книг - от дешевых к дорогим --- Books filtration - from cheap to expensive
function renderMinToMaxBooks() {
    aside.innerHTML = '';
    returnedId = [];

    let blockAdd = document.createElement('div'),
        buttonAdd = document.createElement('i');

    blockAdd.classList.add('section2__blockAdd');
    buttonAdd.classList.add("far", "fa-plus-square", "section2__add");

    blockAdd.append(buttonAdd);
    aside.append(blockAdd);

    parseJSON().forEach(element => {
        booksPrice.push(element.price);
    });
    
    booksPrice.sort(function(a, b) {
        return a - b;
    });
    
    filter_and_render_stars();
};

//Фильтрация книг - рендер книг с наибольшим рейтингом --- Books filtration - rendering books with maximum rating
function renderMaxRatingBooks() {
    let booksRating = [];

    aside.innerHTML = '';
    returnedId = [];
    
    let blockAdd = document.createElement('div'),
        buttonAdd = document.createElement('i');

    blockAdd.classList.add('section2__blockAdd');
    buttonAdd.classList.add("far", "fa-plus-square", "section2__add");

    blockAdd.append(buttonAdd);
    aside.append(blockAdd);

    parseJSON().forEach(element => {
        booksRating.push(element.rating);
    });

    booksRating.sort(function(a, b) {
        return b - a;
    });

    function getBooksRating(rating) {
        parseJSON().forEach(elem => {
            if (elem.rating === rating) {
                returnedId.push(elem.id);

                booksFilteredId = returnedId.filter(function(item, pos) {
                    return returnedId.indexOf(item) == pos;
                });
            }

            else {
                return;
            };
        });
    };
    
    for (let i = 0; i < booksRating.length; i++) {
        getBooksRating(booksRating[i]);
    };

    for (let j = 0; j < booksFilteredId.length; j++) {
        let filteredBook = returnBook(booksFilteredId[j]),
            asideItem = document.createElement('div'),
            ratingItem = document.createElement('div');

        asideItem.classList.add('section2__asideItem');
        ratingItem.classList.add('section2__rating'); 
        asideItem.setAttribute('data-book', "viewBook");
        asideItem.dataset.id = filteredBook.id;

        asideItem.innerHTML = createBooks(filteredBook.imageUrl, filteredBook.name);
        aside.append(asideItem);

        let asideItems = document.querySelectorAll('.section2__asideItem');

        for (let k = 0; k < filteredBook.rating; k++) {
            let star = document.createElement('div');
            star.classList.add('section2__star');
            star.innerText = '★';

            ratingItem.append(star);
        };

        for (let o = filteredBook.rating; o < 5; o++) {
            let defaultStar = document.createElement('div');
            defaultStar.classList.add('section2__star', 'section2__star_style');
            defaultStar.innerText = '★';

            ratingItem.append(defaultStar);
        };

        asideItems.forEach(e => {
            e.append(ratingItem);

            e.addEventListener('click', () => {
                let tappedBook = returnBook(e.dataset.id);
    
                renderInfoBooks(tappedBook.id, tappedBook.imageUrl, tappedBook.name, tappedBook.publishingHouse, tappedBook.genre, tappedBook.author, tappedBook.year, tappedBook.description, tappedBook.price);
                addUrl(tappedBook.id, 'view');
                openEditBooks();
            }); 
        });
    };

    openAddBooks();
};

//Поиск книги по названию --- Searching book by name
function returnBookName() {
    let searchingName = document.querySelector('.section2__searchBook').value;

    aside.innerHTML = '';
    returnedId = [];

    let blockAdd = document.createElement('div'),
        buttonAdd = document.createElement('i');

    blockAdd.classList.add('section2__blockAdd');
    buttonAdd.classList.add("far", "fa-plus-square", "section2__add");

    blockAdd.append(buttonAdd);
    aside.append(blockAdd);

    parseJSON().forEach(element => {
        if (searchingName === element.name) {
            returnedId.push(element.id);
        }
        
        else {
            return;
        };
    });
    
    renderBookStars();
};

//Поиск книги по автору --- Searching book by author
function returnBookAuthor() {
    let searchingAuthor  = document.querySelector('.section2__searchBook').value;

    aside.innerHTML = '';
    returnedId = [];

    let blockAdd = document.createElement('div'),
        buttonAdd = document.createElement('i');

    blockAdd.classList.add('section2__blockAdd');
    buttonAdd.classList.add("far", "fa-plus-square", "section2__add");

    blockAdd.append(buttonAdd);
    aside.append(blockAdd);

    parseJSON().forEach(element => {
        if (searchingAuthor === element.author) {
            returnedId.push(element.id);
        }
        
        else {
            return;
        };
    });
    
    renderBookStars();
};

//Поиск книги по жанру --- Searching book by genre
function returnBookGenre() {
    let searchingGenre = document.querySelector('.section2__searchBook').value;

    returnedId = [];
    aside.innerHTML = '';

    let blockAdd = document.createElement('div'),
        buttonAdd = document.createElement('i');

    blockAdd.classList.add('section2__blockAdd');
    buttonAdd.classList.add("far", "fa-plus-square", "section2__add");

    blockAdd.append(buttonAdd);
    aside.append(blockAdd);

    parseJSON().forEach(element => {
        if (searchingGenre === element.genre) {
            returnedId.push(element.id);
        }
    
        else {
            return;
        };
    });

    renderBookStars();
};

//Скрипт, запускающий определенную функцию в зависимости от условия --- A script, which launch certain function depending on the condition
function filterTypes() {
    let typesList = document.querySelector('.section2__list');
    
    typesList.addEventListener('change', () => {
        let typesListValue = document.querySelector('.section2__list').value;

        switch (typesListValue) {
            case 'default':
                renderDefaultBooks();
                break;
        
            case 'new':
                renderNewBooks();
                break;

            case 'priceMax':
                renderMaxToMinBooks();
                break;

            case 'priceMin':
                renderMinToMaxBooks();
                break;

            case 'rating':
                renderMaxRatingBooks();
                break;

            default:
                renderDefaultBooks();
                break;
        };
    });
};

filterTypes();

//Скрипт, запускающий определенную функцию в зависимости от условия(поиск книг за типами) --- A script, which launch certain function depending on the condition(searching books by types)
function filterRadios() {
    let radioName = document.querySelector('#radioName'),
        radioAuthor = document.querySelector('#radioAuthor'),
        radioGenre = document.querySelector('#radioGenre'),
        button = document.querySelector('.section2__button');
    
    button.addEventListener('click', () => {
        if (radioName.checked) {
            returnBookName();
        }

        if (radioAuthor.checked) {
            returnBookAuthor();
        }

        if (radioGenre.checked) {
            returnBookGenre();
        }

        else {
            return;
        };
    });
};

filterRadios();

//Создание информации о книге --- Creating information about book
function createInfoBooks(bookId = `${Math.random()}`, imgPath = './img/books/Books-error.png', bookName = 'Название книги не найдено.', bookPublishing = 'Издательство книги не найдено.', bookGenre = 'Жанр книги не найден.', bookAuthor = 'Автор книги не найден', bookYear = 'Год выпуска книги не найден', bookDesc = 'Описание книги не найдено', bookPrice = 'Цена книги не найдена.') {
    return `<div class="section2__info" data-id="${bookId}">
                <div class="section2__pic">
                    <img src="${imgPath}" alt="Book" class="section2__picture">
                </div>
                <div class="section2__information">
                    <h3 class="section2__h3 section2__h3_style">${bookName}</h3>
                    <h3 class="section2__h3"><span class="section2__inline">Издательство:</span> ${bookPublishing}</h3>
                    <h3 class="section2__h3"><span class="section2__inline">Жанр:</span> ${bookGenre}</h3>
                    <span class="section2__author"><span class="section2__inline">Автор:</span> ${bookAuthor}</span>
                    <span class="section2__author"><span class="section2__inline">Год издания:</span> ${bookYear}</span>
                    <span class="section2__author"><span class="section2__inline">Цена:</span> ${bookPrice}₴</span>
                    <div class="section2__desc">
                        <a class="section2__showDesc" data-fancybox="modalDesc" data-src="#modalDesc" href="javascript:;">Прочесть описание</a>
                        <div class="section2__control">
                            <span class="section2__amount">Количество: </span>
                            <button type="button" class="section2__btnMinus">-</button>
                            <div class="section2__inputBlock">
                                <input type="number" class="section2__count" min="1" max="20" value="1" data-oldprice="${bookPrice}"></input>
                            </div>
                            <button type="button" class="section2__btnPlus">+</button>
                        </div>
                    </div>
                    <div class="modalDesc" id="modalDesc">
                        <h3 class="section2__modalTitle">Описание</h3>
                        <h2 class="section2__modalDesc">${bookDesc}</h2>
                    </div>
                    <div class="section2__btnBuy">
                        <div class="section2__hint">Вы не зарегистрированы.</div>
                    </div>
                </div>
            </div>`
};

//Рендер информации о книге --- Rendering an information about book
function renderInfoBooks(bookId, imgPath, bookName, bookPublishing, bookGenre, bookAuthor, bookYear, bookDesc, bookPrice) {
    let subMain = document.querySelector('.section2__booksInfo');
    subMain.innerHTML = createInfoBooks(bookId, imgPath, bookName, bookPublishing, bookGenre, bookAuthor, bookYear, bookDesc, bookPrice);

    let editBlock = document.querySelector('.section2__pic'),
        buttonEdit = document.createElement('i'),
        buttonAdd = document.querySelector('.section2__blockAdd'),
        inputCount = document.querySelector('.section2__count'),
        controlBlock = document.querySelector('.section2__control'),
        buttonBuy = document.createElement('button'),
        buyBlock = document.querySelector('.section2__btnBuy');

    buttonEdit.classList.add('far', 'fa-edit', 'section2__edit');
    buttonBuy.classList.add('section2__buttonBuy');
    buttonBuy.innerText = 'В корзину';
    buyBlock.prepend(buttonBuy); 

    if (adminRight === true) {
        editBlock.prepend(buttonEdit);
        buttonAdd.style.display = 'block';
    }

    else {
        buttonEdit.remove();
        buttonAdd.style.display = 'none';
    };

    if (isActive === true) {
        controlBlock.classList.remove('section2__control_style');
        buttonBuy.classList.remove('section2__buttonBuy_style');
        buttonBuy.removeAttribute('disabled');

        let cartSpan = document.querySelector('#cartCount'),
            cartCount = +cart.innerText,
            btnMinus = document.querySelector('.section2__btnMinus'),
            btnPlus = document.querySelector('.section2__btnPlus'),
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
        controlBlock.classList.add('section2__control_style');
        buttonBuy.classList.add('section2__buttonBuy_style');
        buttonBuy.setAttribute('disabled', 'disabled');
    };
};

( function showDefaultBook() {
    let allBooks = [];

    parseJSON().forEach(element => {
        allBooks.push(element.id);
    });

    renderInfoBooks(returnBook(allBooks[0]).id, returnBook(allBooks[0]).imageUrl, returnBook(allBooks[0]).name, returnBook(allBooks[0]).publishingHouse, returnBook(allBooks[0]).genre, returnBook(allBooks[0]).author, returnBook(allBooks[0]).year, returnBook(allBooks[0]).description, returnBook(allBooks[0]).price);
    addUrl(returnBook(allBooks[0]).id, 'view');

} () );

//Запись нового адреса в адресную строку --- Writing new adress into url adress
function addUrl(id, action) {
    history.pushState({id: id, action: action}, null, `?id=${id}#${action}`);
};

let asideItems = document.querySelectorAll('.section2__asideItem');

function bookClick() {
    asideItems.forEach(element => {
        element.addEventListener('click', () => {
            let tappedBook = returnBook(element.dataset.id);
        
            renderInfoBooks(tappedBook.id, tappedBook.imageUrl, tappedBook.name, tappedBook.publishingHouse, tappedBook.genre, tappedBook.author, tappedBook.year, tappedBook.description, tappedBook.price);
            addUrl(tappedBook.id, 'view');
            openEditBooks();
        }); 
    });
};

bookClick();

//Проверка адресной строки --- Checking url adress
function checkAdress() {
    let adressHash = location.hash.slice(1),
        adressSearch = location.search.slice(4);

    if (adressHash === '' && adressSearch === '') {
        return;
    } 
    
    else {
        if (adressHash === 'View') {
            renderInfoBooks(returnBook(adressSearch).id, returnBook(adressSearch).imageUrl, returnBook(adressSearch).name, returnBook(adressSearch).publishingHouse, returnBook(adressSearch).genre, returnBook(adressSearch).author, returnBook(adressSearch).year, returnBook(adressSearch).description, returnBook(adressSearch).price);
        }

        if (adressHash === 'Edit') {
            renderEditInfoBooks(returnBook(adressSearch).id, returnBook(adressSearch).imageUrl, returnBook(adressSearch).name, returnBook(adressSearch).publishingHouse, returnBook(adressSearch).genre, returnBook(adressSearch).author, returnBook(adressSearch).year, returnBook(adressSearch).description, returnBook(adressSearch).price, returnBook(adressSearch).rating);

            let radioTrue = document.querySelector('[data-radio="new"]'),
                radioFalse = document.querySelector('[data-radio="notNew"]'),
                radioStatus = returnBook(adressSearch).New;
        
            if (radioStatus === true) {
                radioTrue.setAttribute('checked', '');
            }

            else if (radioStatus === false) {
                radioFalse.setAttribute('checked', '');
            };
        };

        if (adressSearch === '' && adressHash === 'Add') {
            renderAddInfoBooks();
        };
    };   
};

checkAdress();

//Рендер котнтента редактирования книги --- Rendering content "book editing"
function openEditBooks() {
    let buttonEdit = document.querySelector('.section2__edit'),
        adressSearch = location.search.slice(4);

    buttonEdit.addEventListener('click', () => {
        let editingBook = returnBook(adressSearch);

        addUrl(editingBook.id, 'edit');
        renderEditInfoBooks(editingBook.id, editingBook.imageUrl, editingBook.name, editingBook.publishingHouse, editingBook.genre, editingBook.author, editingBook.year, editingBook.description, editingBook.price, editingBook.rating);

        let radioTrue = document.querySelector('[data-radio="new"]'),
            radioFalse = document.querySelector('[data-radio="notNew"]'),
            radioStatus = editingBook.New;
        
        if (radioStatus === true) {
            radioTrue.setAttribute('checked', '');
        }

        else if (radioStatus === false) {
            radioFalse.setAttribute('checked', '');
        };
    });
};

//Создание информации о книге для редактирования --- Creating books information for editing
function createEditInfoBooks(bookId = `${Math.random()}`, imgPath = './img/books/Books-error.png', bookName = 'Название книги не найдено.', bookPublishing = 'Издательство книги не найдено.', bookGenre = 'Жанр книги не найден.', bookAuthor = 'Автор книги не найден', bookYear = 'Год выпуска книги не найден', bookDesc = 'Описание книги не найдено', bookPrice = 'Цена книги не найдена', bookRating = 'Рейтинг книги не найден') {
    return `<div class="section2__info" data-id="${bookId}">
                <div class="section2__pic">
                    <img src="${imgPath}" alt="Book" class="section2__picture" data-book="imgPath">
                    <input type="file" class="section2__file" onchange="chooseFile(event)" accept="image/*">
                </div>
                <div class="section2__information section2__information_edit">
                    <input type="text" class="section2__input section2__input_style" value="${bookName}" maxlength="100" data-book="bookName">
                    <div class="section2__inputs">
                        <span class="section2__inline section2__inline_style">Издательство:</span>
                        <input type="text" class="section2__input" value="${bookPublishing}" maxlength="100" data-book="bookPublishing">
                    </div>
                    <div class="section2__inputs">
                        <span class="section2__inline section2__inline_style">Жанр:</span>
                        <input type="text" class="section2__input" value="${bookGenre}" maxlength="100" data-book="bookGenre">
                    </div>
                    <div class="section2__inputs">
                        <span class="section2__inline section2__inline_style">Автор:</span>
                        <input type="text" class="section2__input" value="${bookAuthor}" maxlength="100" data-book="bookAuthor">
                    </div>
                    <div class="section2__inputs">
                        <span class="section2__inline section2__inline_style">Год издания:</span>
                        <input type="number" class="section2__input" value="${bookYear}" data-book="bookYear" min="868">
                    </div>
                    <div class="section2__inputs">
                        <span class="section2__inline section2__inline_style">Цена:</span>
                        <input type="number" class="section2__input" value="${bookPrice}" data-book="bookPrice" min="50">
                    </div>
                    <div class="section2__inputs">
                        <span class="section2__inline section2__inline_style">Рейтинг:</span>
                        <input type="number" class="section2__input" value="${bookRating}" min="1" max="5" data-book="bookRating">
                    </div>
                    <div class="section2__inputs">
                        <span class="section2__inline section2__inline_style">Новинка:</span>
                        <span class="section2__chooseSpan section2__chooseSpan_style">Да</span> <input type="radio" data-radio="new" class="section2__radio" name="editRadios">
                        <span class="section2__chooseSpan">Нет</span> <input type="radio" data-radio="notNew" class="section2__radio"  name="editRadios">
                    </div>
                    <div class="section2__desc">
                        <a class="section2__showDesc" data-fancybox="modalEditDesc" data-src="#modalEditDesc" href="javascript:;">Изменить описание</a>
                    </div>
                    <div class="modalDesc" id="modalEditDesc">
                        <h3 class="section2__modalTitle">Описание</h3>
                        <div class="section2__modalText">
                            <textarea cols="30" rows="10" class="section2__modalArea" data-book="bookDesc">${bookDesc}</textarea>
                        </div>
                    </div>
                    <div class="section2__buttons">
                        <button class="section2__editButton section2__editSave" data-button="save">Сохранить</button>
                        <div class="section2__editBlock">
                            <button class="section2__editButton section2__editCancel" data-button="cancel">Отменить</button>
                        </div>
                    </div>
                </div>
            </div>`
};

//Рендер страницы редактирования книг --- Rendering page for edit books
function renderEditInfoBooks(bookId, imgPath, bookName, bookPublishing, bookGenre, bookAuthor, bookYear, bookDesc, bookPrice, bookRating) {
    let subMain = document.querySelector('.section2__booksInfo');
    subMain.innerHTML = createEditInfoBooks(bookId, imgPath, bookName, bookPublishing, bookGenre, bookAuthor, bookYear, bookDesc, bookPrice, bookRating);

    acceptEditChanges(bookId);
};

//Сохранение внесенных данных и рендер --- Saving and rendering new data about book
function acceptEditChanges(id) {
    let imageUrl = document.querySelector('[data-book="imgPath"]'),
        bookName = document.querySelector('[data-book="bookName"]'),
        bookPublishing = document.querySelector('[data-book="bookPublishing"]'),
        bookGenre = document.querySelector('[data-book="bookGenre"]'),
        bookAuthor = document.querySelector('[data-book="bookAuthor"]'),
        bookYear = document.querySelector('[data-book="bookYear"]'),
        bookPrice = document.querySelector('[data-book="bookPrice"]'),
        bookRating = document.querySelector('[data-book="bookRating"]'),
        bookNew,
        radioTrue = document.querySelector('[data-radio="new"]'),
        radioFalse = document.querySelector('[data-radio="notNew"]'),
        bookDesc = document.querySelector('[data-book="bookDesc"]'),
        buttonSave = document.querySelector('[data-button="save"]'),
        buttonCancel = document.querySelector('[data-button="cancel"]');
    
    buttonSave.addEventListener('click', () => {
        if (radioTrue.checked) {
            bookNew = true;
        }
    
        else if (radioFalse.checked) {
            bookNew = false;
        };

        let changedBook = {
            "id": id,
            "name": bookName.value,
            "publishingHouse": bookPublishing.value,
            "genre": bookGenre.value,
            "author": bookAuthor.value,
            "year": bookYear.value,
            "description": bookDesc.value,
            "price": +bookPrice.value,
            "rating": +bookRating.value,
            "imageUrl": imageUrl.src,
            "New": bookNew
        },
            updatedBook;
        
        updateBook(id, changedBook);

        updatedBook = returnBook(changedBook.id);

        setTimeout(() => {
            alert('Книга успешно обновлена.');
        }, 450);

        renderInfoBooks(updatedBook.id, updatedBook.imageUrl, updatedBook.name, updatedBook.publishingHouse, updatedBook.genre, updatedBook.author, updatedBook.year, updatedBook.description, updatedBook.price);
        addUrl(updatedBook.id, 'view');
        openEditBooks();
        renderDefaultBooks();
        bookClick();
    });

    buttonCancel.addEventListener('click', () => {
        let currentBook = returnBook(id),
            cancelQuestion = confirm('Вы уверены, что хотите отменить изменения?');

        if (cancelQuestion === true) {
            renderEditInfoBooks(currentBook.id, currentBook.imageUrl, currentBook.name, currentBook.publishingHouse, currentBook.genre, currentBook.author, currentBook.year, currentBook.description, currentBook.price, currentBook.rating);

            let radioTrue = document.querySelector('[data-radio="new"]'),
                radioFalse = document.querySelector('[data-radio="notNew"]'),
                radioStatus = currentBook.New;
        
            if (radioStatus === true) {
                radioTrue.setAttribute('checked', '');
            }

            else if (radioStatus === false) {
                radioFalse.setAttribute('checked', '');
            };

            renderInfoBooks(currentBook.id, currentBook.imageUrl, currentBook.name, currentBook.publishingHouse, currentBook.genre, currentBook.author, currentBook.year, currentBook.description, currentBook.price);
            addUrl(currentBook.id, 'view');
        }

        else {
            return;
        };
    });
};

function updateBook(bookId, updatedBook) {
    let localBuffer = parseJSON(),
        bookIndex;

    localBuffer.forEach(element => {
        if (element.id === bookId) {
            bookIndex = localBuffer.indexOf(element);
        }
        
        else {
            return;
        };
    });

    localBuffer[bookIndex] = updatedBook;

    localStorage.setItem("WildBook's books", JSON.stringify(localBuffer));
};

function chooseFile(event) {
    let choosedFile = event.target,
        reader = new FileReader();
    
    reader.onload = function() {
        let dataUrl = reader.result,
            output = document.querySelector('.section2__picture');
        
        output.src = dataUrl;
    };  

    reader.readAsDataURL(choosedFile.files[0]);
};

//Создание контента для добавления книги --- Creating content for book's adding
function createAddInfoBooks(imgPath = './img/books/Books-error.png') {
    return `<div class="section2__info" data-id>
                <div class="section2__pic">
                    <img src="${imgPath}" alt="Book" class="section2__picture" data-book="imgPath">
                    <input type="file" class="section2__file" onchange="chooseFile(event)" accept="image/*">
                </div>
                <div class="section2__information section2__information_add">
                    <input type="text" class="section2__input section2__input_style" placeholder="ID книги" maxlength="100" data-book="bookId">
                    <div class="section2__inputs">
                        <input type="text" class="section2__input section2__input_style" placeholder="Название книги" maxlength="100" data-book="bookName">
                    </div>
                    <div class="section2__inputs">
                        <span class="section2__inline section2__inline_style">Издательство:</span>
                        <input type="text" class="section2__input" value="" maxlength="100" data-book="bookPublishing">
                    </div>
                    <div class="section2__inputs">
                        <span class="section2__inline section2__inline_style">Жанр:</span>
                        <input type="text" class="section2__input" value="" maxlength="100" data-book="bookGenre">
                    </div>
                    <div class="section2__inputs">
                        <span class="section2__inline section2__inline_style">Автор:</span>
                        <input type="text" class="section2__input" value="" maxlength="100" data-book="bookAuthor">
                    </div>
                    <div class="section2__inputs">
                        <span class="section2__inline section2__inline_style">Год издания:</span>
                        <input type="number" class="section2__input" value="" data-book="bookYear" min="868">
                    </div>
                    <div class="section2__inputs">
                        <span class="section2__inline section2__inline_style">Цена:</span>
                        <input type="number" class="section2__input" value="" data-book="bookPrice" min="50">
                    </div>
                    <div class="section2__inputs">
                        <span class="section2__inline section2__inline_style">Рейтинг:</span>
                        <input type="number" class="section2__input" value="" min="1" max="5" data-book="bookRating">
                    </div>
                    <div class="section2__inputs">
                        <span class="section2__inline section2__inline_style">Новинка:</span>
                        <span class="section2__chooseSpan section2__chooseSpan_style">Да</span> <input type="radio" data-radio="new" class="section2__radio" name="editRadios" checked>
                        <span class="section2__chooseSpan">Нет</span> <input type="radio" data-radio="notNew" class="section2__radio"  name="editRadios">
                    </div>
                    <div class="section2__desc">
                        <a class="section2__showDesc" data-fancybox="modalEditDesc" data-src="#modalEditDesc" href="javascript:;">Внести описание</a>
                    </div>
                    <div class="modalDesc" id="modalEditDesc">
                        <h3 class="section2__modalTitle">Описание</h3>
                        <div class="section2__modalText">
                            <textarea cols="30" rows="10" class="section2__modalArea" data-book="bookDesc"></textarea>
                        </div>
                    </div>
                    <div class="section2__buttons">
                        <button class="section2__editButton section2__editSave" data-button="accept">Добавить</button>
                        <div class="section2__editBlock">
                            <button class="section2__editButton section2__editCancel" data-button="cancel">Отменить</button>
                        </div>
                    </div>
                </div>
            </div>`
};

//Рендер контента добавления книги --- Rendering content book's adding
function renderAddInfoBooks() {
    let subMain = document.querySelector('.section2__booksInfo');
    subMain.innerHTML = createAddInfoBooks();

    acceptAddChanges();
};

function openAddBooks() {
    let buttonAdd = document.querySelector('.section2__add');
    
    buttonAdd.addEventListener('click', () => {
        history.pushState({action: "add"}, null, '#add');
        renderAddInfoBooks();
    });
};

//Сохранение новой книги и рендер --- Saving and rendering new book information
function acceptAddChanges() {
    let imageUrl = document.querySelector('[data-book="imgPath"]'),
        bookId = document.querySelector('[data-book="bookId"]'),
        bookName = document.querySelector('[data-book="bookName"]'),
        bookPublishing = document.querySelector('[data-book="bookPublishing"]'),
        bookGenre = document.querySelector('[data-book="bookGenre"]'),
        bookAuthor = document.querySelector('[data-book="bookAuthor"]'),
        bookYear = document.querySelector('[data-book="bookYear"]'),
        bookPrice = document.querySelector('[data-book="bookPrice"]'),
        bookRating = document.querySelector('[data-book="bookRating"]'),
        bookNew,
        radioTrue = document.querySelector('[data-radio="new"]'),
        radioFalse = document.querySelector('[data-radio="notNew"]'),
        bookDesc = document.querySelector('[data-book="bookDesc"]'),
        buttonAccept = document.querySelector('[data-button="accept"]'),
        buttonCancel = document.querySelector('[data-button="cancel"]');
    
    buttonAccept.addEventListener('click', () => {
        if (radioTrue.checked) {
            bookNew = true;
        }
    
        else if (radioFalse.checked) {
            bookNew = false;
        };

        let bookInfo = {
            "id": +bookId.value,
            "name": bookName.value,
            "publishingHouse": bookPublishing.value,
            "genre": bookGenre.value,
            "author": bookAuthor.value,
            "year": bookYear.value,
            "description": bookDesc.value,
            "price": +bookPrice.value,
            "rating": +bookRating.value,
            "imageUrl": imageUrl.src,
            "New": bookNew
        },
            newBook,
            buffer = parseJSON();

        buffer.push(bookInfo);
        localStorage.setItem("WildBook's books", JSON.stringify(buffer));

        newBook = returnBook(bookInfo.id);

        setTimeout(() => {
            alert('Книга успешно добавлена в каталог.');
        }, 450);

        renderInfoBooks(newBook.id, newBook.imageUrl, newBook.name, newBook.publishingHouse, newBook.genre, newBook.author, newBook.year, newBook.description, newBook.price);
        addUrl(newBook.id, 'view');
        openEditBooks();
        renderDefaultBooks();
        bookClick();
    });

    buttonCancel.addEventListener('click', () => {
        let cancelQuestion = confirm('Вы уверены, что хотите отменить добавление книги?');

        if (cancelQuestion === true) {
            renderAddInfoBooks();
        }
        
        else {
            return;
        };
    });
};

//Немедленная рендеровка всего необходимого контента и запуск скриптов обработки данных -- An immediate render the whole content and launching data processing scripts
$(document).ready(function() {
    let buttonProfile = document.querySelector('.menu__link_style');
    
    profiles.forEach(element => {
        if (element["active"]) {
            adminRight = true;
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
    }

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