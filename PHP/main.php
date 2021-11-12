<?php
    $to = $_GET['sendEmail'];
    $subject = 'Новости о предстоящих новинках книг в  WildBook!';
    $message = 'Улееет! На следующей неделе в WildBook появятся новинки книг этого года! Не пропустите, следите за новостями!';
    $headers = 'From: WildBook@gmail.com';

    if (mail($to, $subject, $message, $headers)) {
        echo "<p style='text-align: center; font-size: 30px; color: #DE3242; padding-top: 250px;'>Спасибо, что подписались на рассылку новых книг WildBook!</p>";
    }

    else {
        echo "<p style='text-align: center; font-size: 30px; color: #DE3242; padding-top: 250px;'>Что-то пошло не так. Попробуйте еще раз!</p>";
    };

?>