let isUpdated = true
$(document).on("click", ".resolve-btn", function(e){
    e.preventDefault()
    let id = $(this).val()
    $.ajax({
        url: "/collect/update/u",
        method: "POST",
        data: {id}
    }).then((response) => {
        if(isUpdated) {
            $(this).html("Undo")
            isUpdated = false
        } else {
            $(this).html("Mark as resolved")
            isUpdated = true
        }
    })
})
let isDeleted = true
$(document).on("click", ".delete-btn", function(e){
    e.preventDefault()
    let id = $(this).val()
    $.ajax({
        url: "/collect/delete/d",
        method: "POST",
        data: {id}
    }).then((response) => {
        if(isDeleted) {
            $(this).html("Undo")
            isDeleted = false
        } else {
            $(this).html("Delete")
            isDeleted = true
        }
    })
})