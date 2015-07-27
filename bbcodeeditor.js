/*
 * bbCodeEditor 1.0
 * 
 * Author: abcx
 */
;
(function($, window, document, undefined) {
	'use strict';

	var pluginName = 'bbCodeEditor',
		defaults = {
			mode : "bbcode" // 'html' || 'bbcode'
		};

	function Plugin(element, options) {
		this.element = element;
		this.$el = $(element);
		this.options = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	}
	function addTags(options, eId, Tag, fTag, Message) {
		/* add specified tag to textarea */
		var obj = document.getElementById( eId ); 
		
		obj.focus(); 
		
		if (document.selection && document.selection.createRange) {  // Internet Explorer 
			var sel = document.selection.createRange(); 
			if (sel.parentElement() == obj)  sel.text = Tag + sel.text + fTag; 
		} 
		
		else if (typeof(obj) != "undefined") { // Firefox 
			var longueur = parseInt(obj.value.length),
				selStart = obj.selectionStart,
				selEnd = obj.selectionEnd; 
			obj.value = obj.value.substring(0,selStart) + Tag + obj.value.substring(selStart,selEnd) + fTag + obj.value.substring(selEnd,longueur); 
		} 
		else obj.value += Tag + fTag;
	
		if ( Message ) { // insert URL
			switch ( options.mode ) {
				case 'html':
					obj.selectionStart = selStart + 9;
					obj.selectionEnd = obj.selectionStart + 5;
				break;
				case 'bbcode':
					obj.selectionStart = selStart + 5;
					obj.selectionEnd = obj.selectionStart + 5;
				break;
			}
		}
		obj.focus(); 
	}
	function getClass( cls ) {
		/* returns second class name */
		return cls.split(' ')[1];
	}
	function convert( $textarea ) {
		/* converts textarea html contents into bbcode */
		var
			code = $textarea.val(),
			codeOut = '';
			
		if ( code !== '' && code !== undefined) {
			codeOut = code.split('<a href=').join('[url=');
			codeOut = codeOut.split('a>').join('url]');
			codeOut = codeOut.split('<br/>').join("[br/]\n");
			codeOut = codeOut.split('<').join('[');
			codeOut = codeOut.split('>').join(']');
			
			$textarea.val( codeOut );
		}
	}

	Plugin.prototype = {
		init: function() {
			var
				$this = this.$el,
				id = $this.attr('id');

			$this.before(
			'<div class="formatText">' +
			'   <nav>' +
			'       <ul>' +
			'           <li class="formatTextBold ' + id + '" title="bold">B</li>' +
			'           <li class="formatTextItalic ' + id + '" title="underline">I</li>' +
			'           <li class="formatTextLink ' + id + '" title="link">link</li>' +
			'           <li class="formatView ' + id + '" title="preview">&#9673;&#9673;</li>' +
			'       </ul>' +
			'   </nav>' +
			'</div>');
			$this.appendTo( $this.prev() );
			
			var
				$elm = $this.parent( $('.formatText') ),
				$buttonBold = $elm.find('.formatTextBold').eq(0),
				$buttonItalic = $elm.find('.formatTextItalic').eq(0),
				$buttonLink = $elm.find('.formatTextLink').eq(0),
				$buttonView = $elm.find('.formatView').eq(0);
			
			$buttonBold.bind('click', {options: this.options, id: id}, this.btnBoldClick);
			$buttonView.bind('click', {options: this.options, id: id}, this.btnViewClick);
			$buttonItalic.bind('click', {options: this.options, id: id}, this.btnItalicClick);
			$buttonLink.bind('click', {options: this.options, id: id}, this.btnLinkClick);

			if ( this.options.convert ) {
				convert( $this );
			}

			$(document).keydown( {options: this.options}, function(e) {
				if (e.keyCode == 13) { // enter
					if ( $('textarea').is(":focus") ) {

						if ( $('*:focus').attr('id') === id ) {

							switch ( e.data.options.mode ) {
								case 'html':
									addTags( e.data.options, id, '<br/>','');
								break;
								case 'bbcode':
									addTags( e.data.options, id, '[br/]','');
								break;
							}
						}
					}
				}
			});
		},
		destroy: function() {
			var
				$this = this.$el,
				$parent = this.$el.parent(),
				id = $this.attr('id'),
				$nav = $parent.find('nav').eq(0),
				$buttonBold = $parent.find('.formatTextBold').eq(0),
				$buttonItalic = $parent.find('.formatTextItalic').eq(0),
				$buttonLink = $parent.find('.formatTextLink').eq(0),
				$buttonView = $parent.find('.formatView').eq(0);

			$buttonBold.unbind("click");
			$buttonItalic.unbind("click");
			$buttonLink.unbind("click");
			$buttonView.unbind("click");
			
			$nav.remove();
			
			$this.unwrap();
			
			$this.removeData();
		},
		btnBoldClick: function(e) {

			switch ( e.data.options.mode ) {
				case 'html':
					addTags( e.data.options, e.data.id, '<b>','</b>');
				break;
				case 'bbcode':
					addTags( e.data.options, e.data.id, '[b]','[/b]');
				break;
			}
        },
		btnItalicClick: function(e) {
			switch ( e.data.options.mode ) {
				case 'html':
					addTags( e.data.options, e.data.id, '<i>','</i>');
				break;
				case 'bbcode':
					addTags( e.data.options, e.data.id, '[i]','[/i]');
				break;
			}
		},
		btnLinkClick: function(e) {
			switch ( e.data.options.mode ) {
				case 'html':
					addTags( e.data.options, e.data.id, '<a href="adres">','</a>', true);
				break;
				case 'bbcode':
					addTags( e.data.options, e.data.id, '[url=adres]','[/url]', true);
				break;
			}
		},
		btnViewClick: function( e ) {
			var
				$this = $(this),
				$textarea = $( '#' + getClass( $this.attr('class') ) ),
				$el = $this.parent( $('.formatText') ),
				$buttonBold = $el.find('.formatTextBold').eq(0),
				$buttonItalic = $el.find('.formatTextItalic').eq(0),
				$buttonLink = $el.find('.formatTextLink').eq(0),
				code = '',
				codeOut = '';

			if ( !$textarea.next().hasClass('viewArea') ) {

				switch ( e.data.options.mode ) {
					case 'html':
						codeOut = $textarea.val();
					break;
					default:
						code = $textarea.val();
						if ( code !== '' && code !== undefined) {
							codeOut = code.split('[url=').join('<a href=');
							codeOut = codeOut.split('url]').join('a>');
							codeOut = codeOut.split('[').join('<');
							codeOut = codeOut.split(']').join('>');
						}
					break;
				}

				$textarea
						 .wrap('<div class="viewAreaParent"></div>')
						 .after('<div class="viewArea">' + codeOut + '</div>');

				$buttonBold.addClass('noVisible');
				$buttonItalic.addClass('noVisible');
				$buttonLink.addClass('noVisible');
			}
			else {
				$textarea.unwrap().next( $('.viewArea') ).remove();

				$buttonBold.removeClass('noVisible');
				$buttonItalic.removeClass('noVisible');
				$buttonLink.removeClass('noVisible');
			}
		}
	};

	$.fn[pluginName] = function(option) {
		var args = arguments,
				result;
		
		this.each(function() {
			var $this = $(this),
				data = $.data(this, 'plugin_' + pluginName),
				options = typeof option === 'object' && option;
			if (!data) {
				$this.data('plugin_' + pluginName, (data = new Plugin(this, options)));
			}

			if (typeof option === 'string') {
				result = data[option].apply(data, Array.prototype.slice.call(args, 1));
			}
		});

    return result || this;
	};

})(jQuery, window, document);
