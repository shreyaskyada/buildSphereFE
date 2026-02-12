$(document).ready(function() {
    $("#inquiry-form").submit(function(event) {
        event.preventDefault();
        
        // Clear previous response messages
        $("#response-message").html("");
        
		// Disable past dates in the "Date" input field
   // var today = new Date().toISOString().split('T')[0];
    //$("#date").attr("min", today);
    
        // Phone number validation
        var phoneNumber = $("#phone").val();
        if (!/^[0-9]+$/.test(phoneNumber)) {
            $("#response-message").html("Phone number should contain only digits.");
            return;
        }
        // Gather form data
        // var formData = $(this).serialize();


        const csize = $("#csize").val();
        const compname = $("#compname").val();
        const email = $("#email").val();
        const message = $("#message").val();
        const name = $("#name").val();

        
        fetch("https://buildsphere.com/api/mail/mail1",{
               // fetch("http://localhost:3001/mail/mail",{
               method:'POST',
               body:JSON.stringify({
                  subject:"Contact Form Inquiry - BuildSphere Site.",
                  htmlMessage:`<div class='container'>
                  <p>Name : ${name} <br>
                  Company Name : ${compname} <br>
                  Company Size : ${csize} <br>
                  Email : ${email}<br> 
                  Phone : ${phoneNumber}<br>
                  Message : ${message}<br><br>
                  This message is coming from the website BuildSphere.</p>
                  </div>`
               }),
               headers: new Headers({'content-type': 'application/json'}),
             }).then(()=>{
               console.log("sent");
               alert("We have received your message. We will get back to you within 24 hours.")
             }).catch(e=>{
               console.log(e)
             })
        
        // Send AJAX request
        // $.ajax({
        //     type: "POST",
        //     url: "ajax-form/submit.php",
        //     data: formData,
        //     success: function(response) {
        //         $("#inquiry-form").trigger("reset"); 
        //         $("#response-message").html(response);
        //         if (response.includes("Thank you")) {
        //             // Reset the form after successful submission
        //             $("#inquiry-form").reset();
        //             //window.location.reload();
        //         }
        //     }
        // });
    });
});
