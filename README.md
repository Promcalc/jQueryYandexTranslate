jQueryYandexTranslate
=====================

jQuery plugin for yandex translate api

Test example code:

```
<script type="text/javascript" src="yaTranslate.js"></script>
<script type="text/javascript">
/*<![CDATA[*/

jQuery(function($) {
	var settings = {
		srclang: 'ru',                                // source language
		dstlang: 'en,fr',                             // destination languages, comma separated list
		apikey: 'api_key_you_can_get_on_yandex_site', // http://api.yandex.ru/key/form.xml?service=trnsl
	};

	jQuery(".textelements").yaTranslate(settings);
});

/*]]>*/
</script>
```
