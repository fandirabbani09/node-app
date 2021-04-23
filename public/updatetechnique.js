function updateTechnique(id){
    $.ajax({
        url: '/techniques/' + id,
        type: 'PUT',
        data: $('#update-technique').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};