$(document).ready(function () {
    loadRecord();

    $("#btnReset").on('click', function (e) {
        titleFormater();
    });

    $("#icoReset").on('click', function (e) {
        titleFormater();
    });

    $("#myModal").modal({
        backdrop: 'static',
        keyboard: false
    });
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
            "url": "/Account/AllRole",
            "type": "GET",
            "dataType": "json"
        },
        "columns": [
            { "data": "name", "name": "name", "autoWidth": false },
            {
                "data": "id", "name": "id", "autoWidth": true, "render": function () {
                    return '<a href="#" class="btn-sm"><i class="icon-plus-sign"></i></a>' +
                        '<a href="#" class="btn-sm"><i class="icon-edit"></i></a>' +
                        '<a href="#" class="text-danger btn-sm"><i class="icon-trash"></i></a>';
                }
            }
        ]

    });
}

$("#roleForm").validate({
    rules: {
        Name: { required: true }
    },
    messages: {
        Name: {
            required: 'বিভাগের নাম খালি রাখা যাবে না!'
        }
    },
    submitHandler: function (e) {
        var data = {
            id: $("#hiddenText").val(),
            name: $("#Name").val()
        };

        $.ajax({
            type: 'POST',
            dataType: 'JSON',
            url: '/Account/AddRole',
            data: data,
            success: function (data) {
                $("#myModal").modal("hide");
                toastr.success(data.message);
                $("#tblCategory").dataTable().fnDestroy();
                loadRecord();
                $("#roleForm")[0].reset();
            },
            error: function (data) {
                toastr.error(data.message);
            }
        });
    }
});

$(document.body).on('click', 'tr', function (e) {
    e.preventDefault();
    if (e.target.className == "icon-edit") {
        $("#myModal").modal("show");
        //$('html,body').animate({ scrollTop: 0 }, 1200)

        var data = $("#tblCategory").DataTable().row(this).data();

        $("#crdTitle").text("Update Role");
        $("#btnSave").html("Update");
        $("#btnReset").show();

        $("#Name").val(data.name);
        $("#hiddenText").val(data.id);

    } else if (e.target.className == "icon-plus-sign") {
        var data = $("#tblCategory").DataTable().row(this).data();

        window.location.href = "UsersInRole/" + data.id;

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
                    url: '/Account/DeleteRole',
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
                    error: function (data) {
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

function titleFormater() {
    $("#hiddenText").val("");
    $("#crdTitle").text("Create Role");
    $("#btnSave").html("Create");
    $("#btnReset").hide();
    $("#roleForm")[0].reset();
    $("#myModal").modal("hide");
}