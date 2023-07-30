$(document).ready(function (e) {
    loadRecord();

    $("#ebtnReset").on('click', function (e) {
        $("#myModalEdit").modal("hide");
    });

    $("#myModal").modal({
        backdrop: 'static',
        keyboard: false
    });
});

$.validator.addMethod("strong_password", function (value, element) {
    let password = value;
    if (!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@@#$%&])(.{8,20}$)/.test(password))) {
        return false;
    }
    return true;
}, function (value, element) {
    let password = $(element).val();
    if (!(/^(.{8,20}$)/.test(password))) {
        return 'পাসওয়ার্ড অবশ্যই ৮ থেকে ১০ ক্যারেক্টারের মধ্যে হতে হবে।';
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

$("#userForm").validate({
    rules: {
        Name: { required: true },
        Email: {
            required: true, email: true,
            remote: {
                url: "/Account/IsEmailInUse",
                type: "post"
            }
        },
        Password: { required: true, strong_password: true },
        ConfirmPassword: { required: true, equalTo: "#Password" }
    },
    messages: {
        Name: {
            required: "নাম খালি রাখা যাবে না।"
        },
        Email: {
            required: "ইমেল খালি রাখা যাবে না।",
            email: "দয়া করে সঠিক ইমেল দিন।",
            remote: "ইমেলটি ইতিপূর্বেই রেজিস্টার করা হয়েছে।"
        },
        Password: {
            required: "পাসওয়ার্ড খালি রাখা যাবে না।"
        },
        ConfirmPassword: {
            required: "কনফার্ম পাসওয়ার্ড খালি রাখা যাবে না।",
            equalTo: "কনফার্ম পাসওয়ার্ড এবং পাসওয়ার্ড এক নয়।",
        }
    },
    submitHandler: function (e) {
        var data = {
            id: $("#hiddenText").val(),
            name: $("#Name").val(),
            email: $("#Email").val(),
            password: $("#Password").val()
        };

        $.ajax({
            type: 'POST',
            dataType: 'JSON',
            url: '/Account/CreateUser',
            data: data,
            success: function (data) {
                $("#myModal").modal("hide");
                toastr.success(data.message);
                $("#tblCategory").dataTable().fnDestroy();
                loadRecord();
                $("#userForm")[0].reset();
            },
            error: function (data) {
                toastr.error(data.message);
            }
        });
    }
});

$("#euserForm").validate({
    rules: {
        Name: { required: true },
        Password: { required: true, strong_password: true },
        ConfirmPassword: { required: true, equalTo: "#ePassword" }
    },
    messages: {
        Name: {
            required: "নাম খালি রাখা যাবে না।"
        },
        Password: {
            required: "পাসওয়ার্ড খালি রাখা যাবে না।"
        },
        ConfirmPassword: {
            required: "কনফার্ম পাসওয়ার্ড খালি রাখা যাবে না।",
            equalTo: "কনফার্ম পাসওয়ার্ড এবং পাসওয়ার্ড এক নয়।",
        }
    },
    submitHandler: function (e) {

        var data = {
            id: $("#ehiddenText").val(),
            name: $("#eName").val(),
            password: $("#ePassword").val()
        };

        $.ajax({
            type: 'POST',
            dataType: 'JSON',
            url: '/Account/CreateUser',
            data: data,
            success: function (data) {
                $("#myModalEdit").modal("hide");
                toastr.success(data.message);
                $("#tblCategory").dataTable().fnDestroy();
                loadRecord();
                $("#euserForm")[0].reset();
            },
            error: function (data) {
                toastr.error(data.message);
            }
        });
    }
});


function loadRecord() {
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
            "url": "/Account/GetUser",
            "type": "GET",
            "dataType": "json"
        },
        "columns": [
            { "data": "name", "name": "name", "autoWidth": false },
            {
                "data": "email", "name": "email", "autoWidth": false
            },
            {
                "data": "id", "name": "id", "autoWidth": false, "render": function () {
                    return '<a href="#" class=""><i class="icon-edit"></i> </a>' +
                        '<a href="#" class="text-danger btn-sm"><i class="icon-trash"></i> </a>';
                }
            }
        ]
    });
}

$(document.body).on('click', 'tr', function (e) {
    e.preventDefault();

    if (e.target.className == "icon-edit") {
        $("#myModalEdit").modal("show");
        //$('html,body').animate({ scrollTop: 0 }, 1200)

        var data = $("#tblCategory").DataTable().row(this).data();

        $("#ehiddenText").val(data.id);
        $("#eName").val(data.name);
        $("#eEmail").val(data.email);

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
                    url: '/Account/DeleteUser',
                    data: { id: data.id },
                    success: function (res) {

                        swal.fire({
                            title: (res.status).toUpperCase(),
                            text: res.message,
                            icon: res.status
                        });

                        $("#tblCategory").dataTable().fnDestroy();
                        loadRecord();
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