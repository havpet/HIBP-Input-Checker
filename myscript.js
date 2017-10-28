function isValidEmailAddress(emailAddress) {
    var pattern = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return pattern.test(emailAddress);
};

var timeout;

$("form").each(function() {
    if($(this).find(":password").length > 0) {
        $(this).find(":text, input[type=email]").each(function() {
            $(this).on('input', function() {
                var obj = this;
                clearTimeout(timeout);
                timeout = setTimeout(function() {
                    if(isValidEmailAddress($(obj).val())) {
                        checkEmail($(obj));
                    }
                }, 500);
                
            });
        }); 
    }
})



function checkEmail(input) {
    $.ajax({
        url: 'https://haveibeenpwned.com/api/v2/breachedaccount/' + input.val(),
        type: "GET",
        data: $(this).serialize(),
        success: function(result) {
            console.log("request sent");
            var num_breaches = result.length;
            var times_string = "";
            var breaches_string = "";

            if(num_breaches == 1) {
                times_string = " once: ";
            }

            else {
                times_string = num_breaches + " times: ";
            }

            for(var i=0;i<num_breaches;i++) {
                if(i == 0) {
                    breaches_string += '\n(';
                }

                else {
                    breaches_string += ", ";
                }
                breaches_string += result[i].Title;
            }

            breaches_string += ')\n';
            
            $(input).attr("data-toggle", "popover");
            $(input).attr("title", "Pwned email");
            $(input).attr("data-content", "This email have been pwned " + times_string + breaches_string + "Remember to choose a unique password!");
            $(input).attr("data-placement", "top");
            $(input).popover('enable');  
            $(input).popover('show');   

            setTimeout(
                function() {
                    $(input).popover('hide');
                    $(input).popover('disable');
                }, 5000);
            
        },
        error:function (xhr, ajaxOptions, thrownError){
            
        }
      });
}