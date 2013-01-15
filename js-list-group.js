/*
	JavaScript group list jQuery plugin

	Author:  László Vadász
	Version: 1.0
	Update:  2013.01.11.
*/

(function ($) {
	$.fn.listGroup = function (options) {
		var O = $.extend({}, {
			itemClass :'item',			// List item class
			groupClass : 'item-group',	// List group item class
			// Default function to grouping
			grouperFunction : function (item) { return $(item).text().charAt(0); }
		}, options);

		this.each(function () {
			var root = $(this).scrollTop(0),
				groupers = prepareGroup(root, getGroups(root));

			root.css('position', 'relative').scroll(getScrollHandler(root, groupers));
		});

		// Create scroll handler function
		function getScrollHandler (root, groupers) {
			var idx = 0,
				prevPos = 0,
				prevDelte,
				dir = 1;

			return function(pos){
				var pos = root.scrollTop(),			// current scroll position
					delta = pos - prevPos;			// scroll position changes

				if (delta > 0 ^ prevDelte > 0){
					dir = delta < 0 ? 0 : -1		// direction change
				}

				if (delta > 0 && idx < groupers.length && groupers[idx].originY < pos){
					idx ++;
				} else if (delta < 0 && idx > 0 && groupers[idx].originY > pos){
					groupers[idx].item.css('top', groupers[idx].originY);
					idx --;
				}

				if (idx > 0){
					var itemOffset = 0;
					if (dir === -1){
						itemOffset = (groupers[idx].originY - groupers[idx-1].item.outerHeight() - pos);
						groupers[idx-1].item.css('top', pos + Math.min(itemOffset, 0));
					} else {
						itemOffset = (pos - (groupers[idx+1].originY - groupers[idx].item.outerHeight()));
						groupers[idx].item.css('top', pos - Math.max(itemOffset, 0));
					}
				} else {
					groupers[0].item.css('top', pos);
				}

				prevPos = pos;					// update previus position value
				prevDelte = delta				// update previus delta value
			}
		}

		function prepareGroup (root, groups) {
			var list = [],
				rootOffset = root.offset().top + ((root.outerHeight() - root.height()) / 2);
			groups.each(function() {
				var _this = $(this),
					data = {
						item: _this,
						originY: _this.offset().top - rootOffset
					};
				_this.clone().insertBefore(_this).css('opacity', '0');
				_this.css({
					position: 'absolute',
					top: data.originY
				});
				list.push(data);
			});
			return list;
		}

		function getGroups (root) {
			var curGroup, tmp, groups = root.find('.' + O.groupClass);
			if (groups.length == 0){
				root.find('.' + O.itemClass).each(function () {
					if (curGroup != (tmp = O.grouperFunction(this))){
						curGroup = tmp;
						$(this).clone().insertBefore(this).text(curGroup).attr('class', O.groupClass);
					}
				});
				return root.find('.' + O.groupClass);
			} else {
				groups;
			}
		}
	}
})(jQuery)
