<?php

########### CONFIG ###############

$redirect = 'http://laura-hesidenz.developerakademie.net/Sakura%20-%20Resp%20Design/index.html';

########### CONFIG END ###########



########### Instruction ###########   
#
#   This script has been created to send an email to the $recipient
#   
#  1) Upload this file to your FTP Server
#  2) Send a POST request to this file, including
#     [name] The name of the sender (Absender)
#     [message] Message that should be sent to you
#     [recipient] The email address where the email should be sent
#
##################################



###############################
#
#        DON'T CHANGE ANYTHING FROM HERE!
#
#        Ab hier nichts mehr ändern!
#
###############################

switch ($_SERVER['REQUEST_METHOD']) {
    case ("OPTIONS"): //Allow preflighting to take place.
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: POST");
        header("Access-Control-Allow-Headers: content-type");
        exit;
    case ("POST"): //Send the email;
        header("Access-Control-Allow-Origin: *");

        $recipient = $_POST['recipient'];
        $subject = "Join - Password Reset Request";
        $headers = "From: noreply@developerakademie.com";

        $message = "Dear Join user\n\nWe have received a request to reset your password for your Join account.\n\nTo proceed with resetting your password, please click on the following link:\n\nhttp://laura-hesidenz.developerakademie.net/templates/resetPassword.html\n\nIf you did not request a password reset, please ignore this email. No changes have been made.\n\nHave a great day :)";

        mail($recipient, $subject, $message, $headers);
        header("Location: " . $redirect); 

        break;
        default: //Reject any non POST or OPTIONS requests.
        header("Allow: POST", true, 405);
        exit;
}
