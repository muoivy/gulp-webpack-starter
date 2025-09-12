/* Validata Form
 ********************************************** */
const validateForm = () => {
  $(".require").addClass("validate[required]");
  $("#your-katakana").removeClass("validate[required]").addClass("validate[required,custom[katakana]]");
  $("#your-email").removeClass("validate[required]").addClass("validate[required,custom[email]] email");
  $("#your-email_confirm").removeClass("validate[required]").addClass("validate[required,custom[email],equals[your-email]] email");

  $(".input-agree input").addClass("validate[required] agree");

  $(".agree").attr('data-prompt-position', "inline");
  $(".agree").attr( "data-prompt-target", "target-1" );

  $("#formContact").validationEngine({
    scroll: true,
    scrollOffset: $('.l-header').innerHeight() + 100,
    promptPosition : "inline",
    maxErrorsPerField: 1,
    // showOneMessage: true,
    onFieldFailure: function(target) {
      if (target) {
        $(target).parents('.c-form-control').removeClass('is-success').addClass('is-error');
      }
    },
    onFieldSuccess: function(target) {
      if (target) {
        $(target).parents('.c-form-control').removeClass('is-error').addClass('is-success');
      }
    },
    custom_error_messages: {
      '#your-name' : {
        'required': {
          'message': "お名前は必須項目です。"
        }
      },
      '.email' : {
        'required': {
          'message': "メールアドレスは必須項目です。"
        },
        'custom[email]': {
          'message': "メールアドレスの書式に誤りがあります。<br>メールアドレスを正しく入力しなおしてください。"
        }
      },
      '#your-email_confirm' : {
        'equals': {
          'message': "確認用メールアドレスに誤りがあります。"
        }
      },
      '#your-message' : {
        'required': {
          'message': "自己PR/志望動機は必須項目です。"
        }
      },
      '.agree' : {
        'required': {
          'message': "プライバシーポリシーをご確認の上、チェックを入れてください。"
        }
      }
    }
  });
}

validateForm();
