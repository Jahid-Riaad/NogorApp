var page = 1;
var size = 3;
var length = 0;

$(document).ready(function () {
    if (getUrlParameter(2).toLocaleLowerCase() == 'profile') {
        getUserInfo();
    }else if (getUrlParameter(2).toLocaleLowerCase() == 'editprofile') {
        getEditInfo();
    }

    $(document).ready(function () {
        if (page == 1) loadAllReport(page, size);
    });

    loadMore();
});

function getUserInfo() {
    $.ajax({
        type: 'GET',
        dataType: 'JSON',
        url: '/Account/GetUserInfo/' + getUrlParameter(3),
        success: function (data) {
            $('.userName').text(data.user.name);
            $('.userDesignation').text(data.user.designation);
            $('.userDepartment').text(data.department);
            $('.userAbout').text(data.user.about);
            $('.flink').attr('href', data.user.fLink);
            $('.tlink').attr('href', data.user.tLink);
            $('.llink').attr('href', data.user.lLink);
            $('#profileImage').attr('src', window.location.origin + '/' + data.user.profilePicture);
            $('.totalreport').text(data.totalreport);
            $('.responded').text(data.responded);
            if (data.showEdit == false) {
                $('.editprof').remove();
            } else {
                $('.editprof').attr('href', '/Account/EditProfile/' + data.user.id);
            }
        }
    });
}

function getEditInfo() {
    $.ajax({
        type: 'GET',
        dataType: 'JSON',
        url: '/Account/EditProfileinfo/' + getUrlParameter(3),
        success: function (data) {
            if (data.redirect == true) {
                window.location.href = '/Home/AccessDenied';
            }

            $('#name').val(data.user.name);
            $('#email').val(data.user.email);
            $('#designation').val(data.user.designation);
            $('#profileImage').attr('src', window.location.origin+'/' + data.user.profilePicture);
            $('#about').val(data.user.about);
            $('#flink').val(data.user.fLink);
            $('#tlink').val(data.user.tLink);
            $('#llink').val(data.user.lLink);
        }
    });
}

function getUrlParameter(pos) {
    var sPageURL = window.location.pathname;
    var sURLVariables = sPageURL.split('/');
    return sURLVariables[pos];
};

$('#profilePicture').change(function () {
    var files = $(this)[0].files;
    $('.small').empty();
    $('.small').text(files.length + ' file(s) selected');
});


$.validator.addMethod("strong_password", function (value, element) {
    let password = value;

    if (password.length <= 0) {
        return true;
    }

    if (!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@@#$%&])(.{8,20}$)/.test(password))) {
        return false;
    }
    return true;

}, function (value, element) {
    let password = $(element).val();
    if (!(/^(.{8,20}$)/.test(password))) {
        return 'পাসওয়ার্ড অবশ্যই ৮ থেকে ২০ ক্যারেক্টারের মধ্যে হতে হবে।';
    }
    else if (!(/^(?=.*[A-Z])/.test(password))) {
        return 'পাসওয়ার্ডে অন্তত একটি ক্যাপিটাল ক্যারেক্টার থাকতে হবে।';
    }
    else if (!(/^(?=.*[a-z])/.test(password))) {
        return 'পাসওয়ার্ডে অন্তত একটি স্মল ক্যারেক্টার থাকতে হবে।';
    }
    else if (!(/^(?=.*[0-9])/.test(password))) {
        return 'পাসওয়ার্ডে অন্তত একটি নাম্বার থাকতে হবে।';
    }
    else if (!(/^(?=.*[@@#$%&])/.test(password))) {
        return "পাসওয়ার্ডে অন্তত একটি স্পেশাল ক্যারেক্টার থাকতে হবে। যেমনঃ @@#$%&.";
    }
    return false;
});

$.validator.addMethod('filesize', function (_value, element, param) {
    for (var i = 0; i < element.files.length; i++) {
        if (element.files[i].size > param * 1000000) {
            return false;
        }
    }
    return true;
}, 'সর্বোচ্চ ২ এম্বি ফাইল নির্বাচন করতে পারবেন!');

$.validator.addMethod("validate_file_type", function (val, elem) {
    var files = $('#' + elem.id)[0].files;
    for (var i = 0; i < files.length; i++) {
        var fname = files[i].name.toLowerCase();
        var re = /(\.png|\.jpg|\.jpeg)$/i;
        if (!re.exec(fname)) {
            return false;
        }
    }
    return true;
}, "শুধু মাত্র png, jpg, jpeg নির্বাচন করতে পারবেন!");

$("#profileEditForm").validate({
    rules: {
        name: { required: true, minlength: 5},
        designation: { required: true },
        current_password: {
            required: true,
            remote: {
                url: "/Account/IsPasswordCorrect/" + getUrlParameter(3),
                type: "post"
            }
        },
        password: { required: false, strong_password: true },
        repassword: { equalTo: "#password" },
        profilePicture: { required: false, filesize: 2, validate_file_type: true },
        about: { required: false },
    },
    messages: {
        name: {
            required: "নাম খালি রাখা যাবে না!",
            minlength: "নাম ৫ অক্ষরের কম হতে পারবে না!"
        },
        current_password: {
            required: "বর্তমান পাসওয়ার্ড খালি রাখা যাবে না!"
        },
        repassword: {
            equalTo: "পাসওয়ার্ড ও কনফার্ম পাসওয়ার্ড এক নয়!"
        }
    },
    submitHandler: function (e) {
        var data = new FormData();
        var files = $('#profilePicture')[0].files;

        data.append('id', getUrlParameter(3));
        data.append('name', $("#name").val());
        data.append('designation', $("#designation").val());
        data.append('password', $("#password").val());
        data.append('department', $("#department").val());
        data.append('about', $("#about").val());
        data.append('profilePicture', files[0]);
        data.append('fLink', $("#flink").val());
        data.append('tLink', $("#tlink").val());
        data.append('lLink', $("#llink").val());

        $.ajax({
            type: 'POST',
            contentType: false,
            processData: false,
            url: '/Account/UpdateProfile',
            data: data,
            success: function (data) {
                if (data.flag == 1) {
                    toastr.success(data.message);
                    $('#profileEditForm')[0].reset();
                    $('.small').text(0 + ' file(s) selected');
                    getEditInfo();
                } else {
                    toastr.error(data.message);
                    $('#profileEditForm')[0].reset();
                    getEditInfo();
                }
            },
            error: function (data) {
                toastr.error(data.message);
            }
        });
    }
});


function status(s) {
    return (s == 2) ? '<div class="question-answered question-answered-done"><i class="icon-ok"></i>solved</div>' : '<div class="question-answered"><i class="icon-ok"></i>In progress</div>';

}

//load all report
function loadAllReport(current_page, page_size) {
    $.ajax({
        type: 'POST',
        dataType: 'JSON',
        url: '/Question/UserReport',
        data: { id: getUrlParameter(3), page: current_page, size: page_size },
        success: function (data) {
            length += data.dlen - page_size;

            if (length <= 0) {
                $('.load-questions').text('আপাতত আর কোন রিপোর্ট নেই!');
                $('.load-questions').off('click');
            }

            if (data.dlen != 0) {
                if (current_page == 1) {
                    $('.randr').empty();
                }

                $.each(data.data, function (i, v) {
                    var item = '<article class="question user-question">' +
                        '<h3>' +
                        '<a href="/Question/ViewReport/' + v.id + '">' + v.title + '</a> </h3>' +
                        '<div class="question-type-main"><i class="icon-question-sign"></i> অভিযোগ</div>' +
                        '<div class="question-content">'+
                            '<div class="question-bottom">' +
                                status(v.status) +
       
                                '<span class="question-category"><a href="/Question/Department/' + v.departmentId + '"><i class="icon-folder-close"></i>' + v.department + '</a></span>' +
                                '<span class="question-date"><i class="icon-time"></i>' + time_ago(v.askedOn) + '</span>' +
                            '</div>' +
                        '</div>' +
                        '</article>';

                    $('.randr').append(item);
                });
            } else {
                $('.info p').empty();
                $('.info p').append('<span>দুক্ষিত</span><br/> আপাতত এই সংশ্লিষ্ট কোন ডাটা নেই!');
            }
        }
    });
}

//Event handler for load more button click event 
function loadMore() {
    $('.load-questions').on('click', function () {
        page++;
        $.ajax({
            type: 'POST',
            dataType: 'JSON',
            url: '/Question/UserReport',
            data: { id: getUrlParameter(3), page, size },
            success: function (data) {
                if (data.length != 0) {
                    $.each(data.data, function (i, v) {
                        var item = '<article class="question user-question">' +
                            '<h3>' +
                            '<a href="/Question/ViewReport/' + v.id + '">' + v.title + '</a> </h3>' +
                            '<div class="question-type-main"><i class="icon-question-sign"></i> অভিযোগ</div>' +
                            '<div class="question-content">' +
                            '<div class="question-bottom">' +
                            status(v.status) +

                            '<span class="question-category"><a href="/Question/Department/' + v.departmentId + '"><i class="icon-folder-close"></i>' + v.department + '</a></span>' +
                            '<span class="question-date"><i class="icon-time"></i>' + time_ago(v.askedOn) + '</span>' +
                            '</div>' +
                            '</div>' +
                            '</article>';

                        $('.randr').append(item);
                        length -= 3;
                        if (length <= 0) {
                            $('.load-questions').text('আপাতত আর কোন রিপোর্ট নেই!');
                            $('.load-questions').off('click');
                        }
                    });
                } else {
                    $('.load-questions').text('আপাতত আর কোন রিপোর্ট নেই!');
                    $('.load-questions').off('click');
                }
            }
        });
    });
}

//format time
function time_ago(time) {

    switch (typeof time) {
        case 'number':
            break;
        case 'string':
            time = +new Date(time);
            break;
        case 'object':
            if (time.constructor === Date) time = time.getTime();
            break;
        default:
            time = +new Date();
    }
    var time_formats = [
        [60, 'seconds', 1], // 60
        [120, '1 minute ago', '1 minute from now'], // 60*2
        [3600, 'minutes', 60], // 60*60, 60
        [7200, '1 hour ago', '1 hour from now'], // 60*60*2
        [86400, 'hours', 3600], // 60*60*24, 60*60
        [172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
        [604800, 'days', 86400], // 60*60*24*7, 60*60*24
        [1209600, 'Last week', 'Next week'], // 60*60*24*7*4*2
        [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
        [4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
        [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
        [58060800, 'Last year', 'Next year'], // 60*60*24*7*4*12*2
        [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
        [5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
        [58060800000, 'centuries', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
    ];
    var seconds = (+new Date() - time) / 1000,
        token = 'ago',
        list_choice = 1;

    if (seconds == 0) {
        return 'Just now'
    }
    if (seconds < 0) {
        seconds = Math.abs(seconds);
        token = 'from now';
        list_choice = 2;
    }
    var i = 0,
        format;
    while (format = time_formats[i++])
        if (seconds < format[0]) {
            if (typeof format[2] == 'string')
                return format[list_choice];
            else
                return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
        }
    return time;
}