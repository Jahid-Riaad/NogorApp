$("#contactForm").validate({
    rules: {
        name: { required: true },
        email: { required: true, email: true },
        message: { required: true }
    },
    messages: {
        name: {
            required: "নাম খালি রাখা যাবে না!"
        },
        email: {
            required: "ইমেল খালি রাখা যাবে না!",
            email: "দয়া করে সঠিক ইমেল দিন!"
        },
        message: {
            required: "বার্তা খালি রাখা যাবে না!"
        }
    },
    submitHandler: function (e) {

        var data = {
            name: $("#name").val(),
            email: $("#email").val(),
            phone: $("#phone").val(),
            message: $("#message").val(),
        };

        $.ajax({
            type: 'POST',
            dataType: 'JSON',
            url: '/Home/SendMessage',
            data: data,
            success: function (res) {
                swal.fire({
                    title: (res.status).toUpperCase(),
                    text: res.message,
                    icon: res.status
                });

                $("#contactForm")[0].reset();
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

function loadMessage() {
    $("#tblCategory").DataTable({
        "processing": true,
        "iDisplayLength": 10,
        "language": {
            processing: '<a href="javascript:void(0);" class="text-success"><i class="bx bx-loader bx-spin font-size-22 align-middle mr-2"></i> Loading...</a>',
            emptyTable: "No Data",
            zeroRecords: "No Data",
            infoFiltered: " - Total number of row: _MAX_",
            paginate: { first: "First", last: "Last", next: "Next", previous: "Previous" }
        },
        "filter": true,
        "serverSide": false,
        "orderable": false,
        "ajax": {
            "url": "/Home/GetMessages",
            "type": "POST",
            "dataType": "json"
        },
        "columns": [
            { "data": "name", "name": "name", "autoWidth": false },
            { "data": "email", "name": "email", "autoWidth": false },
            { "data": "phone", "name": "phone", "autoWidth": false },
            {
                "data": "sendOn", "name": "sendOn", "autoWidth": false, 'render': function (data) {
                    var date = new Date(data);
                    var month = ("0" + (date.getMonth() + 1)).slice(-2);
                    return ("0" + date.getDate()).slice(-2) + '-' + month + '-' + date.getFullYear();
                }
            },
            {
                "data": "id", "name": "id", "autoWidth": false, "render": function () {
                    return '<a href="#" class=""><i class="icon-eye-open"></i> </a>' +
                        '<a href="#" class="text-danger btn-sm"><i class="icon-trash"></i> </a>';
                }
            }
        ]
    });
}

$(document.body).on('click', 'tr', function (e) {
    e.preventDefault();

    if (e.target.className == "icon-eye-open") {
        var data = $("#tblCategory").DataTable().row(this).data();

        $('#messageModal').modal('show');
        $('.modal-title').text('From: ' + data.name);
        $('.modal-body').text(data.message);

    } else if (e.target.className == "icon-trash") {
        var data = $("#tblCategory").DataTable().row(this).data();

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
                    url: '/Home/DeleteMessage',
                    data: { id: data.id },
                    success: function (res) {

                        swal.fire({
                            title: (res.status).toUpperCase(),
                            text: res.message,
                            icon: res.status
                        });

                        $("#tblCategory").dataTable().fnDestroy();
                        loadMessage();
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


});

$('#close, #close-ico').on('click', function () {
    $('#messageModal').modal('hide');
});

function loadAboutInfo() {
    $.ajax({
        type: 'POST',
        dataType: 'JSON',
        url: '/Home/GetAboutInfo',
        success: function (res) {
            $('#address').val(res.address);
            $('#email').val(res.email);
            $('#phone').val(res.phone);
            $('#mapLink').val(res.mapLink);
            $('#logoImage').attr('src', window.location.origin + '/' +res.logo);
            $('#aboutShort').val(res.aboutShort);
            $('#about').val(res.about);
           
        },
        error: function (res) {
            swal.fire({
                title: res.status,
                text: res.message,
                icon: res.status
            })
        }
    })
}

$("#aboutForm").validate({
    submitHandler: function (e) {
        var data = new FormData();
        var file = $('#logo')[0].files;

        data.append('address', $("#address").val());
        data.append('email', $("#email").val());
        data.append('phone', $("#phone").val());
        data.append('mapLink', $("#mapLink").val());
        data.append('logo', file[0]);
        data.append('aboutShort', $("#aboutShort").val());
        data.append('about', $("#about").val());

        $.ajax({
            type: 'POST',
            contentType: false,
            processData: false,
            url: '/Home/UpdateAboutInfo',
            data: data,
            success: function (data) {
                if (data.flag == 1) {
                    toastr.success(data.message);
                    $('#aboutForm')[0].reset();
                    $('.small').text(0 + ' file(s) selected');
                    loadAboutInfo();
                } else {
                    toastr.error(data.message);
                    $('#aboutForm')[0].reset();
                    loadAboutInfo();
                }
            },
            error: function (data) {
                toastr.error(data.message);
            }
        });
    }
});

$('#logo').change(function () {
    var files = $(this)[0].files;
    $('.small').empty();
    $('.small').text(files.length + ' file(s) selected');
});

function fatchAboutInfo() {
    $.ajax({
        type: 'POST',
        dataType: 'JSON',
        url: '/Home/GetAboutInfo',
        success: function (res) {
            $('.ai-body').text(res.about);
            $('.ai-address').text(res.address);
            $('.ai-phone').text(res.phone);
            $('.ai-email').text(res.email);
            $('.ai-map').attr('src', res.mapLink);

        },
        error: function (res) {
            swal.fire({
                title: res.status,
                text: res.message,
                icon: res.status
            })
        }
    })
}