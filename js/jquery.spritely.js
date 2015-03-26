/*
 * jQuery spritely 0.6.7
 * http://spritely.net/
 *
 * Documentation:
 * http://spritely.net/documentation/
 *
 * Copyright 2010-2011, Peter Chater, Artlogic Media Ltd, http://www.artlogic.net/
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 */

(function(jQuery) {
    jQuery._spritely = {
        // shared methods and variables used by spritely plugin
        instances: {},
        animate: function(options) {
            var el = jQuery(options.el);
            var el_id = el.attr('id');
            if (!jQuery._spritely.instances[el_id]) {
                return this;
            }
            options = jQuery.extend(options, jQuery._spritely.instances[el_id] || {});
            if (options.type == 'sprite' && options.fps) {
                if (options.play_frames && !jQuery._spritely.instances[el_id]['remaining_frames']) {
                    jQuery._spritely.instances[el_id]['remaining_frames'] = options.play_frames + 1;
                } else if (options.do_once && !jQuery._spritely.instances[el_id]['remaining_frames']) {
                    jQuery._spritely.instances[el_id]['remaining_frames'] = options.no_of_frames;
                }
                var frames;
                var animate = function(el) {
                    var w = options.width, h = options.height;
                    if (!frames) {
                        frames = [];
                        total = 0
                        for (var i = 0; i < options.no_of_frames; i ++) {
                            frames[frames.length] = (0 - total);
                            total += w;
                        }
                    }
                    if (jQuery._spritely.instances[el_id]['current_frame'] == 0) {
                        if (options.on_first_frame) {
                            options.on_first_frame(el);
                        }
                    } else if (jQuery._spritely.instances[el_id]['current_frame'] == frames.length - 1) {
                        if (options.on_last_frame) {
                            options.on_last_frame(el);
                        }
                    }
                    if (options.on_frame && options.on_frame[jQuery._spritely.instances[el_id]['current_frame']]) {
                        options.on_frame[jQuery._spritely.instances[el_id]['current_frame']](el);
                    }
                    if (options.rewind == true) {
                        if (jQuery._spritely.instances[el_id]['current_frame'] <= 0) {
                            jQuery._spritely.instances[el_id]['current_frame'] = frames.length - 1;
                        } else {
                            jQuery._spritely.instances[el_id]['current_frame'] = jQuery._spritely.instances[el_id]['current_frame'] - 1;
                        };
                    } else {
                        if (jQuery._spritely.instances[el_id]['current_frame'] >= frames.length - 1) {
                            jQuery._spritely.instances[el_id]['current_frame'] = 0;
                        } else {
                            jQuery._spritely.instances[el_id]['current_frame'] = jQuery._spritely.instances[el_id]['current_frame'] + 1;
                        }
                    }

                    var yPos = jQuery._spritely.getBgY(el);
                    el.css('background-position', frames[jQuery._spritely.instances[el_id]['current_frame']] + 'px ' + yPos);
                    if (options.bounce && options.bounce[0] > 0 && options.bounce[1] > 0) {
                        var ud = options.bounce[0]; // up-down
                        var lr = options.bounce[1]; // left-right
                        var ms = options.bounce[2]; // milliseconds
                        el
                            .animate({top: '+=' + ud + 'px', left: '-=' + lr + 'px'}, ms)
                            .animate({top: '-=' + ud + 'px', left: '+=' + lr + 'px'}, ms);
                    }
                }
                if (jQuery._spritely.instances[el_id]['remaining_frames'] && jQuery._spritely.instances[el_id]['remaining_frames'] > 0) {
                    jQuery._spritely.instances[el_id]['remaining_frames'] --;
                    if (jQuery._spritely.instances[el_id]['remaining_frames'] == 0) {
                        jQuery._spritely.instances[el_id]['remaining_frames'] = -1;
                        delete jQuery._spritely.instances[el_id]['remaining_frames'];
                        return this;
                    } else {
                        animate(el);
                    }
                } else if (jQuery._spritely.instances[el_id]['remaining_frames'] != -1) {
                    animate(el);
                }
            } else if (options.type == 'pan') {
                if (!jQuery._spritely.instances[el_id]['_stopped']) {

                    // As we pan, reduce the offset to the smallest possible
                    // value to ease the load on the browser. This step is
                    // skipped if the image hasn't loaded yet.
                    var speed = options.speed || 1,
                        start_x = jQuery._spritely.instances[el_id]['l'] || parseInt(jQuery._spritely.getBgX(el).replace('px', ''), 10) || 0,
                        start_y = jQuery._spritely.instances[el_id]['t'] || parseInt(jQuery._spritely.getBgY(el).replace('px', ''), 10) || 0;

                    if (options.do_once && !jQuery._spritely.instances[el_id].remaining_frames || jQuery._spritely.instances[el_id].remaining_frames <= 0) {
                        switch(options.dir) {
                            case 'up':
                            case 'down':
                                jQuery._spritely.instances[el_id].remaining_frames = Math.floor((options.img_height || 0) / speed);
                                break;
                            case 'left':
                            case 'right':
                                jQuery._spritely.instances[el_id].remaining_frames = Math.floor((options.img_width || 0) / speed);
                                break;
                        }
                        jQuery._spritely.instances[el_id].remaining_frames++;
                    } else if (options.do_once) {
                        jQuery._spritely.instances[el_id].remaining_frames--;
                    }

                    switch (options.dir) {

                        case 'up':
                            speed *= -1;
                        case 'down':
                            if (!jQuery._spritely.instances[el_id]['l'])
                                jQuery._spritely.instances[el_id]['l'] = start_x;
                            jQuery._spritely.instances[el_id]['t'] = start_y + speed;
                            if (options.img_height)
                                jQuery._spritely.instances[el_id]['t'] %= options.img_height;
                            break;

                        case 'left':
                            speed *= -1;
                        case 'right':
                            if (!jQuery._spritely.instances[el_id]['t'])
                                jQuery._spritely.instances[el_id]['t'] = start_y;
                            jQuery._spritely.instances[el_id]['l'] = start_x + speed;
                            if (options.img_width)
                                jQuery._spritely.instances[el_id]['l'] %= options.img_width;
                            break;

                    }

                    // When assembling the background-position string, care must be taken
                    // to ensure correct formatting.
                    var bg_left = jQuery._spritely.instances[el_id]['l'].toString();
                    if (bg_left.indexOf('%') == -1) {
                        bg_left += 'px ';
                    } else {
                        bg_left += ' ';
                    }

                    var bg_top = jQuery._spritely.instances[el_id]['t'].toString();
                    if (bg_top.indexOf('%') == -1) {
                        bg_top += 'px ';
                    } else {
                        bg_top += ' ';
                    }

                    jQuery(el).css('background-position', bg_left + bg_top);

                    if (options.do_once && !jQuery._spritely.instances[el_id].remaining_frames) {
                        return this;
                    }
                }
            }
            jQuery._spritely.instances[el_id]['options'] = options;
            jQuery._spritely.instances[el_id]['timeout'] = window.setTimeout(function() {
                jQuery._spritely.animate(options);
            }, parseInt(1000 / options.fps));
        },
        randomIntBetween: function(lower, higher) {
            return parseInt(rand_no = Math.floor((higher - (lower - 1)) * Math.random()) + lower);
        },
        getBgUseXY: (function() {
            try {
                return typeof jQuery('body').css('background-position-x') == 'string';
            } catch(e) {
                return false;
            }
        })(),
        getBgY: function(el) {
            if (jQuery._spritely.getBgUseXY) {
                return jQuery(el).css('background-position-y') || '0';
            } else {
                return (jQuery(el).css('background-position') || ' ').split(' ')[1];
            }
        },
        getBgX: function(el) {
            if (jQuery._spritely.getBgUseXY) {
                return jQuery(el).css('background-position-x') || '0';
            } else {
                return (jQuery(el).css('background-position') || ' ').split(' ')[0];
            }
        },
        get_rel_pos: function(pos, w) {
            // return the position of an item relative to a background
            // image of width given by w
            var r = pos;
            if (pos < 0) {
                while (r < 0) {
                    r += w;
                }
            } else {
                while (r > w) {
                    r -= w;
                }
            }
            return r;
        },

        _spStrip: function(s, chars) {
            // Strip any character in 'chars' from the beginning or end of
            // 'str'. Like Python's .strip() method, or jQuery's jQuery.trim()
            // function (but allowing you to specify the characters).
            while (s.length) {
                var i, sr, nos = false, noe = false;
                for (i=0;i<chars.length;i++) {
                    var ss = s.slice(0, 1);
                    sr = s.slice(1);
                    if (chars.indexOf(ss) > -1)
                        s = sr;
                    else
                        nos = true;
                }
                for (i=0;i<chars.length;i++) {
                    var se = s.slice(-1);
                    sr = s.slice(0, -1);
                    if (chars.indexOf(se) > -1)
                        s = sr;
                    else
                        noe = true;
                }
                if (nos && noe)
                    return s;
            }
            return '';
        }
    };
    jQuery.fn.extend({

        spritely: function(options) {

            var jQuerythis = jQuery(this),
                el_id = jQuerythis.attr('id'),
                
                options = jQuery.extend({
                    type: 'sprite',
                    do_once: false,
                    width: null,
                    height: null,
                    img_width: 0,
                    img_height: 0,
                    fps: 12,
                    no_of_frames: 2,
                    play_frames: 0
                }, options || {}),

                background_image = (new Image()),
                background_image_src = jQuery._spritely._spStrip(jQuerythis.css('background-image') || '', 'url("); ');

                if (!jQuery._spritely.instances[el_id]) {
                    if (options.start_at_frame) {
                        jQuery._spritely.instances[el_id] = {current_frame: options.start_at_frame - 1};
                    } else {
                        jQuery._spritely.instances[el_id] = {current_frame: -1};
                    }
                }

                jQuery._spritely.instances[el_id]['type'] = options.type;
                jQuery._spritely.instances[el_id]['depth'] = options.depth;

                options.el = jQuerythis;
                options.width = options.width || jQuerythis.width() || 100;
                options.height = options.height || jQuerythis.height() || 100;

            background_image.onload = function() {

                options.img_width = background_image.width;
                options.img_height = background_image.height;

                options.img = background_image;
                var get_rate = function() {
                    return parseInt(1000 / options.fps);
                }

                if (!options.do_once) {
                    setTimeout(function() {
                        jQuery._spritely.animate(options);
                    }, get_rate(options.fps));
                } else {
                    setTimeout(function() {
                        jQuery._spritely.animate(options);
                    }, 0);
                }

            }

            background_image.src = background_image_src;

            return this;

        },

        sprite: function(options) {
            var options = jQuery.extend({
                type: 'sprite',
                bounce: [0, 0, 1000] // up-down, left-right, milliseconds
            }, options || {});
            return jQuery(this).spritely(options);
        },
        pan: function(options) {
            var options = jQuery.extend({
                type: 'pan',
                dir: 'left',
                continuous: true,
                speed: 1 // 1 pixel per frame
            }, options || {});
            return jQuery(this).spritely(options);
        },
        flyToTap: function(options) {
            var options = jQuery.extend({
                el_to_move: null,
                type: 'moveToTap',
                ms: 1000, // milliseconds
                do_once: true
            }, options || {});
            if (options.el_to_move) {
                jQuery(options.el_to_move).active();
            }
            if (jQuery._spritely.activeSprite) {
                if (window.Touch) { // iphone method see http://cubiq.org/remove-onclick-delay-on-webkit-for-iphone/9 or http://www.nimblekit.com/tutorials.html for clues...
                    jQuery(this)[0].ontouchstart = function(e) {
                        var el_to_move = jQuery._spritely.activeSprite;
                        var touch = e.touches[0];
                        var t = touch.pageY - (el_to_move.height() / 2);
                        var l = touch.pageX - (el_to_move.width() / 2);
                        el_to_move.animate({
                            top: t + 'px',
                            left: l + 'px'
                        }, 1000);
                    };
                } else {
                    jQuery(this).click(function(e) {
                        var el_to_move = jQuery._spritely.activeSprite;
                        jQuery(el_to_move).stop(true);
                        var w = el_to_move.width();
                        var h = el_to_move.height();
                        var l = e.pageX - (w / 2);
                        var t = e.pageY - (h / 2);
                        el_to_move.animate({
                            top: t + 'px',
                            left: l + 'px'
                        }, 1000);
                    });
                }
            }
            return this;
        },
        // isDraggable requires jQuery ui
        isDraggable: function(options) {
            if ((!jQuery(this).draggable)) {
                //console.log('To use the isDraggable method you need to load jquery-ui.js');
                return this;
            }
            var options = jQuery.extend({
                type: 'isDraggable',
                start: null,
                stop: null,
                drag: null
            }, options || {});
            var el_id = jQuery(this).attr('id');
            if (!jQuery._spritely.instances[el_id]) {
                return this;
            }
            jQuery._spritely.instances[el_id].isDraggableOptions = options;
            jQuery(this).draggable({
                start: function() {
                    var el_id = jQuery(this).attr('id');
                    jQuery._spritely.instances[el_id].stop_random = true;
                    jQuery(this).stop(true);
                    if (jQuery._spritely.instances[el_id].isDraggableOptions.start) {
                        jQuery._spritely.instances[el_id].isDraggableOptions.start(this);
                    }
                },
                drag: options.drag,
                stop: function() {
                    var el_id = jQuery(this).attr('id');
                    jQuery._spritely.instances[el_id].stop_random = false;
                    if (jQuery._spritely.instances[el_id].isDraggableOptions.stop) {
                        jQuery._spritely.instances[el_id].isDraggableOptions.stop(this);
                    }
                }
            });
            return this;
        },
        active: function() {
            // the active sprite
            jQuery._spritely.activeSprite = this;
            return this;
        },
        activeOnClick: function() {
            // make this the active script if clicked...
            var el = jQuery(this);
            if (window.Touch) { // iphone method see http://cubiq.org/remove-onclick-delay-on-webkit-for-iphone/9 or http://www.nimblekit.com/tutorials.html for clues...
                el[0].ontouchstart = function(e) {
                    jQuery._spritely.activeSprite = el;
                };
            } else {
                el.click(function(e) {
                    jQuery._spritely.activeSprite = el;
                });
            }
            return this;
        },
        spRandom: function(options) {
            var options = jQuery.extend({
                top: 50,
                left: 50,
                right: 290,
                bottom: 320,
                speed: 4000,
                pause: 0
            }, options || {});
            var el_id = jQuery(this).attr('id');
            if (!jQuery._spritely.instances[el_id]) {
                return this;
            }
            if (!jQuery._spritely.instances[el_id].stop_random) {
                var r = jQuery._spritely.randomIntBetween;
                var t = r(options.top, options.bottom);
                var l = r(options.left, options.right);
                jQuery('#' + el_id).animate({
                    top: t + 'px',
                    left: l + 'px'
                }, options.speed)
            }
            window.setTimeout(function() {
                jQuery('#' + el_id).spRandom(options);
            }, options.speed + options.pause)
            return this;
        },
        makeAbsolute: function() {
            // remove an element from its current position in the DOM and
            // position it absolutely, appended to the body tag.
            return this.each(function() {
                var el = jQuery(this);
                var pos = el.position();
                el.css({position: "absolute", marginLeft: 0, marginTop: 0, top: pos.top, left: pos.left })
                    .remove()
                    .appendTo("body");
            });

        },
        spSet: function(prop_name, prop_value) {
            var el_id = jQuery(this).attr('id');
            jQuery._spritely.instances[el_id][prop_name] = prop_value;
            return this;
        },
        spGet: function(prop_name, prop_value) {
            var el_id = jQuery(this).attr('id');
            return jQuery._spritely.instances[el_id][prop_name];
        },
        spStop: function(bool) {
            this.each(function() {
                var jQuerythis = jQuery(this),
                    el_id = jQuerythis.attr('id');
                if (jQuery._spritely.instances[el_id]['options']['fps']) {
                    jQuery._spritely.instances[el_id]['_last_fps'] = jQuery._spritely.instances[el_id]['options']['fps'];
                }
                if (jQuery._spritely.instances[el_id]['type'] == 'sprite') {
                    jQuerythis.spSet('fps', 0);
                }
                jQuery._spritely.instances[el_id]['_stopped'] = true;
                jQuery._spritely.instances[el_id]['_stopped_f1'] = bool;
                if (bool) {
                    // set background image position to 0
                    var bp_top = jQuery._spritely.getBgY(jQuery(this));
                    jQuerythis.css('background-position', '0 ' + bp_top);
                }
            });
            return this;
        },
        spStart: function() {
            jQuery(this).each(function() {
                var el_id = jQuery(this).attr('id');
                var fps = jQuery._spritely.instances[el_id]['_last_fps'] || 12;
                if (jQuery._spritely.instances[el_id]['type'] == 'sprite') {
                    jQuery(this).spSet('fps', fps);
                }
                jQuery._spritely.instances[el_id]['_stopped'] = false;
            });
            return this;
        },
        spToggle: function() {
            var el_id = jQuery(this).attr('id');
            var stopped = jQuery._spritely.instances[el_id]['_stopped'] || false;
            var stopped_f1 = jQuery._spritely.instances[el_id]['_stopped_f1'] || false;
            if (stopped) {
                jQuery(this).spStart();
            } else {
                jQuery(this).spStop(stopped_f1);
            }
            return this;
        },
        fps: function(fps) {
            jQuery(this).each(function() {
                jQuery(this).spSet('fps', fps);
            });
            return this;
        },
        goToFrame: function(n) {
            var el_id = jQuery(this).attr('id');
            if (jQuery._spritely.instances && jQuery._spritely.instances[el_id]) {
                jQuery._spritely.instances[el_id]['current_frame'] = n - 1;
            }
            return this;
        },
        spSpeed: function(speed) {
            jQuery(this).each(function() {
                jQuery(this).spSet('speed', speed);
            });
            return this;
        },
        spRelSpeed: function(speed) {
            jQuery(this).each(function() {
                var rel_depth = jQuery(this).spGet('depth') / 100;
                jQuery(this).spSet('speed', speed * rel_depth);
            });
            return this;
        },
        spChangeDir: function(dir) {
            jQuery(this).each(function() {
                jQuery(this).spSet('dir', dir);
            });
            return this;
        },
        spState: function(n) {
            jQuery(this).each(function() {
                // change state of a sprite, where state is the vertical
                // position of the background image (e.g. frames row)
                var yPos = ((n - 1) * jQuery(this).height()) + 'px';
                var xPos = jQuery._spritely.getBgX(jQuery(this));
                var bp = xPos + ' -' + yPos;
                jQuery(this).css('background-position', bp);
            });
            return this;
        },
        lockTo: function(el, options) {
            jQuery(this).each(function() {
                var el_id = jQuery(this).attr('id');
                if (!jQuery._spritely.instances[el_id]) {
                    return this;
                }
                jQuery._spritely.instances[el_id]['locked_el'] = jQuery(this);
                jQuery._spritely.instances[el_id]['lock_to'] = jQuery(el);
                jQuery._spritely.instances[el_id]['lock_to_options'] = options;
                jQuery._spritely.instances[el_id]['interval'] = window.setInterval(function() {
                    if (jQuery._spritely.instances[el_id]['lock_to']) {
                        var locked_el = jQuery._spritely.instances[el_id]['locked_el'];
                        var locked_to_el = jQuery._spritely.instances[el_id]['lock_to'];
                        var locked_to_options = jQuery._spritely.instances[el_id]['lock_to_options'];
                        var locked_to_el_w = locked_to_options.bg_img_width;
                        var locked_to_el_h = locked_to_el.height();
                        var locked_to_el_y = jQuery._spritely.getBgY(locked_to_el);
                        var locked_to_el_x = jQuery._spritely.getBgX(locked_to_el);
                        var el_l = (parseInt(locked_to_el_x) + parseInt(locked_to_options['left']));
                        var el_t = (parseInt(locked_to_el_y) + parseInt(locked_to_options['top']));
                        el_l = jQuery._spritely.get_rel_pos(el_l, locked_to_el_w);
                        jQuery(locked_el).css({
                            'top': el_t + 'px',
                            'left': el_l + 'px'
                        });
                    }
                }, options.interval || 20);
            });
            return this;
        },
        destroy: function() {
            var el = jQuery(this);
            var el_id = jQuery(this).attr('id');
            if (jQuery._spritely.instances[el_id] && jQuery._spritely.instances[el_id]['timeout']){
                window.clearTimeout(jQuery._spritely.instances[el_id]['timeout']);
            }
            if (jQuery._spritely.instances[el_id] && jQuery._spritely.instances[el_id]['interval']) {
                window.clearInterval(jQuery._spritely.instances[el_id]['interval']);
            }
            delete jQuery._spritely.instances[el_id]
            return this;
        }
    })
})(jQuery);
// Stop IE6 re-loading background images continuously
try {
  document.execCommand("BackgroundImageCache", false, true);
} catch(err) {} 
