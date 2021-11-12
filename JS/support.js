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

let $buttonUp = $('.buttonUp');
$buttonUp.hide();

$buttonUp.on('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

//Рендер кнопки наверх --- Button's up render
( function renderButtonUp() {
    window.addEventListener('scroll', renderButtonUp);

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
        scrollTop: $('#support').offset().top
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
    buttonMessage = document.querySelector('#uniqueButton'),
    isActive,
    cart = document.querySelector('#cart'),
    cartItems = parseCartData(),
    cartButton = document.querySelector('#cartButton'),
    cartActive,
    profilePhoto = document.querySelector('.modalProfile__photo'),
    profileEmail = document.querySelector('#profileEmail'),
    profileLogin = document.querySelector('#profileLogin'),
    profilePassword = document.querySelector('#profilePassword'),
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
            $.fancybox.close();
            isActive = true;
            cartActive = true;
            element.active = true;
            buttonProfile.remove();

            localStorage.setItem("WildBook's profiles", JSON.stringify(profiles));

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

            checkUniqueButton();
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
        checkUniqueButton();
        checkCart();
    }

    else {
        return;
    };
});

//Проверка кнопки "Встреча с автором" на доступность --- Checking button "meeting with author" for availability
function checkUniqueButton() {
    if (isActive === true) {
        buttonMessage.classList.remove('section2__button_style');
        buttonMessage.removeAttribute('disabled');
    }

    else {
        buttonMessage.classList.add('section2__button_style');
        buttonMessage.setAttribute('disabled', 'disabled');
    };
};

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

function checkCart() {
    if (cartActive === true) {
        cart.classList.remove('menu__icon_style');
    }

    else {
        cart.classList.add('menu__icon_style');
    };
};

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

            checkUniqueButton();
            checkCart(); 
        }

        else {
            return;
        };
    });
});

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

//Табы --- Tabs
$(function() {
    $('.section2__tabs').on('click', 'li:not(.section2__tab_active)', function() {
        $(this).addClass('section2__tab_active').siblings().removeClass('section2__tab_active')
        .closest('.container').find('.section2__main').removeClass('section2__main_active').eq($(this).index()).addClass('section2__main_active');
    });
});