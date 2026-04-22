// **Instructions** **main.js**
// ------------
// In this document you will find instructions on how to adjust different parameters of the paradigm. You can apply the desired changes to the document main.js on your computer or server, using a source code editor.
// The following parameters are necessary to adjust: number of avatar images, and the redirect link at the end of the study. All other parameters have a default option and adjustments are optional.

$(function() {

  // **Parameters**
  // ------------
  
  function set_settings() {
    window.settings = [];
	
    settings.numberofavatars = 35;

    settings.defaultredirect = 'https://osakashakaishinri.qualtrics.com/jfe/preview/previewId/f9dfef6f-813b-434e-a7fc-56452861ef4a/SV_50GU6ZV97rbZEX4?Q_CHL=preview&Q_SurveyVersionID=current';

    settings.tasklength = 90000; // 180000→90000（3分→1分30秒）
 
    // 排斥条件（condition_1）：いいねなし→変更なし（9999999は課題時間外なので維持）
    settings.condition_1_likes = [6000, 9999999]; // ÷2
    // 包含条件（condition_2）：÷2（9999999→課題時間外タイムアウト用なので維持）
    settings.condition_2_likes = [5000, 7500, 17500, 40000, 45000, 75000];  // ÷2
    settings.condition_3_likes = [5000, 5500, 7500, 17500, 40000, 50000, 55000, 75000, 10000]; // ÷2
 
    settings.condition_1_adjusted_likes = [6000, 7000, 7500, 17500, 40000, 50000, 55000, 75000, 10000]; // ÷2 (9)
    settings.condition_2_adjusted_likes = [6000, 7000, 7500, 17500, 40000]; // ÷2 (5)
    settings.condition_3_adjusted_likes = [6000, 9999999]; // ÷2 (1)
	
    settings.likes_by = ['みなみ','Kim','彩','ハル','Y.K','陽菜','蓮','MK','ユウト']; 
  }
  
  function init_intro() {
  	$('#intro').show();
  	$('#submit_intro').on('click',function() {
			$('#intro').hide();
  			init_name();  			
  	});	
  }
  
  function init_name() {

  	$('#name').show();

  	$('#submit_username').on('click',function() {

  		var error = 0;
  		var uname = $('#username').val();

  		if(uname == "") {
  			error = 1;
  			errormsg = '名前を入力してください。';
  			uname = "undefined";
  		}

　　　   function isValidName(name){ 
        return /^[A-Za-z\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]+$/.test(name);
      }
  		if(!isValidName(uname)) {
  			error = 1;
  			errormsg = '文字のみを入力してください(スペースや数字は使わないでください)。';
  		}  		

  		if(error == 0) {
			$('#name').hide();
			window.username = $('#username').val();
  			init_avatar();  			
  		} else {
  			alertify.log(errormsg,"error");
  		}

  	});
  }

  function init_avatar() {
  	$('#avatar').show();

    var avatars = window.settings.numberofavatars;    
  	for(var i=0; i<avatars; i++) 
  	{ 
  		$('.avatars').append('<img id="avatar_' + i+ '" src="avatars/avatar_' + i + '.png" class="avatar" />');
  	} 

  	$('.avatar').on('click', function() {
  		$('.avatar').removeClass('selected');
  		$(this).addClass('selected');
  	});

    	$('#submit_avatar').on('click',function() {
    		if($('.selected').length == 1) {
  			$('#avatar').hide();
  			window.avatar = $('.selected').attr('id');
  			window.avatarexport = /avatar_([^\s]+)/.exec(window.avatar)[1];
    			init_text();  			
    		} else {
    			alertify.log("アバターを選択してください。","error");
    		}
    	});

  }

  // **Slide:** **Description**   
  function init_text() {
    $('#text').show();

    $('#submit_text').on('click', function() {

      var error = 0;
      var errormsg = "";

      var age = $('#age').val();
      var hometown = $('#hometown').val();
      var recentFun = $('#recentFun').val();
      var freeText = $('#freeText').val();

      age = parseInt(age, 10);

      // ========================================
      // 【修正】チェックボックスから趣味を取得（最大3つ）
      // ========================================
      var selectedHobbies = [];
      $('input[type="checkbox"]:checked').each(function() {
        if($(this).val() !== 'その他') {
          selectedHobbies.push($(this).val());
        }
      });

      // 「その他」が選択されていた場合
      var otherChecked = $('#hobby_other').is(':checked');
      var otherText = $('#hobby_other_text').val().trim();
      if(otherChecked) {
        if(otherText !== '') {
          selectedHobbies.push(otherText); // 「〇〇」だけ表示
        } else {
          selectedHobbies.push('その他');
        }
      }
      // ========================================

      // --- バリデーション ---
      var emptyFields = [];

      if (isNaN(age)) {
        emptyFields.push("年齢");
      } else if (age < 18) {
        error = 1;
        errormsg = '18歳以上の方のみ参加できます。';
      }

      if(hometown === "") {
        emptyFields.push("居住地");
      }

      // ========================================
      // 【修正】趣味のバリデーション（チェックボックス対応）
      // ========================================
      if(selectedHobbies.length === 0) {
        emptyFields.push("趣味");
      }
      // ========================================

      if(recentFun === "") {
        emptyFields.push("最近一番楽しかったこと");
      }

      if(freeText.length > 50) {
        error = 1;
        errormsg = 'その他の欄は50字以内で入力してください。';
      }

      if(emptyFields.length >= 2) {
        error = 1;
        errormsg = 'プロフィールを入力してください。';
      }

      if(emptyFields.length === 1) {
        error = 1;
        errormsg = emptyFields[0] + 'を入力してください。';
      }

      if(error === 0) {

        // ========================================
        // 【修正】趣味をカンマ区切りで結合してプロフィールに表示
        // ========================================
        var hobbyDisplay = selectedHobbies.join('、');

        window.profileText =
          "年齢：" + age + "歳<br>" +
          "居住地：" + hometown + "<br>" +
          "趣味：" + hobbyDisplay + "<br>" +
          "最近楽しかったこと：" + recentFun +
          (freeText ? "<br>" + freeText : "");
        // ========================================

        $('#text').hide();
        init_fb_intro();

      } else {
        alertify.log(errormsg, "error");
      }
    });
  }
// 以下、理解度チェックのため、変更・追加
  function init_fb_intro() {
  $('#fb_intro').show();
  $('#submit_fb_intro').on('click',function() {
      $('#fb_intro').hide();
      init_comprehension_check();  // ← ログインの前にクイズへ
  }); 
}

  function init_comprehension_check() {
  $('#comprehension_check').show();

  // ボタンの重複登録を防ぐため off() してから on()
  $('#submit_comprehension').off('click').on('click', function() {
    var q1 = $('input[name="q1"]:checked').val();
    var q2 = $('input[name="q2"]:checked').val();

    // 未回答チェック
    if (!q1 || !q2) {
      alertify.log('すべての質問に回答してください。', 'error');
      return;
    }

    // 正誤判定（①はA、②はB）
    if (q1 === 'A' && q2 === 'B') {
      // 全問正解 → ログインへ
      $('#comprehension_check').hide();
      init_fb_login();
    } else {
      // 1問でも不正解 → 説明ページへ戻す
      alertify.log('正しく理解できていない項目があります。もう一度指示を読んでください。', 'error');
      $('#comprehension_check').hide();

      // ラジオボタンをリセット
      $('input[name="q1"]').prop('checked', false);
      $('input[name="q2"]').prop('checked', false);

      // fb_introに戻る（ボタンのイベントを再登録するためinit_fb_intro()を呼ぶ）
      init_fb_intro();
    }
  });
}
// ここまで
	
  function init_fb_login() {
  	$('#fb_login').show();

  	setTimeout(function() {
  		$('#msg_all_done').show();
  		$("#loader").hide();
  	}, 8000);
	
  	$('#submit_fb_login').on('click',function() {
			$('#fb_login').hide();
  			init_task();  			
  	});	
  }
  
  // **Slide:** **Task**   
 function init_task() {
    $('#task').show();
    $('#countdown').show();
	 
	shortcut.add("Backspace",function() {});      

  	jQuery("#countdown").countDown({
  		startNumber: window.settings.tasklength/1000,
  		callBack: function(me) {
  			console.log('over');
        $('#timer').text('00:00');
  		}
  	});
	   
		users = {
		  "posts" : [
			{
			  "avatar": 'avatars/' + window.avatar + '.png',
			  "username": window.username,
			  "text": window.profileText,
			  "likes": window.settings.condition_likes,
			  "usernames": window.settings.likes_by
			}
		  ]
		};
		
    var tpl = $('#usertmp').html(),html = Mustache.to_html(tpl, users);
	  $("#task").append(html);
	  
    var tpl = $('#otherstmp').html(),html = Mustache.to_html(tpl, others);
	  $("#task").append(html);
 
    function reorder() {
       var grp = $("#others").children();
       var cnt = grp.length;
       var temp,x;
       for (var i = 0; i < cnt; i++) {
           temp = grp[i];
         x = Math.floor(Math.random() * cnt);
         grp[i] = grp[x];
         grp[x] = temp;
     }
     $(grp).remove();
     $("#others").append($(grp));
    }
    reorder();    

	  $('.userslikes').each(function() {
  		var that = $(this);
  		var usernames = $(this).data('usernames').split(",");
  		var times = $(this).data('likes').split(",");

  		for(var i=0; i<times.length; i++) 
  		{ 
  			times[i] = +times[i]; 
  			themsg = usernames[i] + " があなたの投稿に「いいね」しました。";
  			setTimeout(function(themsg) {
  				that.text(parseInt(that.text()) + 1);
  				alertify.success(themsg)
  			}, times[i], themsg);
  		} 		
	  });
	  
	  $('.otherslikes').each(function() {
  		var that = $(this);
  		var times = $(this).data('likes').split(",");
  		for(var i=0; i<times.length; i++) 
  		{ 
  			times[i] = +times[i]; 
  			setTimeout(function () {
  				that.text(parseInt(that.text()) + 1);
  			}, times[i]);
  		} 
	  });

	  $('.btn-like').on('click', function() {
		  $(this).prev().text(parseInt($(this).prev().text()) + 1);
		  $(this).attr("disabled", true);
	  });
	 
 $('#task').masonry({
   itemSelector : '.entry',
   columnWidth : 10
 });
    setTimeout(function() {
    
      $(window).unbind('beforeunload');
      $('#timer').text('00:00');

      // ========================================
      // クアルトリクスに実験完了を通知
      // ========================================
      notifyQualtrics();
      
    }, window.settings.tasklength);

  }
	
  function get_params() {

    if(window.QueryString.c === undefined) {
        window.condition = (Math.random() < 0.5) ? 1 : 2;
        console.log("Random Condition:", window.condition);
    }

    if(window.QueryString.c !== undefined && !isNaN(parseInt(window.QueryString.c))) {
        const c = parseInt(window.QueryString.c);
        if(c === 1 || c === 2) {
            window.condition = c;
        }
    }

    if(window.QueryString.p !== undefined && window.QueryString.p !== "") {
      window.participant = window.QueryString.p;
    } else {
      window.participant = "0";
    }

    if(window.QueryString.redirect !== undefined && window.QueryString.redirect !== "") {
      window.redirect = decode(window.QueryString.redirect);
    } else {
        window.redirect = window.settings.defaultredirect;
    }
    
    var urlHasQuestionMark = (window.redirect.indexOf("?") > -1);
    if(!urlHasQuestionMark) {
        window.redirect = window.redirect + "?redir=1";
    }
  }

  function adjust_to_condition() {
	switch(condition) {
		case 1:
			window.settings.condition_likes = settings.condition_1_likes;
			window.others.posts[1].likes = settings.condition_1_adjusted_likes;
			break;
		case 2:
			window.settings.condition_likes = settings.condition_2_likes;
			window.others.posts[1].likes = settings.condition_2_adjusted_likes;
			break;
		case 3:
			window.settings.condition_likes = settings.condition_3_likes;
			window.others.posts[1].likes = settings.condition_3_adjusted_likes;
			break;
	}	
  }

  window.QueryString = function () {
    var query_string = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
      var pair = vars[i].split("=");
      if (typeof query_string[pair[0]] === "undefined") {
        query_string[pair[0]] = pair[1];
      } else if (typeof query_string[pair[0]] === "string") {
        var arr = [ query_string[pair[0]], pair[1] ];
        query_string[pair[0]] = arr;
      } else {
        query_string[pair[0]].push(pair[1]);
      }
    } 
    return query_string;
  } ();

  function not_alphanumeric(inputtxt) {
    var letterNumber = /^[0-9a-zA-Z]+$/;
    if(inputtxt.match(letterNumber)) {
        return false;
      } else { 
        return true; 
      }
  }

  function pad (str, max) {
    return str.length < max ? pad("0" + str, max) : str;
  }

  function encode(unencoded) {
	return encodeURIComponent(unencoded).replace(/'/g,"%27").replace(/"/g,"%22");	
  }
  function decode(encoded) {
	return decodeURIComponent(encoded.replace(/\+/g,  " "));
  }

  jQuery.fn.countDown = function(settings,to) {
    settings = jQuery.extend({
      startFontSize: "12px",
      endFontSize: "12px",
      duration: 1000,
      startNumber: 10,
      endNumber: 0,
      callBack: function() { }
    }, settings);
    return this.each(function() {
      if(!to && to != settings.endNumber) { to = settings.startNumber; }  
      jQuery(this).children('.secs').text(to);
      jQuery(this).animate({
        fontSize: settings.endFontSize
      }, settings.duration, "", function() {
        if(to > settings.endNumber + 1) {
          jQuery(this).children('.secs').text(to - 1);
          jQuery(this).countDown(settings, to - 1);
          var minutes = Math.floor(to / 60);
          var seconds = to - minutes * 60;
          jQuery(this).children('.cntr').text(pad(minutes.toString(),2) + ':' + pad(seconds.toString(),2));
        }
        else {
          settings.callBack(this);
        }
      });
    });
  };

  // ========================================
  // クアルトリクス連携：実験完了通知関数
  // ========================================
  function notifyQualtrics() {
    console.log('=== 実験完了：クアルトリクスに通知 ===');
    if (window.parent !== window) {
      window.parent.postMessage('ostracism_complete', '*');
      console.log('通知送信完了');
    } else {
      console.log('iframe内ではないため通知をスキップ');
    }
  }

  shortcut.add("f5",function() {});  
  $(window).bind('beforeunload', function(){
    return 'Are you sure you want to quit the experiment completely?';
  });   

  set_settings();
  get_params();
  adjust_to_condition();

  init_intro();

});
