function deleteCharacterTechnique(id){
    $.ajax({
        url: '/character_techniques/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};