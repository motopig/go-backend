/**
 * Created by guoruili on 16/7/19.
 */
/**
 * v 0.2
 * 参数:
 * url: 弹出页面的url
 * method: 提交方式
 * formId: 提交的表单名
 * updateId: 异步更新的列表名
 * callback: 提交完成的回调函数
 *
 * 举个栗子:
 * $('body').on('click', '#createnewclient' ,function(){
        $(this).gmodal({
            url:'{{ url('admin/client/create') }}', // 想要填充的页面
            method:'post',                          // 表单提交方式
            formId: 'form-data',                    // 提交的表单id
            updateId: 'list-clients',               // 提交后需要刷新的列表id
            callback:function(res){
                alert('success');                   // 提交后的自定义回调处理
            }
        })
    })

    表单页参照 resources/views/backend/api/client/..
 */
;(function($){
    $.fn.gmodal = function(obj) {
        var t = this;
        //提交或者填充页面的地址
        var oburl = obj.url;
        //填充的model
        var model;
        model = '<div class="modal fade" id="ajaxModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
            '<div class="modal-dialog">' +
            '<div class="modal-content">' +
            '</div>' +
            '</div>' +
            '</div>';
        t.after(model);

        //填充错误显示
        var errorshow = function (errors) {
            $.each(errors, function (i, v) {
                $('#' + i).css({'border-color': 'red'}).parent().next('.my-error-message').css('color','red').text(v);
                $('#' + i).parent().parent().next('.my-error-message').css('color','red').text(v);
            })
        }


        // 解绑
        $('#ajaxModal').unbind().modal({
            remote: oburl
        }).on('loaded.bs.modal', function () {
            var formId;
            if (typeof(obj.formId) == 'undefined') {
                formId = 'form';
            } else {
                formId = '#' + obj.formId
            }
            var commiturl = $(formId).attr('form-action');

            $('#submit-btn').on('click', function () {
                //还原错误样式
                $('.has-error').remove();
                $(formId + ' input').css({'border-color': '#e5e6e7'});

                $.ajax({
                    url: commiturl,
                    async: false,
                    type: obj.method,
                    dataType: 'json',
                    data: $(formId).serialize(),
                    success: function (res) {
                        console.log(res.message);
                        if (res.error) {
                            errorshow(res.message);
                            return false;
                        } else {
                            $('#ajaxModal').unbind().modal('hide');
                            $('body').removeClass('modal-open').remove('.modal');
                            $('.modal-backdrop').remove();
                            $('#'+obj.updateId).load(window.location.href + ' ' + '#' + obj.updateId);
                        }
                        //自定义回调
                        if (typeof(obj.callback) != 'undefined') {
                            obj.callback(res);
                        }
                        //see https://github.com/twbs/bootstrap/issues/12990
                    },
                    error: function (e) {
                        errorshow(e.responseJSON);
                    }
                });
            })
        }).on('hide.bs.modal', function () {
            $('body').removeClass('modal-open').remove('.modal');
            $('.modal-backdrop').remove();
        })


        $('body').on('hide.bs.modal', '.modal', function () {
            $(window).unbind('.gmodal');
            $(this).removeData('bs.modal').remove('.modal');
        });

    }
})(jQuery);


$(document).ready(function () {
    $('body').on('click','.select-all',function () {
        $('.icheckbox_square-green').each(function () {
            var onstate = $(this).hasClass('checked');
            if (!onstate) {
                $(this).addClass('checked');
            }
        })
    });
    $('body').on('click','.cancel-select',function () {
        $('.icheckbox_square-green').each(function () {
            var onstate = $(this).hasClass('checked');
            if (onstate) {
                $(this).removeClass('checked');
            }
        })
    })
});