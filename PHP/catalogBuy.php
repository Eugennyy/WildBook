<?php
    $to = $_GET['email'];
    $subject = 'Ваш заказ';
    $message = 'Здравствуйте! Ваш заказ успешно пришел к вам на почту. Вы можете забрать его. Спасибо за покупку!';
    $headers = 'From: WildBook@gmail.com';

    if (mail($to, $subject, $message, $headers)) {
        echo "<p style='text-align: center; font-size: 30px; color: #DE3242; padding-top: 250px;'>Ваш заказ обрабатывается. Перейдите в свою почту, что бы узнать подробности.</p>";
    }

    else {
        echo "<p style='text-align: center; font-size: 30px; color: #DE3242; padding-top: 250px;'>Что-то пошло не так. Попробуйте еще раз!</p>";
    };
?>