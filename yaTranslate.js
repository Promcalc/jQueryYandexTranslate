;

(function($) {

	var setting = {
	    	srclang: 'ru',
	    	dstlang: 'en,fr',
	    	dstlanglist: {},

	    	apikey: '',
	    	adrlanglist: 'https://translate.yandex.net/api/v1.5/tr.json/getLangs?key=[apikey]&ui=[srclang]',
	    	adrtranslate: 'https://translate.yandex.net/api/v1.5/tr.json/translate?key=[apikey]&text=[text]&lang=[lang]&format=[format]',

	    	showtranslatedirs: null,
	    	hidetranslatedirs: null,

	    	menustyle: null,
	    	menuclass: null
	    },

	    oTranslateDiv = null,
	    sOldParentPos = '',
	    bLeaveObject = true,

	    showTranslateText = function(adr, obResult) {
	      $.getJSON(
	        adr,
	        function(data) {
	        	if( ('code' in data) && (data.code == 200) && ('text' in data) ) {
	        		obResult.html(data.text[0]);
	        	}
	        }
	      );
	    },

	    showTranslateMenu = function(ob) {
		  	var dstList = setting.dstlanglist,
		  	    s = '',
		  	    sAdr = '',
		  	    oParent = $(ob);

	      		if( !$.isEmptyObject(dstList) ) {
	      			if( !oTranslateDiv ) {
	      				oTranslateDiv = $('<div />');
	      				if( setting.menustyle ) {
	      					oTranslateDiv.css(setting.menustyle);
	      				}
	      				if( setting.menustyle ) {
	      					oTranslateDiv.css(setting.menustyle);
	      				}
	      				if( setting.menuclass ) {
	      					oTranslateDiv.addClass(setting.menuclass);
	      				}
	      				oTranslateDiv.appendTo('body');
	      			}
	      			oTranslateDiv.html('');
	      			for(s in dstList) {
	      				sAdr = setting.adrtranslate
	      				  .replace(/\[apikey\]/, setting.apikey)
	      				  .replace(/\[lang\]/, setting.srclang + '-' + s)
	      				  .replace(/\[text\]/, encodeURIComponent(oParent.text()))
	      				  .replace(/\[format\]/, 'plain');

	      				$('<a> ' + s + ' </a>')
	      				  .attr('href', sAdr)
	      				  .attr('title', dstList[s])
	      				  .appendTo(oTranslateDiv);
	      			}
	      			sOldParentPos = oParent.css('position');
	      			oParent.css({position: 'relative'});
	      			oTranslateDiv
	      			  .appendTo(oParent)
	      			  .show()
	      			  .find('a')
	      			  .on('click', function(event) { event.preventDefault(); showTranslateText($(this).attr('href'), oTranslateDiv); return false; } );
	      		}
	    },

	    hideTranslateMenu = function(ob) {
		  	var oParent = $(ob);
	    	if( oTranslateDiv ) {
	    		oTranslateDiv.hide();
	    	}
	    	if( sOldParentPos !== '' ) {
	    		oParent.css({position: sOldParentPos});
	    		sOldParentPos = '';
	    	}
	    };

	$.fn.yaTranslate = function(param) {
		var adrList = setting.adrlanglist,
		    dstList = setting.dstlanglist;

		setting = $.extend(setting, param || {});

		adrList = adrList
			.replace(/\[apikey\]/, setting.apikey)
			.replace(/\[srclang\]/, setting.srclang);

		if( $.isEmptyObject(dstList) ) {
			$.getJSON(
				adrList,
				function(data) {
					var dirs = data.dirs || [],
					    langs = data.langs || {},
					    aDstLang = setting.dstlang.split(','),
					    srcPattern = setting.srclang.toLocaleLowerCase() + '-',
					    nPatternLength = srcPattern.length,
					    i = 0,
					    nMax = 0,
					    s = '';
					for(i = 0, nMax = aDstLang.length; i < nMax; i = i + 1) {
						s = aDstLang[i].replace(/^\s+|\s+$/g, '').toLocaleLowerCase();
						dstList[s] = '';
					}

					for(i = dirs.length - 1; i >= 0; i = i - 1) {
						if( dirs[i].indexOf(srcPattern) !== 0 ) {
							continue;
						}
						s = dirs[i].substr(nPatternLength);
						if( (s in dstList) && (s in langs) ) {
							dstList[s] = langs[s];
						}
					}
				}
			);
		}

		return this
		        .on( "mouseenter", function(event) {
		        	if( bLeaveObject ) {
			        	if( setting.showtranslatedirs ) {
			        		setting.showtranslatedirs(this);
			        	}
			        	else {
			        		showTranslateMenu(this);
			        	}
			        }
		        	bLeaveObject = false;
		        })
		        .on( "mouseleave", function(event) {
		        	bLeaveObject = true;
		        	if( setting.hidetranslatedirs ) {
		        		setting.hidetranslatedirs(this);
		        	}
		        	else {
		        		hideTranslateMenu(this);
		        	}
		        });

}

})(jQuery)