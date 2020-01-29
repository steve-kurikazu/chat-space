$(function() {
  function buildHTML(message){
    if ( message.content && message.image ) {
      var html =
       `<div class="message" data-message-id=${message.id}>
          <div class="message_title">
            <div class="message_title__name">
              ${message.user_name}
            </div>
            <div class="message_title__date">
              ${message.created_at}
            </div>
          </div>
          <div class="message_text">
            <p class="message_text__content">
              ${message.content}
            </p>
            <img src="${message.image}", class="message_text__image">
          </div>
        </div>`
    } else if (message.content) {
      var html =
       `<div class="message" data-message-id=${message.id}>
          <div class="message_title">
            <div class="message_title__name">
              ${message.user_name}
            </div>
            <div class="message_title__date">
              ${message.created_at}
            </div>
          </div>
          <div class="message_text">
            <p class="message_text__content">
              ${message.content}
            </p>
          </div>
        </div>`
    } else if (message.image) {
      var html =
       `<div class="message" data-message-id=${message.id}>
          <div class="message_title">
            <div class="message_title__name">
              ${message.user_name}
            </div>
            <div class="message_title__date">
              ${message.created_at}
            </div>
          </div>
          <div class="message_text">
            <img src="${message.image}", class="message_text__image">
          </div>
        </div>`
    } else {
      var html =
       `<div class="message">
          <div class="message_title">
            <div class="message_title__name">
              ${message.user_name}
            </div>
            <div class="message_title__date">
              ${message.created_at}
            </div>
          </div>
          <div class="message_text">
            <p class="message_text__content">
              ${message.content}
            </p>
          </div>
        </div>`
    };
    return html;
  };

  $('#new_message').on('submit', function(e){
    e.preventDefault();
    
    var formData = new FormData(this);
    var url = $(this).attr('action')
    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(data){
      var html = buildHTML(data);
      $('.messages').append(html);
      $('.main_chat__message_list').animate({ scrollTop: $('.main_chat__message_list')[0].scrollHeight});
      $('form')[0].reset();
      $('.submit_btn').prop('disabled', false);
    })
    .fail(function() {
      alert("メッセージ送信に失敗しました");
      $('.submit_btn').prop('disabled', false);
    })
  })

  var reloadMessages = function() {
    last_message_id = $('.message:last').data("message-id");
    $.ajax({
      url: "api/messages",
      type: 'GET',
      dataType: 'json',
      data: {id: last_message_id}
    })
    .done(function(messages) {
      if (messages.length !== 0) {
        var insertHTML = '';
        $.each(messages, function(i, message) {
          insertHTML += buildHTML(message)
        });
        $('.messages').append(insertHTML);
        $('.main_chat__message_list').animate({ scrollTop: $('.main_chat__message_list')[0].scrollHeight});
        $("#new_message")[0].reset();
        $(".form__submit").prop("disabled", false);
      }
    })
    .fail(function() {
      alert('通信エラーです。自動更新ができません。');
    });
  };

  if (document.location.href.match(/\/groups\/\d+\/messages/)) {
    setInterval(reloadMessages, 7000);
  }
});