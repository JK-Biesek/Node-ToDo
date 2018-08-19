$(document).ready(function () {
    $("#deleteAll").click(function () {
        if ($('#deleteAll').val() != '' && $('#deleteAll').val() == 'del_allTaks') {
            var deleteAll = $('#deleteAll').val();
            var data = {};
            data.title = "Delete all Tasks";
            data.message = deleteAll;
            $.ajax({
                type: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                url: 'http://localhost:3000/deleteAll',
                success: function (data) {
                    console.log(data);
                    $('.msg').addClass('alert alert-info text-center').append(data).delay(5000).fadeOut(400);
                }
            });
        }
    });


    $( "#edit_task" ).click(function() {
        var id = $('#hidden_edit').val();
        var taskId = $('#hiddenId').val();
        var name = $('#name_'+id).text();
        var desc = $('#desc_'+id).text();
        var dir = $('#dir_'+id).text();
        
        if(taskId == id){
            $('#edit_taskName').val(name);
            $('#edit_taskDesc').val(desc);
            $('#edit_taskDir').val(dir);
        }
    });
});