<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST["name"];
    $compname = $_POST["compname"];
    $email = $_POST["email"];
    $message = $_POST["message"];
     $date = $_POST["date"];
    $time = $_POST["time"];
    $phone = $_POST["phone"];
    $csize = $_POST["csize"];
    
     

    // Basic validation
    if (empty($name) || empty($email) || empty($message)) {
        echo "All fields are required.";
    } 
	 if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "Please enter a valid email address.";
    } 
	// Additional validation for date and time
   // if (empty($date) || empty($time)) {
     //   echo "Please select a valid date and time.";
    //} elseif (!preg_match("/^\d{4}-\d{2}-\d{2}$/", $date) || !preg_match("/^\d{2}:\d{2}$/", $time)) {
    //    echo "Invalid date or time format.";
   // }
	else {
        // Send email to specified address
        $to = "partnership@copilotdm.com";
        $from = "BuildSphere<no-reply@buildsphere.com>";
	$headers  = 'MIME-Version: 1.0' . "\r\n";
    $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
	
	$headers .= 'From: '.$from."\r\n".
	"CC: aasim@copilotdm.com,amalik@copilotdm.com". "\r\n" .
     'Reply-To: '.$from."\r\n" .
     'X-Mailer: PHP/' . phpversion();
     
        $subject = "Contact Form Inquiry - BuildSphere Site.";
       // $messageBody = "Name: $name\nIndustry: $industry\nEmail: $email\nPhone: $phone\nDate: $date\nTime: $time\nMessage: $message";
        $htmlContent = "<div class='container'>
        <p>Name : $name <br>
        Company Name : $compname <br>
        Company Size : $csize <br>
        Email : $email<br> 
		Phone : $phone<br>
		Meeting Date: $date<br>
		Meeting Time: $time<br>
		Message : $message<br><br>
        This message is coming from the website BuildSphere.</p>
        </div>";
       // $headers = "From: $email";
        
        if (mail($to, $subject, $htmlContent, $headers)) {
            echo '<p style="color:green;font-size:17px !important;font-weight:400;line-height: 24px;">We have received your message.</br> We will get back to you within 24 hours.</p>';
        } else {
            echo "Failed to send email. Please try again later.";
        }
    }
} else {
    echo "Invalid request.";
}
?>
