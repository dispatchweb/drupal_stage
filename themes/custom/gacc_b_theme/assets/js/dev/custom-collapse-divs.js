(function($) {
	$.fn.collapseList = function(options) {
		var settings = $.extend({
			'collapseNum' : 1,
			'moreLinkText' : 'view more',
			'lessLinkText' : 'view less'
		}, options);
		
		return this.each(function () {
			var collapseList = $(this);
			var count= 0;
			//find the height of the first n list items
			var collapseHeight = parseInt(collapseList.css('marginTop').replace('px','')) + parseInt(collapseList.css('paddingTop').replace('px',''));
			collapseList.children('div:lt(' + settings.collapseNum + ')').each(function(){
				collapseHeight += $(this).outerHeight(true);
			});
			collapseList.children('div').each(function(){
				count++;
			});                
			
			//only collapse the UL if there is a found height to collapse to
			if (collapseHeight > 0 && settings.collapseNum < count) {
				//add necessary HTML
				collapseList.wrap('<div class="collapseWrapper" />');
				var collapseWrapper = collapseList.parent();
				collapseWrapper.after('<a href="#" class="collapseMore">' + settings.moreLinkText + '</a>');
				
				//apply initial collapse
				collapseWrapper.css({ 'height': collapseHeight });
				
				//apply the click function to the appropriate link, which hides and shows the full list
				collapseWrapper.next('a.collapseMore').click(function () {
					if ($(this).hasClass('expanded')) {
						collapseWrapper.animate({ height: collapseHeight }, 500);
						$(this).text(settings.moreLinkText).removeClass('expanded');
					}
					else {
						collapseWrapper.animate({ height: collapseList.outerHeight(true) }, 500);
						$(this).text(settings.lessLinkText).addClass('expanded');
					}
					return false;
				});
			}
		});
	}
})(jQuery);