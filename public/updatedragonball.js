function updateDragonball(id){
    $.ajax({
        url: '/dragonballs/' + id,
        type: 'PUT',
        data: $('#update-dragonball').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};