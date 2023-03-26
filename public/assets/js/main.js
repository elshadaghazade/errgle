function CopyToClipboard(id){

    var r = document.createRange();

    r.selectNode(document.getElementById(id));

    window.getSelection().removeAllRanges();

    window.getSelection().addRange(r);

    document.execCommand('copy');

    window.getSelection().removeAllRanges();

    $('#clipText').text('Copied!')
    $('#clipText').css('right','0')
}


$('#copyToClip').hover(function(){
    $('#clipText').toggleClass('active')
});


$('#loggedAs').on('click',function(event){
    event.preventDefault()
    $('.logged-info').addClass('active');
});



$(document).mouseup(function (e) {
        if ($('.logged-info').hasClass('active') && !$('.logged-info').is(e.target) && $('.logged-info')
            .has(e.target).length === 0) {
            $('.logged-info').removeClass('active');
        }
});


// dashboard file size
$('#flsizebtn').on('click',function(event){
    event.preventDefault()
    $('.fileSize-info').addClass('active');
});


$(document).mouseup(function (e) {
    if ($('.fileSize-info').hasClass('active') && !$('.fileSize-info').is(e.target) && $('.fileSize-info')
        .has(e.target).length === 0) {
        $('.fileSize-info').removeClass('active');
    }
});