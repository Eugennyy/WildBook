<?php
    $to = 'krechunyak00@ukr.net';
    $nameUser = $_GET['name'];
    $email = $_GET['email'];
    $subject = $_GET['subject'];
    $message = $_GET['message'];
    $fullMessage = "Пользователь $nameUser $email задает вопрос: $message";
    $headers = "From: $email";

    if (mail($to, $subject, $fullMessage, $headers)) {
        echo "<p style='text-align: center; font-size: 30px; color: #DE3242; padding-top: 250px;'>Спасибо, ваш вопрос успешно отправлен команде поддержки WildBook.</p>";
    }

    else {
        echo "<p style='text-align: center; font-size: 30px; color: #DE3242; padding-top: 250px;'>Что-то пошло не так. Попробуйте еще раз!</p>";
    };
?>