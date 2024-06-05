$(document).ready(function() {
    $("#inquiry-form2").submit(function(event) {
        event.preventDefault();
        
        // Clear previous response messages
        $("#response-message2").html("");
        
		// Disable past dates in the "Date" input field
   // var today = new Date().toISOString().split('T')[0];
    //$("#date").attr("min", today);
    
        // Phone number validation
        var phoneNumber = $("#phone2").val();
        if (!/^[0-9]+$/.test(phoneNumber)) {
            $("#response-message2").html("Phone number should contain only digits.");
            return;
        }
        // Gather form data
        // var formData = $(this).serialize();

        const csize = $("#csize2").val();
        const compname = $("#compname2").val();
        const email = $("#email2").val();
        const message = $("#message2").val();
        const name = $("#name2").val();
        const date = new Date($("#date2").val()).toDateString();
        const time = $("#time2").val();


        fetch("https://rus2bill.com/api/mail/mail1",{
               // fetch("http://localhost:3001/mail/mail",{
               method:'POST',
               body:JSON.stringify({
                  subject:"Demo Form Inquiry - Rus2Bill Site.",
                  htmlMessage:`<div class='container'>
                  <p>Name : ${name} <br>
                  Company Name : ${compname} <br>
                  Company Size : ${csize} <br>
                  Email : ${email}<br> 
                  Phone : ${phoneNumber}<br>
                  Meeting Date: ${date}<br>
                  Meeting Time: ${time}<br>
                  Message : ${message}<br><br>
                  This message is coming from the website Rus2Bill.</p>
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
        //     url: "ajax-form/submit2.php",
        //     data: formData,
        //     success: function(response) {
        //         $("#inquiry-form2").trigger("reset"); 
        //         $("#response-message2").html(response);
        //         if (response.includes("Thank you")) {
        //             // Reset the form after successful submission
        //             $("#inquiry-form2").reset();
        //             //window.location.reload();
        //         }
        //     }
        // });
    });
});
