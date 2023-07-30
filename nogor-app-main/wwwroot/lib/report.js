
$.validator.addMethod('filesize', function (_value, element, param) {
    for (var i = 0; i < element.files.length; i++) {
        if (element.files[i].size > param * 1000000) {
            return false;
        }
    }
    return true;
}, 'সর্বোচ্চ ১০ এম্বি ফাইল নির্বাচন করতে পারবেন!');

$.validator.addMethod("validate_file_type", function (val, elem) {
    var files = $('#' + elem.id)[0].files;
    for (var i = 0; i < files.length; i++) {
        var fname = files[i].name.toLowerCase();
        var re = /(\.pdf|\.png|\.jpg|\.jpeg|\.mp4|\.mp3)$/i;
        if (!re.exec(fname)) {
            return false;
        }
    }
    return true;
}, "শুধু মাত্র png, jpg, jpeg, pdf, mp3, এবং mp4 নির্বাচন করতে পারবেন!");

$("#reportForm").on('submit', function (e) {
    e.preventDefault();
});

$('input#attachment').change(function () {
    var files = $(this)[0].files;
    $('.small').empty();
    $('.small').text(files.length + ' file(s) selected');
});

$("#reportForm").validate({
    rules: {
        title: { required: true },
        name: { required: true, minlength: 5 },
        phone: { required: true, number: true, minlength: 11, maxlength: 11 },
        bemail: { required: false, email: true },
        department: { required: true },
        attachment: {
            required: false,
            filesize: 10,
            validate_file_type: true
        }
    },
    messages: {
        title: {
            required: "শিরোনাম খালি রাখা যাবে না!",
            minlength: "শিরোনাম ১৫ অক্ষরের কম হতে পারবে না!"
        },
        name: {
            required: "নাম খালি রাখা যাবে না!",
            minlength: "নাম ৫ অক্ষরের কম হতে পারবে না!"
        },
        phone: {
            required: "ফোন নাম্বার খালি রাখা যাবে না!",
            number: "দয়া করে সঠিক ফোন নাম্বার দিন!",
            minlength: "দয়া করে সঠিক ফোন নাম্বার দিন!",
            maxlength: "দয়া করে সঠিক ফোন নাম্বার দিন!"
        },
        bemail: {
            email: "দয়া করে সঠিক ইমেল এড্রেস দিন!"
        },
        department: {
            required: "বিভাগ খালি রাখা যাবে না!"
        }
    },
    submitHandler: function (e) {

        var data = new FormData();
        var files = $('#attachment')[0].files;
        data.append('title', $("#title").val());
        data.append('name', $("#name").val());
        data.append('phone', $("#phone").val());
        data.append('email', $("#bemail").val());
        data.append('department', $("#department").val());
        data.append('body', $("#body").val());
        
        for (var i = 0; i < files.length; i++) {
            data.append('files', files[i]);
        }

        $.ajax({
            type: 'POST',
            contentType: false,
            processData: false,
            url: '/Question/AddReport',
            data: data,
            success: function (res) {
                swal.fire({
                    title: (res.status).toUpperCase(),
                    text: res.message,
                    icon: res.status
                });
                $("#reportForm")[0].reset();
                $('.small').empty();
                $('.small').text('ফাইল নির্বাচন করুন');
            },
            error: function (res) {
                swal.fire({
                    title: (res.status).toUpperCase(),
                    text: res.message,
                    icon: res.status
                });
            }
        });
    }
});

$(function () {
    $.ajax({
        type: 'POST',
        dataType: 'JSON',
        url: '/Question/Departments',
        success: function (data) {
            $('#department').empty();
            $('#department').append('<option value="">বিভাগ নির্বাচন করুন</option>');;

            $.each(data, function (i, v) {
                if ('Administrator' == v.name) {
                    return true;
                } else {
                    $('#department').append('<option value="' + v.id + '">' + v.name + '</option>');
                }
            });
        }
    });
});

