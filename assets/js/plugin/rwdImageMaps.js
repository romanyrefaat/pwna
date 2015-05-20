(function($) {
    $.fn.rwdImageMaps = function() {
        var $img = this;
        var rwdImageMap = function() {
            $img.each(function() {
                if (typeof($(this).attr('usemap')) == 'undefined')
                    return;
                var that = this,
                        $that = $(that);
// Since WebKit doesn't know the height until after the image has loaded, perform everything in an onload copy
                $('<img />').load(function() {
                    var attrW = 'width',
                            attrH = 'height',
                            w = $that.attr(attrW),
                            h = $that.attr(attrH);
                    if (!w || !h) {
                        var temp = new Image();
                        temp.src = $that.attr('src');
                        if (!w)
                            w = temp.width;
                        if (!h)
                            h = temp.height;
                    }
                    var wPercent = $that.width() / 100,
                            hPercent = $that.height() / 100,
                            map = $that.attr('usemap').replace('#', ''),
                            c = 'coords';
                    if ($that.data('rollover')) {
                        if ($that.parent().find('.rollover').length === 0) {
                            //<img src="' + $that.data('rollover') + '"/>
                            var rollover = $('<a class="rollover hidden"></a>');
                            rollover.mouseout(function() {
                                $(this).addClass("hidden");
                            });
                            $that.parent().append(rollover);
                        }
                    }
                    $('map[name="' + map + '"]').find('area').each(function() {
                        var $this = $(this);
                        if (!$this.data(c))
                            $this.data(c, $this.attr(c));
                        var coords = $this.data(c).split(','),
                                coordsPercent = new Array(coords.length);
                        for (var i = 0; i < coordsPercent.length; ++i) {
                            if (i % 2 === 0)
                                coordsPercent[i] = parseInt(((coords[i] / w) * 100) * wPercent);
                            else
                                coordsPercent[i] = parseInt(((coords[i] / h) * 100) * hPercent);
                        }
                        $this.attr(c, coordsPercent.toString());
                        $this.hover(function() {
                            var rollover = $that.parent().find('.rollover');
                            rollover.css({
                                left: coordsPercent[0] + 'px',
                                top: coordsPercent[1] + 'px',
                                width: coordsPercent[2] - coordsPercent[0] + 'px',
                                height: coordsPercent[3] - coordsPercent[1] + 'px',
                                'background-size': $that.width() + 'px ' + $that.height() + 'px',
                                'background-position': coordsPercent[0] * -1 + 'px ' + coordsPercent[1] * -1 + 'px'
                            }).attr('href', $this.attr('href')).attr('target', $this.attr('target')).removeClass('hidden').toggleClass('dummy', $this.hasClass('dummy'));
                        });
                    });
                }).attr('src', $that.attr('src'));
            });
        };
        $(window).resize(rwdImageMap).trigger('resize');
        return this;
    };
})(jQuery);