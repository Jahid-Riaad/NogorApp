$(document).ready(function () {
    loadAnswers();
});

$("#commentForm").validate({
    rules: {
        comment: { required: true, minlength: 15 },
    },
    messages: {
        comment: {
            required: "প্রতিউত্তর খালি রাখা যাবে না!",
            minlength: "প্রতিউত্তর ১৫ অক্ষরের কম হতে পারবে না!"
        }
    },
    submitHandler: function (e) {
        
        $.ajax({
            type: 'POST',
            dataType: 'JSON',
            url: '/Question/RResponse',
            data: { id: getUrlParameter(3), answerId: $('#itoken').val(), answerText: $('#comment').val() },
            success: function (data) {
                if (data.flag == 1) {
                    toastr.success(data.message);
                    location.reload();
                } else {
                    toastr.error(data.message);
                }
                $("#commentForm")[0].reset();
                loadAnswers();
                $('#itoken').val('');
                $('#submit').val('প্রতিউত্তর দিন');
            },
            error: function (data) {
                toastr.error(data.message);
            }
        });
    }
});

function getUrlParameter(pos) {
    var sPageURL = window.location.pathname;
    var sURLVariables = sPageURL.split('/');
    return sURLVariables[pos];
};

function loadAnswers() {
    $.ajax({
        type: 'POST',
        dataType: 'JSON',
        url: '/Question/GetResponseByReportId',
        data: { id: getUrlParameter(3) },
        success: function (data) {
            $('.color').text(data.result.length);
            $('.commentlist').empty();
            if (data.result.length > 0) {
                
                $.each(data.result, function (key, val) {
                    var item = '<li class="comment">';
                    item += '<div class="comment-body clearfix">'
                    item += '<div class="avatar"><img alt="" src="' + window.location.origin + '/' + val.profilePicture + '"></div>';
                    item += '<div class="comment-text">';
                    item += '<div class="author clearfix">';
                    item += '<div class="comment-meta">';
                    item += '<span>' + val.name + '</span>';
                    item += '<div class="date">' + val.responsedOn + '</div>';
                    item += '</div>';
                    console.log(data.show);
                    if (data.show == true) {
                        item += '<a class="comment-reply" onclick="editResponse(\'' + val.id + '\')"><i class="icon-pencil"></i>এডিট</a>';
                        item += '<a class="comment-reply" onclick="deleteResponse(\'' + val.id + '\')"><i class="icon-trash"></i>ডিলিট</a>';
                    }
                    
                    item += '</div>';
                    item += '<div class="text"><p>' + val.body + '</p>';
                    item += '</div>';
                    item += '</div>';
                    item += '</div>';
                    item += '</li>';
                    $('.commentlist').append(item);
                });
            } else {
                var item = '<div class="alert-message info">';
                item += '<i class="icon-bullhorn"></i>';
                item += '<p><span>দুঃখিত!</span><br>';
                item += 'এখনো কোন রেসপন্স নেই!</p>';
                item += '</li>';
                $('.commentlist').append(item);
            }
        },
        error: function (data) {
            toastr.error(data);
        }
    });
}

function deleteResponse(id) {
    swal.fire({
        title: "আপনি কি নিশ্চিত ভাবে ডিলিট করতে চান?",
        text: "এই ডাটা পুনরায় ফিরিয়ে আনা সম্ভব নয়!",
        icon: "warning",
        showCancelButton: !0,
        confirmButtonColor: "danger",
        cancelButtonColor: "primary",
        confirmButtonText: "ডিলিট করুন!"
    }).then(function (t) {
        if (t.value) {

            $.ajax({
                type: 'POST',
                dataType: 'JSON',
                url: '/Question/DeleteResponse',
                data: { id: id },
                success: function (res) {

                    swal.fire({
                        title: (res.status).toUpperCase(),
                        text: res.message,
                        icon: res.status
                    });

                    loadAnswers();
                },
                error: function (res) {
                    swal.fire({
                        title: res.status,
                        text: res.message,
                        icon: res.status
                    })
                }
            })


        } else {
            swal.fire({
                title: "বাতিল করা হয়েছে!",
                text: "আপনার ডাটা সুরক্ষিত আছে!",
                icon: "error"
            })
        }
    });
}

function editResponse(id) {
    $.ajax({
        type: 'POST',
        dataType: 'JSON',
        url: '/Question/GetResponseById',
        data: { id: id },
        success: function (data) {
            $('html, body').animate({
                scrollTop: $("#comment").offset().top - 70
            }, 500);
            $('#itoken').val(data.id);
            $('#comment').val(data.answerText);
            $('#submit').val('প্রতিউত্তর আপডেট করুন');
        },
        error: function (data) {
            toastr.error(data);
        }
    });
}

$('#reset').on('click', function () {
    $('#itoken').val('');
    $('#submit').val('প্রতিউত্তর দিন');
});

function approveReport() {
    $.ajax({
        type: 'POST',
        dataType: 'JSON',
        url: '/Question/ApproveReport',
        data: { id: getUrlParameter(3) },
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