
function status(s) {
    return (s == 1) ? '<span class="question-answered question-answered-done"><i class="icon-ok"></i>solved</span>' : '<span class="question-answered"><i class="icon-ok"></i>In progress</span>';

}

//load all report of index page
function loadAllReport(current_page, page_size) {
    $.ajax({
        type: 'POST',
        dataType: 'JSON',
        url: '/Question/AllReport',
        data: { page: current_page, size: page_size },
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
                    var body = "";
                    if (v.body == null) { body = v.body } else { body = v.body.substr(0, 315) }

                    var item = '<article class="question question-type-normal">' +
                        '<h2>' +
                        '<a href="/Question/ViewReport/' + v.id + '">' + v.title + '</a> </h2>' +
                        '<a class="question-report" href="#"><i class="icon-question-sign"></i> অভিযোগ</a>' +
                        '<div class="question-author">' +
                        '<a href="#" original-title="' + v.name + '" class="question-author-img tooltip-n"><span></span><img alt="" src="lib/report.png"></a>' +
                        '</div>' +
                        '<div class="question-inner">' +
                        '<div class="clearfix"></div>' +
                        '<p class="question-desc">' + body + '</p>' +
                        '<div class="question-details">' +
                        status(v.status) +
                        '<span class="question-date"><i class="icon-time"></i>' + time_ago(v.askedOn) + '</span>' +
                        '</div>' +
                        '<span class="question-category"><a href="/Question/Department/' + v.departmentId + '"><i class="icon-folder-close"></i>' + v.department + '</a></span>' +

                        '<div class="clearfix"></div>' +
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
function loadMore(id, action, has_more) {
    $('.load-questions').on('click', function () {
        page++;
        $.ajax({
            type: 'POST',
            dataType: 'JSON',
            url: '/Question/' + action + '/' + id,
            data: { page: page, size: size },
            success: function (data) {
                if (data.length != 0) {
                    $.each(data.data, function (i, v) {
                        var item = '<article class="question question-type-normal">' +
                            '<h2>' +
                            '<a href="/Question/ViewReport/' + v.id + '">' + v.title + '</a> </h2>' +
                            '<a class="question-report" href="#"><i class="icon-question-sign"></i> অভিযোগ</a>' +
                            '<div class="question-author">' +
                            '<a href="#" original-title="' + v.name + '" class="question-author-img tooltip-n"><span></span><img alt="" src="lib/report.png"></a>' +
                            '</div>' +
                            '<div class="question-inner">' +
                            '<div class="clearfix"></div>' +
                            '<p class="question-desc">' + v.body.substr(0, 315) + '</p>' +
                            '<div class="question-details">' +

                            status(v.status) +
                            '<span class="question-date"><i class="icon-time"></i>' + time_ago(v.askedOn) + '</span>' +
                            '</div>' +
                            '<span class="question-category"><a href="/Question/Department/' + v.departmentId + '"><i class="icon-folder-close"></i>' + v.department + '</a></span>' +

                            '<div class="clearfix"></div>' +
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

//Load report of each department
function loadDepartmentReport(current_page, page_size) {
    $.ajax({
        type: 'POST',
        dataType: 'JSON',
        url: '/Question/GetReportByDepartment/' + $('#itoken').val(),
        data: { page: current_page, size: page_size },
        success: function (data) {
            length += data.dlen - page_size;
     
            if (length <= 0) {
                $('.load-questions').text('আপাতত আর কোন রিপোর্ট নেই!');
                $('.load-questions').off('click');
            }

            if ($('.col-md-12 h1')[0]) {
                $('.col-md-12 h1').text(data.department.name);
            }

            if (data.dlen != 0) {
                if (current_page == 1) {
                    $('.randr').empty();
                }
                
                $.each(data.data, function (i, v) {
                    var body = "";
                    if (v.body == null) { body = v.body } else { body = v.body.substr(0, 315) }

                    var item = '<article class="question question-type-normal">' +
                        '<h2>' +
                        '<a href="/Question/ViewReport/' + v.id + '">' + v.title + '</a> </h2>' +
                        '<a class="question-report" href="#"><i class="icon-question-sign"></i> অভিযোগ</a>' +
                        '<div class="question-author">' +
                        '<a href="#" original-title="' + v.name + '" class="question-author-img tooltip-n"><span></span><img alt="" src="'+window.location.origin + '/lib/report.png"></a>' +
                        '</div>' +
                        '<div class="question-inner">' +
                        '<div class="clearfix"></div>' +
                        '<p class="question-desc">' + body + '</p>' +
                        '<div class="question-details">' +
                        status(v.status) +
                        '<span class="question-date"><i class="icon-time"></i>' + time_ago(v.askedOn) + '</span>' +
                        '</div>' +
                        '<span class="question-category"><a href="/Question/Department/' + v.departmentId + '"><i class="icon-folder-close"></i>' + v.department + '</a></span>' +

                        '<div class="clearfix"></div>' +
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
            "url": "/Question/GetAllReport",
            "type": "POST",
            "dataType": "json"
        },
        "columns": [
            { "data": "title", "title": "title", "autoWidth": false },
            { "data": "name", "name": "name", "autoWidth": false },
            { "data": "phone", "name": "phone", "autoWidth": false },
            {
                "data": "askedOn", "name": "askedOn", "autoWidth": false, 'render': function (data) {
                    var date = new Date(data);
                    var month = ("0" + (date.getMonth() + 1)).slice(-2);
                    return ("0" + date.getDate()).slice(-2) + '-' + month + '-' + date.getFullYear();
                }
            },
            {
                "data": "status", "name": "status", "autoWidth": false, 'render': function (data) {
                    if (data == 1) {
                        return '<span class="badge badge-success">Solved</span>';
                    } else {
                        return '<span class="badge badge-warning">Pending</span>';
                    }
                }
            },
            {
                "data": "id", "name": "id", "autoWidth": false, "render": function () {
                    return '<a href="#" class=""><i class="icon-eye-open"></i> </a>'+
                         '<a href="#" class=""><i class="icon-exchange"></i> </a>' +
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

        window.location.href = '/Question/ViewReport/' + data.id;

    } else if (e.target.className == "icon-exchange") {
        var data = $("#tblCategory").DataTable().row(this).data();

        $.ajax({
            type: 'POST',
            dataType: 'JSON',
            url: '/Question/ToggleStatus',
            data: { id: data.id },
            success: function (res) {

                if (res.flag == 1) {
                    toastr.success(res.message);
                } else {
                    toastr.error(res.message);
                }

                $("#tblCategory").dataTable().fnDestroy();
                loadRecord();
            },
            error: function (res) {
                toastr.error(res.message);
            }
        })

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
                    url: '/Question/DeleteReport',
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