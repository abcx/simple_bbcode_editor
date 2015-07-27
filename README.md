# simple_bbcode_editor
Simple BBCode editor for your webpage or CMS. Require jQuery.

##Usage:

###Into HEAD section
```html
<link rel="stylesheet" href="bbcodeeditor.css">
```
###Before closing BODY section
```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
<script src="bbcodeeditor.js"></script>
```
###Configuration
```html
<script>
$(document).ready(function(){
    $("#element").bbCodeEditor({
        mode: 'bbcode',      // or 'html' to display html in edit window
        convert: 'true'      // converts textarea html contents to bbcode on plugin init
    });
})
</script>
```
