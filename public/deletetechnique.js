function deleteTechnique(id){
    $.ajax({
        url: '/techniques/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};