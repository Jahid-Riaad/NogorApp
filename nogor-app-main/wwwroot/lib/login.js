//validate report form
$("#loginForm").validate({
    rules: {
        email: { required: true, email: true },
        password: { required: true }
    },
    messages: {
        email: {
            required: "ইমেল খালি রাখা যাবে না!",
            email: "দয়া করে সঠিক ইমেল দিন!"
        },
        password: {
            required: "পাসওয়ার্ড খালি রাখা যাবে না!"
        }
    },
    submitHandler: function (e) {

        var data = {
            email: $("#email").val(),
            password: $("#password").val(),
            rememberMe: $("#rememberMe").prop("checked") == true ? 1 : 0
        };

        $.ajax({
            type: 'POST',
            dataType: 'JSON',
            url: '/Account/Login',
            data: data,
            success: function (data) {
                if (data.flag == 1) {
                    toastr.success(data.message);
                    if (getUrlParameter('ReturnUrl') != false) {
                        window.location.href = getUrlParameter('ReturnUrl');
                    } else {
                        window.location.href = '/';
                    }
                } else {
                    toastr.error(data.message);
                }
            },
            error: function (data) {
                toastr.error(data.message);
            }
        });
    }
});

//validate report form
$("#headerLogin").validate({
    rules: {
        topemail: { required: true, email: true },
        toppassword: { required: true }
    },
    messages: {
        topemail: {
            required: "ইমেল খালি রাখা যাবে না!",
            email: "দয়া করে সঠিক ইমেল দিন!"
        },
        toppassword: {
            required: "পাসওয়ার্ড খালি রাখা যাবে না!"
        }
    },
    submitHandler: function (e) {

        var data = {
            email: $("#topemail").val(),
            password: $("#toppassword").val(),
            rememberMe: $("#toprememberMe").prop("checked") == true ? 1 : 0
        };

        $.ajax({
            type: 'POST',
            dataType: 'JSON',
            url: '/Account/Login',
            data: data,
            success: function (data) {
                if (data.flag == 1) {
                    toastr.success(data.message);
                    location.reload();
                } else {
                    toastr.error(data.message);
                }
            },
            error: function (data) {
                toastr.error(data.message);
            }
        });
    }
});

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'), sParameterName, i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return typeof sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
};
