<?php
    $to = 'krechunyak00@ukr.net';
    $nameUser = $_GET['name'];
    $email = $_GET['email'];
    $subject = 'Встреча с автором';
    $author = $_GET['author'];
    $message = $_GET['message'];
    $fullMessage = "Описание пользователя $nameUser $email, который хочет встретиться с $author: $message";
    $headers = "From: $email";

    if (mail($to, $subject, $fullMessage, $headers)) {
        echo "<p style='text-align: center; font-size: 30px; color: #DE3242; padding-top: 250px;'>Спасибо, ваша заявка успешно принята. Регулярно проверяйте свою почту на наличие ответа от нас.</p>";
    }

    else {
        echo "<p style='text-align: center; font-size: 30px; color: #DE3242; padding-top: 250px;'>Что-то пошло не так. Попробуйте еще раз!</p>";
    };
?>