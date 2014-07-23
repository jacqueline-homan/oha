//admin-bar.js

/* jshint loopfunc: true */
// use jQuery and hoverIntent if loaded
if ( typeof(jQuery) != 'undefined' ) {
    if ( typeof(jQuery.fn.hoverIntent) == 'undefined' ) {
        /* jshint ignore:start */
        // hoverIntent r6 - Copy of wp-includes/js/hoverIntent.min.js
        (function(a){a.fn.hoverIntent=function(m,d,h){var j={interval:100,sensitivity:7,timeout:0};if(typeof m==="object"){j=a.extend(j,m)}else{if(a.isFunction(d)){j=a.extend(j,{over:m,out:d,selector:h})}else{j=a.extend(j,{over:m,out:m,selector:d})}}var l,k,g,f;var e=function(n){l=n.pageX;k=n.pageY};var c=function(o,n){n.hoverIntent_t=clearTimeout(n.hoverIntent_t);if((Math.abs(g-l)+Math.abs(f-k))<j.sensitivity){a(n).off("mousemove.hoverIntent",e);n.hoverIntent_s=1;return j.over.apply(n,[o])}else{g=l;f=k;n.hoverIntent_t=setTimeout(function(){c(o,n)},j.interval)}};var i=function(o,n){n.hoverIntent_t=clearTimeout(n.hoverIntent_t);n.hoverIntent_s=0;return j.out.apply(n,[o])};var b=function(p){var o=jQuery.extend({},p);var n=this;if(n.hoverIntent_t){n.hoverIntent_t=clearTimeout(n.hoverIntent_t)}if(p.type=="mouseenter"){g=o.pageX;f=o.pageY;a(n).on("mousemove.hoverIntent",e);if(n.hoverIntent_s!=1){n.hoverIntent_t=setTimeout(function(){c(o,n)},j.interval)}}else{a(n).off("mousemove.hoverIntent",e);if(n.hoverIntent_s==1){n.hoverIntent_t=setTimeout(function(){i(o,n)},j.timeout)}}};return this.on({"mouseenter.hoverIntent":b,"mouseleave.hoverIntent":b},j.selector)}})(jQuery);
        /* jshint ignore:end */
    }
    jQuery(document).ready(function($){
        var adminbar = $('#wpadminbar'), refresh, touchOpen, touchClose, disableHoverIntent = false;

        refresh = function(i, el){ // force the browser to refresh the tabbing index
            var node = $(el), tab = node.attr('tabindex');
            if ( tab )
                node.attr('tabindex', '0').attr('tabindex', tab);
        };

        touchOpen = function(unbind) {
            adminbar.find('li.menupop').on('click.wp-mobile-hover', function(e) {
                var el = $(this);

                if ( el.parent().is('#wp-admin-bar-root-default') && !el.hasClass('hover') ) {
                    e.preventDefault();
                    adminbar.find('li.menupop.hover').removeClass('hover');
                    el.addClass('hover');
                } else if ( !el.hasClass('hover') ) {
                    e.stopPropagation();
                    e.preventDefault();
                    el.addClass('hover');
                }

                if ( unbind ) {
                    $('li.menupop').off('click.wp-mobile-hover');
                    disableHoverIntent = false;
                }
            });
        };

        touchClose = function() {
            var mobileEvent = /Mobile\/.+Safari/.test(navigator.userAgent) ? 'touchstart' : 'click';
            // close any open drop-downs when the click/touch is not on the toolbar
            $(document.body).on( mobileEvent+'.wp-mobile-hover', function(e) {
                if ( !$(e.target).closest('#wpadminbar').length )
                    adminbar.find('li.menupop.hover').removeClass('hover');
            });
        };

        adminbar.removeClass('nojq').removeClass('nojs');

        if ( 'ontouchstart' in window ) {
            adminbar.on('touchstart', function(){
                touchOpen(true);
                disableHoverIntent = true;
            });
            touchClose();
        } else if ( /IEMobile\/[1-9]/.test(navigator.userAgent) ) {
            touchOpen();
            touchClose();
        }

        adminbar.find('li.menupop').hoverIntent({
            over: function() {
                if ( disableHoverIntent )
                    return;

                $(this).addClass('hover');
            },
            out: function() {
                if ( disableHoverIntent )
                    return;

                $(this).removeClass('hover');
            },
            timeout: 180,
            sensitivity: 7,
            interval: 100
        });

        if ( window.location.hash )
            window.scrollBy( 0, -32 );

        $('#wp-admin-bar-get-shortlink').click(function(e){
            e.preventDefault();
            $(this).addClass('selected').children('.shortlink-input').blur(function(){
                $(this).parents('#wp-admin-bar-get-shortlink').removeClass('selected');
            }).focus().select();
        });

        $('#wpadminbar li.menupop > .ab-item').bind('keydown.adminbar', function(e){
            if ( e.which != 13 )
                return;

            var target = $(e.target), wrap = target.closest('ab-sub-wrapper');

            e.stopPropagation();
            e.preventDefault();

            if ( !wrap.length )
                wrap = $('#wpadminbar .quicklinks');

            wrap.find('.menupop').removeClass('hover');
            target.parent().toggleClass('hover');
            target.siblings('.ab-sub-wrapper').find('.ab-item').each(refresh);
        }).each(refresh);

        $('#wpadminbar .ab-item').bind('keydown.adminbar', function(e){
            if ( e.which != 27 )
                return;

            var target = $(e.target);

            e.stopPropagation();
            e.preventDefault();

            target.closest('.hover').removeClass('hover').children('.ab-item').focus();
            target.siblings('.ab-sub-wrapper').find('.ab-item').each(refresh);
        });

        $('#wpadminbar').click( function(e) {
            if ( e.target.id != 'wpadminbar' && e.target.id != 'wp-admin-bar-top-secondary' )
                return;

            e.preventDefault();
            $('html, body').animate({ scrollTop: 0 }, 'fast');
        });

        // fix focus bug in WebKit
        $('.screen-reader-shortcut').keydown( function(e) {
            var id, ua;

            if ( 13 != e.which )
                return;

            id = $( this ).attr( 'href' );

            ua = navigator.userAgent.toLowerCase();

            if ( ua.indexOf('applewebkit') != -1 && id && id.charAt(0) == '#' ) {
                setTimeout(function () {
                    $(id).focus();
                }, 100);
            }
        });

        // Empty sessionStorage on logging out
        if ( 'sessionStorage' in window ) {
            $('#wp-admin-bar-logout a').click( function() {
                try {
                    for ( var key in sessionStorage ) {
                        if ( key.indexOf('wp-autosave-') != -1 )
                            sessionStorage.removeItem(key);
                    }
                } catch(e) {}
            });
        }

        if ( navigator.userAgent && document.body.className.indexOf( 'no-font-face' ) === -1 &&
            /Android (1.0|1.1|1.5|1.6|2.0|2.1)|Nokia|Opera Mini|w(eb)?OSBrowser|webOS|UCWEB|Windows Phone OS 7|XBLWP7|ZuneWP7|MSIE 7/.test( navigator.userAgent ) ) {

            document.body.className += ' no-font-face';
        }
    });
} else {
    (function(d, w) {
        var addEvent = function( obj, type, fn ) {
                if ( obj.addEventListener )
                    obj.addEventListener(type, fn, false);
                else if ( obj.attachEvent )
                    obj.attachEvent('on' + type, function() { return fn.call(obj, window.event);});
            },

            aB, hc = new RegExp('\\bhover\\b', 'g'), q = [],
            rselected = new RegExp('\\bselected\\b', 'g'),

            /**
             * Get the timeout ID of the given element
             */
            getTOID = function(el) {
                var i = q.length;
                while ( i-- ) {
                    if ( q[i] && el == q[i][1] )
                        return q[i][0];
                }
                return false;
            },

            addHoverClass = function(t) {
                var i, id, inA, hovering, ul, li,
                    ancestors = [],
                    ancestorLength = 0;

                while ( t && t != aB && t != d ) {
                    if ( 'LI' == t.nodeName.toUpperCase() ) {
                        ancestors[ ancestors.length ] = t;
                        id = getTOID(t);
                        if ( id )
                            clearTimeout( id );
                        t.className = t.className ? ( t.className.replace(hc, '') + ' hover' ) : 'hover';
                        hovering = t;
                    }
                    t = t.parentNode;
                }

                // Remove any selected classes.
                if ( hovering && hovering.parentNode ) {
                    ul = hovering.parentNode;
                    if ( ul && 'UL' == ul.nodeName.toUpperCase() ) {
                        i = ul.childNodes.length;
                        while ( i-- ) {
                            li = ul.childNodes[i];
                            if ( li != hovering )
                                li.className = li.className ? li.className.replace( rselected, '' ) : '';
                        }
                    }
                }

                /* remove the hover class for any objects not in the immediate element's ancestry */
                i = q.length;
                while ( i-- ) {
                    inA = false;
                    ancestorLength = ancestors.length;
                    while( ancestorLength-- ) {
                        if ( ancestors[ ancestorLength ] == q[i][1] )
                            inA = true;
                    }

                    if ( ! inA )
                        q[i][1].className = q[i][1].className ? q[i][1].className.replace(hc, '') : '';
                }
            },

            removeHoverClass = function(t) {
                while ( t && t != aB && t != d ) {
                    if ( 'LI' == t.nodeName.toUpperCase() ) {
                        (function(t) {
                            var to = setTimeout(function() {
                                t.className = t.className ? t.className.replace(hc, '') : '';
                            }, 500);
                            q[q.length] = [to, t];
                        })(t);
                    }
                    t = t.parentNode;
                }
            },

            clickShortlink = function(e) {
                var i, l, node,
                    t = e.target || e.srcElement;

                // Make t the shortlink menu item, or return.
                while ( true ) {
                    // Check if we've gone past the shortlink node,
                    // or if the user is clicking on the input.
                    if ( ! t || t == d || t == aB )
                        return;
                    // Check if we've found the shortlink node.
                    if ( t.id && t.id == 'wp-admin-bar-get-shortlink' )
                        break;
                    t = t.parentNode;
                }

                // IE doesn't support preventDefault, and does support returnValue
                if ( e.preventDefault )
                    e.preventDefault();
                e.returnValue = false;

                if ( -1 == t.className.indexOf('selected') )
                    t.className += ' selected';

                for ( i = 0, l = t.childNodes.length; i < l; i++ ) {
                    node = t.childNodes[i];
                    if ( node.className && -1 != node.className.indexOf('shortlink-input') ) {
                        node.focus();
                        node.select();
                        node.onblur = function() {
                            t.className = t.className ? t.className.replace( rselected, '' ) : '';
                        };
                        break;
                    }
                }
                return false;
            },

            scrollToTop = function(t) {
                var distance, speed, step, steps, timer, speed_step;

                // Ensure that the #wpadminbar was the target of the click.
                if ( t.id != 'wpadminbar' && t.id != 'wp-admin-bar-top-secondary' )
                    return;

                distance    = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

                if ( distance < 1 )
                    return;

                speed_step = distance > 800 ? 130 : 100;
                speed     = Math.min( 12, Math.round( distance / speed_step ) );
                step      = distance > 800 ? Math.round( distance / 30  ) : Math.round( distance / 20  );
                steps     = [];
                timer     = 0;

                // Animate scrolling to the top of the page by generating steps to
                // the top of the page and shifting to each step at a set interval.
                while ( distance ) {
                    distance -= step;
                    if ( distance < 0 )
                        distance = 0;
                    steps.push( distance );

                    setTimeout( function() {
                        window.scrollTo( 0, steps.shift() );
                    }, timer * speed );

                    timer++;
                }
            };

        addEvent(w, 'load', function() {
            aB = d.getElementById('wpadminbar');

            if ( d.body && aB ) {
                d.body.appendChild( aB );

                if ( aB.className )
                    aB.className = aB.className.replace(/nojs/, '');

                addEvent(aB, 'mouseover', function(e) {
                    addHoverClass( e.target || e.srcElement );
                });

                addEvent(aB, 'mouseout', function(e) {
                    removeHoverClass( e.target || e.srcElement );
                });

                addEvent(aB, 'click', clickShortlink );

                addEvent(aB, 'click', function(e) {
                    scrollToTop( e.target || e.srcElement );
                });

                addEvent( document.getElementById('wp-admin-bar-logout'), 'click', function() {
                    if ( 'sessionStorage' in window ) {
                        try {
                            for ( var key in sessionStorage ) {
                                if ( key.indexOf('wp-autosave-') != -1 )
                                    sessionStorage.removeItem(key);
                            }
                        } catch(e) {}
                    }
                });
            }

            if ( w.location.hash )
                w.scrollBy(0,-32);

            if ( navigator.userAgent && document.body.className.indexOf( 'no-font-face' ) === -1 &&
                /Android (1.0|1.1|1.5|1.6|2.0|2.1)|Nokia|Opera Mini|w(eb)?OSBrowser|webOS|UCWEB|Windows Phone OS 7|XBLWP7|ZuneWP7|MSIE 7/.test( navigator.userAgent ) ) {

                document.body.className += ' no-font-face';
            }
        });
    })(document, window);

}

//admin-bar.min.js

"undefined"!=typeof jQuery?("undefined"==typeof jQuery.fn.hoverIntent&&!function(a){a.fn.hoverIntent=function(b,c,d){var e={interval:100,sensitivity:7,timeout:0};e="object"==typeof b?a.extend(e,b):a.isFunction(c)?a.extend(e,{over:b,out:c,selector:d}):a.extend(e,{over:b,out:b,selector:c});var f,g,h,i,j=function(a){f=a.pageX,g=a.pageY},k=function(b,c){return c.hoverIntent_t=clearTimeout(c.hoverIntent_t),Math.abs(h-f)+Math.abs(i-g)<e.sensitivity?(a(c).off("mousemove.hoverIntent",j),c.hoverIntent_s=1,e.over.apply(c,[b])):(h=f,i=g,c.hoverIntent_t=setTimeout(function(){k(b,c)},e.interval),void 0)},l=function(a,b){return b.hoverIntent_t=clearTimeout(b.hoverIntent_t),b.hoverIntent_s=0,e.out.apply(b,[a])},m=function(b){var c=jQuery.extend({},b),d=this;d.hoverIntent_t&&(d.hoverIntent_t=clearTimeout(d.hoverIntent_t)),"mouseenter"==b.type?(h=c.pageX,i=c.pageY,a(d).on("mousemove.hoverIntent",j),1!=d.hoverIntent_s&&(d.hoverIntent_t=setTimeout(function(){k(c,d)},e.interval))):(a(d).off("mousemove.hoverIntent",j),1==d.hoverIntent_s&&(d.hoverIntent_t=setTimeout(function(){l(c,d)},e.timeout)))};return this.on({"mouseenter.hoverIntent":m,"mouseleave.hoverIntent":m},e.selector)}}(jQuery),jQuery(document).ready(function(a){var b,c,d,e=a("#wpadminbar"),f=!1;b=function(b,c){var d=a(c),e=d.attr("tabindex");e&&d.attr("tabindex","0").attr("tabindex",e)},c=function(b){e.find("li.menupop").on("click.wp-mobile-hover",function(c){var d=a(this);d.parent().is("#wp-admin-bar-root-default")&&!d.hasClass("hover")?(c.preventDefault(),e.find("li.menupop.hover").removeClass("hover"),d.addClass("hover")):d.hasClass("hover")||(c.stopPropagation(),c.preventDefault(),d.addClass("hover")),b&&(a("li.menupop").off("click.wp-mobile-hover"),f=!1)})},d=function(){var b=/Mobile\/.+Safari/.test(navigator.userAgent)?"touchstart":"click";a(document.body).on(b+".wp-mobile-hover",function(b){a(b.target).closest("#wpadminbar").length||e.find("li.menupop.hover").removeClass("hover")})},e.removeClass("nojq").removeClass("nojs"),"ontouchstart"in window?(e.on("touchstart",function(){c(!0),f=!0}),d()):/IEMobile\/[1-9]/.test(navigator.userAgent)&&(c(),d()),e.find("li.menupop").hoverIntent({over:function(){f||a(this).addClass("hover")},out:function(){f||a(this).removeClass("hover")},timeout:180,sensitivity:7,interval:100}),window.location.hash&&window.scrollBy(0,-32),a("#wp-admin-bar-get-shortlink").click(function(b){b.preventDefault(),a(this).addClass("selected").children(".shortlink-input").blur(function(){a(this).parents("#wp-admin-bar-get-shortlink").removeClass("selected")}).focus().select()}),a("#wpadminbar li.menupop > .ab-item").bind("keydown.adminbar",function(c){if(13==c.which){var d=a(c.target),e=d.closest("ab-sub-wrapper");c.stopPropagation(),c.preventDefault(),e.length||(e=a("#wpadminbar .quicklinks")),e.find(".menupop").removeClass("hover"),d.parent().toggleClass("hover"),d.siblings(".ab-sub-wrapper").find(".ab-item").each(b)}}).each(b),a("#wpadminbar .ab-item").bind("keydown.adminbar",function(c){if(27==c.which){var d=a(c.target);c.stopPropagation(),c.preventDefault(),d.closest(".hover").removeClass("hover").children(".ab-item").focus(),d.siblings(".ab-sub-wrapper").find(".ab-item").each(b)}}),a("#wpadminbar").click(function(b){("wpadminbar"==b.target.id||"wp-admin-bar-top-secondary"==b.target.id)&&(b.preventDefault(),a("html, body").animate({scrollTop:0},"fast"))}),a(".screen-reader-shortcut").keydown(function(b){var c,d;13==b.which&&(c=a(this).attr("href"),d=navigator.userAgent.toLowerCase(),-1!=d.indexOf("applewebkit")&&c&&"#"==c.charAt(0)&&setTimeout(function(){a(c).focus()},100))}),"sessionStorage"in window&&a("#wp-admin-bar-logout a").click(function(){try{for(var a in sessionStorage)-1!=a.indexOf("wp-autosave-")&&sessionStorage.removeItem(a)}catch(b){}}),navigator.userAgent&&-1===document.body.className.indexOf("no-font-face")&&/Android (1.0|1.1|1.5|1.6|2.0|2.1)|Nokia|Opera Mini|w(eb)?OSBrowser|webOS|UCWEB|Windows Phone OS 7|XBLWP7|ZuneWP7|MSIE 7/.test(navigator.userAgent)&&(document.body.className+=" no-font-face")})):!function(a,b){var c,d=function(a,b,c){a.addEventListener?a.addEventListener(b,c,!1):a.attachEvent&&a.attachEvent("on"+b,function(){return c.call(a,window.event)})},e=new RegExp("\\bhover\\b","g"),f=[],g=new RegExp("\\bselected\\b","g"),h=function(a){for(var b=f.length;b--;)if(f[b]&&a==f[b][1])return f[b][0];return!1},i=function(b){for(var d,i,j,k,l,m,n=[],o=0;b&&b!=c&&b!=a;)"LI"==b.nodeName.toUpperCase()&&(n[n.length]=b,i=h(b),i&&clearTimeout(i),b.className=b.className?b.className.replace(e,"")+" hover":"hover",k=b),b=b.parentNode;if(k&&k.parentNode&&(l=k.parentNode,l&&"UL"==l.nodeName.toUpperCase()))for(d=l.childNodes.length;d--;)m=l.childNodes[d],m!=k&&(m.className=m.className?m.className.replace(g,""):"");for(d=f.length;d--;){for(j=!1,o=n.length;o--;)n[o]==f[d][1]&&(j=!0);j||(f[d][1].className=f[d][1].className?f[d][1].className.replace(e,""):"")}},j=function(b){for(;b&&b!=c&&b!=a;)"LI"==b.nodeName.toUpperCase()&&!function(a){var b=setTimeout(function(){a.className=a.className?a.className.replace(e,""):""},500);f[f.length]=[b,a]}(b),b=b.parentNode},k=function(b){for(var d,e,f,h=b.target||b.srcElement;;){if(!h||h==a||h==c)return;if(h.id&&"wp-admin-bar-get-shortlink"==h.id)break;h=h.parentNode}for(b.preventDefault&&b.preventDefault(),b.returnValue=!1,-1==h.className.indexOf("selected")&&(h.className+=" selected"),d=0,e=h.childNodes.length;e>d;d++)if(f=h.childNodes[d],f.className&&-1!=f.className.indexOf("shortlink-input")){f.focus(),f.select(),f.onblur=function(){h.className=h.className?h.className.replace(g,""):""};break}return!1},l=function(a){var b,c,d,e,f,g;if(!("wpadminbar"!=a.id&&"wp-admin-bar-top-secondary"!=a.id||(b=window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop||0,1>b)))for(g=b>800?130:100,c=Math.min(12,Math.round(b/g)),d=Math.round(b>800?b/30:b/20),e=[],f=0;b;)b-=d,0>b&&(b=0),e.push(b),setTimeout(function(){window.scrollTo(0,e.shift())},f*c),f++};d(b,"load",function(){c=a.getElementById("wpadminbar"),a.body&&c&&(a.body.appendChild(c),c.className&&(c.className=c.className.replace(/nojs/,"")),d(c,"mouseover",function(a){i(a.target||a.srcElement)}),d(c,"mouseout",function(a){j(a.target||a.srcElement)}),d(c,"click",k),d(c,"click",function(a){l(a.target||a.srcElement)}),d(document.getElementById("wp-admin-bar-logout"),"click",function(){if("sessionStorage"in window)try{for(var a in sessionStorage)-1!=a.indexOf("wp-autosave-")&&sessionStorage.removeItem(a)}catch(b){}})),b.location.hash&&b.scrollBy(0,-32),navigator.userAgent&&-1===document.body.className.indexOf("no-font-face")&&/Android (1.0|1.1|1.5|1.6|2.0|2.1)|Nokia|Opera Mini|w(eb)?OSBrowser|webOS|UCWEB|Windows Phone OS 7|XBLWP7|ZuneWP7|MSIE 7/.test(navigator.userAgent)&&(document.body.className+=" no-font-face")})}(document,window);


//autosave.js
/* global tinymce, wpCookies, autosaveL10n, switchEditors */
// Back-compat
window.autosave = function() {
    return true;
};

( function( $, window ) {
    function autosave() {
        var initialCompareString,
            lastTriggerSave = 0,
            $document = $(document);

        /**
         * Returns the data saved in both local and remote autosave
         *
         * @return object Object containing the post data
         */
        function getPostData( type ) {
            var post_name, parent_id, data,
                time = ( new Date() ).getTime(),
                cats = [],
                editor = typeof tinymce !== 'undefined' && tinymce.get('content');

            // Don't run editor.save() more often than every 3 sec.
            // It is resource intensive and might slow down typing in long posts on slow devices.
            if ( editor && ! editor.isHidden() && time - 3000 > lastTriggerSave ) {
                editor.save();
                lastTriggerSave = time;
            }

            data = {
                post_id: $( '#post_ID' ).val() || 0,
                post_type: $( '#post_type' ).val() || '',
                post_author: $( '#post_author' ).val() || '',
                post_title: $( '#title' ).val() || '',
                content: $( '#content' ).val() || '',
                excerpt: $( '#excerpt' ).val() || ''
            };

            if ( type === 'local' ) {
                return data;
            }

            $( 'input[id^="in-category-"]:checked' ).each( function() {
                cats.push( this.value );
            });
            data.catslist = cats.join(',');

            if ( post_name = $( '#post_name' ).val() ) {
                data.post_name = post_name;
            }

            if ( parent_id = $( '#parent_id' ).val() ) {
                data.parent_id = parent_id;
            }

            if ( $( '#comment_status' ).prop( 'checked' ) ) {
                data.comment_status = 'open';
            }

            if ( $( '#ping_status' ).prop( 'checked' ) ) {
                data.ping_status = 'open';
            }

            if ( $( '#auto_draft' ).val() === '1' ) {
                data.auto_draft = '1';
            }

            return data;
        }

        // Concatenate title, content and excerpt. Used to track changes when auto-saving.
        function getCompareString( postData ) {
            if ( typeof postData === 'object' ) {
                return ( postData.post_title || '' ) + '::' + ( postData.content || '' ) + '::' + ( postData.excerpt || '' );
            }

            return ( $('#title').val() || '' ) + '::' + ( $('#content').val() || '' ) + '::' + ( $('#excerpt').val() || '' );
        }

        function disableButtons() {
            $document.trigger('autosave-disable-buttons');
            // Re-enable 5 sec later. Just gives autosave a head start to avoid collisions.
            setTimeout( enableButtons, 5000 );
        }

        function enableButtons() {
            $document.trigger( 'autosave-enable-buttons' );
        }

        // Autosave in localStorage
        function autosaveLocal() {
            var restorePostData, undoPostData, blog_id, post_id, hasStorage, intervalTimer,
                lastCompareString,
                isSuspended = false;

            // Check if the browser supports sessionStorage and it's not disabled
            function checkStorage() {
                var test = Math.random().toString(),
                    result = false;

                try {
                    window.sessionStorage.setItem( 'wp-test', test );
                    result = window.sessionStorage.getItem( 'wp-test' ) === test;
                    window.sessionStorage.removeItem( 'wp-test' );
                } catch(e) {}

                hasStorage = result;
                return result;
            }

            /**
             * Initialize the local storage
             *
             * @return mixed False if no sessionStorage in the browser or an Object containing all postData for this blog
             */
            function getStorage() {
                var stored_obj = false;
                // Separate local storage containers for each blog_id
                if ( hasStorage && blog_id ) {
                    stored_obj = sessionStorage.getItem( 'wp-autosave-' + blog_id );

                    if ( stored_obj ) {
                        stored_obj = JSON.parse( stored_obj );
                    } else {
                        stored_obj = {};
                    }
                }

                return stored_obj;
            }

            /**
             * Set the storage for this blog
             *
             * Confirms that the data was saved successfully.
             *
             * @return bool
             */
            function setStorage( stored_obj ) {
                var key;

                if ( hasStorage && blog_id ) {
                    key = 'wp-autosave-' + blog_id;
                    sessionStorage.setItem( key, JSON.stringify( stored_obj ) );
                    return sessionStorage.getItem( key ) !== null;
                }

                return false;
            }

            /**
             * Get the saved post data for the current post
             *
             * @return mixed False if no storage or no data or the postData as an Object
             */
            function getSavedPostData() {
                var stored = getStorage();

                if ( ! stored || ! post_id ) {
                    return false;
                }

                return stored[ 'post_' + post_id ] || false;
            }

            /**
             * Set (save or delete) post data in the storage.
             *
             * If stored_data evaluates to 'false' the storage key for the current post will be removed
             *
             * $param stored_data The post data to store or null/false/empty to delete the key
             * @return bool
             */
            function setData( stored_data ) {
                var stored = getStorage();

                if ( ! stored || ! post_id ) {
                    return false;
                }

                if ( stored_data ) {
                    stored[ 'post_' + post_id ] = stored_data;
                } else if ( stored.hasOwnProperty( 'post_' + post_id ) ) {
                    delete stored[ 'post_' + post_id ];
                } else {
                    return false;
                }

                return setStorage( stored );
            }

            function suspend() {
                isSuspended = true;
            }

            function resume() {
                isSuspended = false;
            }

            /**
             * Save post data for the current post
             *
             * Runs on a 15 sec. interval, saves when there are differences in the post title or content.
             * When the optional data is provided, updates the last saved post data.
             *
             * $param data optional Object The post data for saving, minimum 'post_title' and 'content'
             * @return bool
             */
            function save( data ) {
                var postData, compareString,
                    result = false;

                if ( isSuspended ) {
                    return false;
                }

                if ( data ) {
                    postData = getSavedPostData() || {};
                    $.extend( postData, data );
                } else {
                    postData = getPostData('local');
                }

                compareString = getCompareString( postData );

                if ( typeof lastCompareString === 'undefined' ) {
                    lastCompareString = initialCompareString;
                }

                // If the content, title and excerpt did not change since the last save, don't save again
                if ( compareString === lastCompareString ) {
                    return false;
                }

                postData.save_time = ( new Date() ).getTime();
                postData.status = $( '#post_status' ).val() || '';
                result = setData( postData );

                if ( result ) {
                    lastCompareString = compareString;
                }

                return result;
            }

            // Run on DOM ready
            function run() {
                post_id = $('#post_ID').val() || 0;

                // Check if the local post data is different than the loaded post data.
                if ( $( '#wp-content-wrap' ).hasClass( 'tmce-active' ) ) {
                    // If TinyMCE loads first, check the post 1.5 sec. after it is ready.
                    // By this time the content has been loaded in the editor and 'saved' to the textarea.
                    // This prevents false positives.
                    $document.on( 'tinymce-editor-init.autosave', function() {
                        window.setTimeout( function() {
                            checkPost();
                        }, 1500 );
                    });
                } else {
                    checkPost();
                }

                // Save every 15 sec.
                intervalTimer = window.setInterval( save, 15000 );

                $( 'form#post' ).on( 'submit.autosave-local', function() {
                    var editor = typeof tinymce !== 'undefined' && tinymce.get('content'),
                        post_id = $('#post_ID').val() || 0;

                    if ( editor && ! editor.isHidden() ) {
                        // Last onSubmit event in the editor, needs to run after the content has been moved to the textarea.
                        editor.on( 'submit', function() {
                            save({
                                post_title: $( '#title' ).val() || '',
                                content: $( '#content' ).val() || '',
                                excerpt: $( '#excerpt' ).val() || ''
                            });
                        });
                    } else {
                        save({
                            post_title: $( '#title' ).val() || '',
                            content: $( '#content' ).val() || '',
                            excerpt: $( '#excerpt' ).val() || ''
                        });
                    }

                    wpCookies.set( 'wp-saving-post-' + post_id, 'check' );
                });
            }

            // Strip whitespace and compare two strings
            function compare( str1, str2 ) {
                function removeSpaces( string ) {
                    return string.toString().replace(/[\x20\t\r\n\f]+/g, '');
                }

                return ( removeSpaces( str1 || '' ) === removeSpaces( str2 || '' ) );
            }

            /**
             * Check if the saved data for the current post (if any) is different than the loaded post data on the screen
             *
             * Shows a standard message letting the user restore the post data if different.
             *
             * @return void
             */
            function checkPost() {
                var content, post_title, excerpt, $notice,
                    postData = getSavedPostData(),
                    cookie = wpCookies.get( 'wp-saving-post-' + post_id );

                if ( ! postData ) {
                    return;
                }

                if ( cookie ) {
                    wpCookies.remove( 'wp-saving-post-' + post_id );

                    if ( cookie === 'saved' ) {
                        // The post was saved properly, remove old data and bail
                        setData( false );
                        return;
                    }
                }

                // There is a newer autosave. Don't show two "restore" notices at the same time.
                if ( $( '#has-newer-autosave' ).length ) {
                    return;
                }

                content = $( '#content' ).val() || '';
                post_title = $( '#title' ).val() || '';
                excerpt = $( '#excerpt' ).val() || '';

                // cookie == 'check' means the post was not saved properly, always show #local-storage-notice
                if ( cookie !== 'check' && compare( content, postData.content ) &&
                    compare( post_title, postData.post_title ) && compare( excerpt, postData.excerpt ) ) {

                    return;
                }

                restorePostData = postData;
                undoPostData = {
                    content: content,
                    post_title: post_title,
                    excerpt: excerpt
                };

                $notice = $( '#local-storage-notice' );
                $('.wrap h2').first().after( $notice.addClass( 'updated' ).show() );

                $notice.on( 'click.autosave-local', function( event ) {
                    var $target = $( event.target );

                    if ( $target.hasClass( 'restore-backup' ) ) {
                        restorePost( restorePostData );
                        $target.parent().hide();
                        $(this).find( 'p.undo-restore' ).show();
                    } else if ( $target.hasClass( 'undo-restore-backup' ) ) {
                        restorePost( undoPostData );
                        $target.parent().hide();
                        $(this).find( 'p.local-restore' ).show();
                    }

                    event.preventDefault();
                });
            }

            // Restore the current title, content and excerpt from postData.
            function restorePost( postData ) {
                var editor;

                if ( postData ) {
                    // Set the last saved data
                    lastCompareString = getCompareString( postData );

                    if ( $( '#title' ).val() !== postData.post_title ) {
                        $( '#title' ).focus().val( postData.post_title || '' );
                    }

                    $( '#excerpt' ).val( postData.excerpt || '' );
                    editor = typeof tinymce !== 'undefined' && tinymce.get('content');

                    if ( editor && ! editor.isHidden() && typeof switchEditors !== 'undefined' ) {
                        // Make sure there's an undo level in the editor
                        editor.undoManager.add();
                        editor.setContent( postData.content ? switchEditors.wpautop( postData.content ) : '' );
                    } else {
                        // Make sure the Text editor is selected
                        $( '#content-html' ).click();
                        $( '#content' ).val( postData.content );
                    }

                    return true;
                }

                return false;
            }

            // Initialize and run checkPost() on loading the script (before TinyMCE init)
            blog_id = typeof window.autosaveL10n !== 'undefined' && window.autosaveL10n.blog_id;

            // Check if the browser supports sessionStorage and it's not disabled
            if ( ! checkStorage() ) {
                return;
            }

            // Don't run if the post type supports neither 'editor' (textarea#content) nor 'excerpt'.
            if ( ! blog_id || ( ! $('#content').length && ! $('#excerpt').length ) ) {
                return;
            }

            $document.ready( run );

            return {
                hasStorage: hasStorage,
                getSavedPostData: getSavedPostData,
                save: save,
                suspend: suspend,
                resume: resume
            };
        }

        // Autosave on the server
        function autosaveServer() {
            var _blockSave, _blockSaveTimer, previousCompareString, lastCompareString,
                nextRun = 0,
                isSuspended = false;

            // Block saving for the next 10 sec.
            function tempBlockSave() {
                _blockSave = true;
                window.clearTimeout( _blockSaveTimer );

                _blockSaveTimer = window.setTimeout( function() {
                    _blockSave = false;
                }, 10000 );
            }

            function suspend() {
                isSuspended = true;
            }

            function resume() {
                isSuspended = false;
            }

            // Runs on heartbeat-response
            function response( data ) {
                _schedule();
                _blockSave = false;
                lastCompareString = previousCompareString;
                previousCompareString = '';

                $document.trigger( 'after-autosave', [data] );
                enableButtons();

                if ( data.success ) {
                    // No longer an auto-draft
                    $( '#auto_draft' ).val('');
                }
            }

            /**
             * Save immediately
             *
             * Resets the timing and tells heartbeat to connect now
             *
             * @return void
             */
            function triggerSave() {
                nextRun = 0;
                wp.heartbeat.connectNow();
            }

            /**
             * Checks if the post content in the textarea has changed since page load.
             *
             * This also happens when TinyMCE is active and editor.save() is triggered by
             * wp.autosave.getPostData().
             *
             * @return bool
             */
            function postChanged() {
                return getCompareString() !== initialCompareString;
            }

            // Runs on 'heartbeat-send'
            function save() {
                var postData, compareString;

                // window.autosave() used for back-compat
                if ( isSuspended || _blockSave || ! window.autosave() ) {
                    return false;
                }

                if ( ( new Date() ).getTime() < nextRun ) {
                    return false;
                }

                postData = getPostData();
                compareString = getCompareString( postData );

                // First check
                if ( typeof lastCompareString === 'undefined' ) {
                    lastCompareString = initialCompareString;
                }

                // No change
                if ( compareString === lastCompareString ) {
                    return false;
                }

                previousCompareString = compareString;
                tempBlockSave();
                disableButtons();

                $document.trigger( 'wpcountwords', [ postData.content ] )
                    .trigger( 'before-autosave', [ postData ] );

                postData._wpnonce = $( '#_wpnonce' ).val() || '';

                return postData;
            }

            function _schedule() {
                nextRun = ( new Date() ).getTime() + ( autosaveL10n.autosaveInterval * 1000 ) || 60000;
            }

            $document.on( 'heartbeat-send.autosave', function( event, data ) {
                var autosaveData = save();

                if ( autosaveData ) {
                    data.wp_autosave = autosaveData;
                }
            }).on( 'heartbeat-tick.autosave', function( event, data ) {
                if ( data.wp_autosave ) {
                    response( data.wp_autosave );
                }
            }).on( 'heartbeat-connection-lost.autosave', function( event, error, status ) {
                // When connection is lost, keep user from submitting changes.
                if ( 'timeout' === error || 603 === status ) {
                    var $notice = $('#lost-connection-notice');

                    if ( ! wp.autosave.local.hasStorage ) {
                        $notice.find('.hide-if-no-sessionstorage').hide();
                    }

                    $notice.show();
                    disableButtons();
                }
            }).on( 'heartbeat-connection-restored.autosave', function() {
                $('#lost-connection-notice').hide();
                enableButtons();
            }).ready( function() {
                _schedule();
            });

            return {
                tempBlockSave: tempBlockSave,
                triggerSave: triggerSave,
                postChanged: postChanged,
                suspend: suspend,
                resume: resume
            };
        }

        // Wait for TinyMCE to initialize plus 1 sec. for any external css to finish loading,
        // then 'save' to the textarea before setting initialCompareString.
        // This avoids any insignificant differences between the initial textarea content and the content
        // extracted from the editor.
        $document.on( 'tinymce-editor-init.autosave', function( event, editor ) {
            if ( editor.id === 'content' ) {
                window.setTimeout( function() {
                    editor.save();
                    initialCompareString = getCompareString();
                }, 1000 );
            }
        }).ready( function() {
            // Set the initial compare string in case TinyMCE is not used or not loaded first
            initialCompareString = getCompareString();
        });

        return {
            getPostData: getPostData,
            getCompareString: getCompareString,
            disableButtons: disableButtons,
            enableButtons: enableButtons,
            local: autosaveLocal(),
            server: autosaveServer()
        };
    }

    window.wp = window.wp || {};
    window.wp.autosave = autosave();

}( jQuery, window ));


//autosave.min.js

window.autosave=function(){return!0},function(a,b){function c(){function c(b){var c,d,e,f=(new Date).getTime(),g=[],h="undefined"!=typeof tinymce&&tinymce.get("content");return h&&!h.isHidden()&&f-3e3>j&&(h.save(),j=f),e={post_id:a("#post_ID").val()||0,post_type:a("#post_type").val()||"",post_author:a("#post_author").val()||"",post_title:a("#title").val()||"",content:a("#content").val()||"",excerpt:a("#excerpt").val()||""},"local"===b?e:(a('input[id^="in-category-"]:checked').each(function(){g.push(this.value)}),e.catslist=g.join(","),(c=a("#post_name").val())&&(e.post_name=c),(d=a("#parent_id").val())&&(e.parent_id=d),a("#comment_status").prop("checked")&&(e.comment_status="open"),a("#ping_status").prop("checked")&&(e.ping_status="open"),"1"===a("#auto_draft").val()&&(e.auto_draft="1"),e)}function d(b){return"object"==typeof b?(b.post_title||"")+"::"+(b.content||"")+"::"+(b.excerpt||""):(a("#title").val()||"")+"::"+(a("#content").val()||"")+"::"+(a("#excerpt").val()||"")}function e(){k.trigger("autosave-disable-buttons"),setTimeout(f,5e3)}function f(){k.trigger("autosave-enable-buttons")}function g(){function e(){var a=Math.random().toString(),c=!1;try{b.sessionStorage.setItem("wp-test",a),c=b.sessionStorage.getItem("wp-test")===a,b.sessionStorage.removeItem("wp-test")}catch(d){}return w=c,c}function f(){var a=!1;return w&&u&&(a=sessionStorage.getItem("wp-autosave-"+u),a=a?JSON.parse(a):{}),a}function g(a){var b;return w&&u?(b="wp-autosave-"+u,sessionStorage.setItem(b,JSON.stringify(a)),null!==sessionStorage.getItem(b)):!1}function h(){var a=f();return a&&v?a["post_"+v]||!1:!1}function j(a){var b=f();if(!b||!v)return!1;if(a)b["post_"+v]=a;else{if(!b.hasOwnProperty("post_"+v))return!1;delete b["post_"+v]}return g(b)}function l(){z=!0}function m(){z=!1}function n(b){var e,f,g=!1;return z?!1:(b?(e=h()||{},a.extend(e,b)):e=c("local"),f=d(e),"undefined"==typeof y&&(y=i),f===y?!1:(e.save_time=(new Date).getTime(),e.status=a("#post_status").val()||"",g=j(e),g&&(y=f),g))}function o(){v=a("#post_ID").val()||0,a("#wp-content-wrap").hasClass("tmce-active")?k.on("tinymce-editor-init.autosave",function(){b.setTimeout(function(){q()},1500)}):q(),x=b.setInterval(n,15e3),a("form#post").on("submit.autosave-local",function(){var b="undefined"!=typeof tinymce&&tinymce.get("content"),c=a("#post_ID").val()||0;b&&!b.isHidden()?b.on("submit",function(){n({post_title:a("#title").val()||"",content:a("#content").val()||"",excerpt:a("#excerpt").val()||""})}):n({post_title:a("#title").val()||"",content:a("#content").val()||"",excerpt:a("#excerpt").val()||""}),wpCookies.set("wp-saving-post-"+c,"check")})}function p(a,b){function c(a){return a.toString().replace(/[\x20\t\r\n\f]+/g,"")}return c(a||"")===c(b||"")}function q(){var b,c,d,e,f=h(),g=wpCookies.get("wp-saving-post-"+v);if(f)return g&&(wpCookies.remove("wp-saving-post-"+v),"saved"===g)?void j(!1):void(a("#has-newer-autosave").length||(b=a("#content").val()||"",c=a("#title").val()||"",d=a("#excerpt").val()||"","check"!==g&&p(b,f.content)&&p(c,f.post_title)&&p(d,f.excerpt)||(s=f,t={content:b,post_title:c,excerpt:d},e=a("#local-storage-notice"),a(".wrap h2").first().after(e.addClass("updated").show()),e.on("click.autosave-local",function(b){var c=a(b.target);c.hasClass("restore-backup")?(r(s),c.parent().hide(),a(this).find("p.undo-restore").show()):c.hasClass("undo-restore-backup")&&(r(t),c.parent().hide(),a(this).find("p.local-restore").show()),b.preventDefault()}))))}function r(b){var c;return b?(y=d(b),a("#title").val()!==b.post_title&&a("#title").focus().val(b.post_title||""),a("#excerpt").val(b.excerpt||""),c="undefined"!=typeof tinymce&&tinymce.get("content"),c&&!c.isHidden()&&"undefined"!=typeof switchEditors?(c.undoManager.add(),c.setContent(b.content?switchEditors.wpautop(b.content):"")):(a("#content-html").click(),a("#content").val(b.content)),!0):!1}var s,t,u,v,w,x,y,z=!1;return u="undefined"!=typeof b.autosaveL10n&&b.autosaveL10n.blog_id,e()&&u&&(a("#content").length||a("#excerpt").length)?(k.ready(o),{hasStorage:w,getSavedPostData:h,save:n,suspend:l,resume:m}):void 0}function h(){function g(){q=!0,b.clearTimeout(r),r=b.setTimeout(function(){q=!1},1e4)}function h(){v=!0}function j(){v=!1}function l(b){p(),q=!1,t=s,s="",k.trigger("after-autosave",[b]),f(),b.success&&a("#auto_draft").val("")}function m(){u=0,wp.heartbeat.connectNow()}function n(){return d()!==i}function o(){var f,h;return v||q||!b.autosave()?!1:(new Date).getTime()<u?!1:(f=c(),h=d(f),"undefined"==typeof t&&(t=i),h===t?!1:(s=h,g(),e(),k.trigger("wpcountwords",[f.content]).trigger("before-autosave",[f]),f._wpnonce=a("#_wpnonce").val()||"",f))}function p(){u=(new Date).getTime()+1e3*autosaveL10n.autosaveInterval||6e4}var q,r,s,t,u=0,v=!1;return k.on("heartbeat-send.autosave",function(a,b){var c=o();c&&(b.wp_autosave=c)}).on("heartbeat-tick.autosave",function(a,b){b.wp_autosave&&l(b.wp_autosave)}).on("heartbeat-connection-lost.autosave",function(b,c,d){if("timeout"===c||603===d){var f=a("#lost-connection-notice");wp.autosave.local.hasStorage||f.find(".hide-if-no-sessionstorage").hide(),f.show(),e()}}).on("heartbeat-connection-restored.autosave",function(){a("#lost-connection-notice").hide(),f()}).ready(function(){p()}),{tempBlockSave:g,triggerSave:m,postChanged:n,suspend:h,resume:j}}var i,j=0,k=a(document);return k.on("tinymce-editor-init.autosave",function(a,c){"content"===c.id&&b.setTimeout(function(){c.save(),i=d()},1e3)}).ready(function(){i=d()}),{getPostData:c,getCompareString:d,disableButtons:e,enableButtons:f,local:g(),server:h()}}b.wp=b.wp||{},b.wp.autosave=c()}(jQuery,window);

//backbone.min.js
!function(a,b){if("function"==typeof define&&define.amd)define(["underscore","jquery","exports"],function(c,d,e){a.Backbone=b(a,e,c,d)});else if("undefined"!=typeof exports){var c=require("underscore");b(a,exports,c)}else a.Backbone=b(a,{},a._,a.jQuery||a.Zepto||a.ender||a.$)}(this,function(a,b,c,d){{var e=a.Backbone,f=[],g=(f.push,f.slice);f.splice}b.VERSION="1.1.2",b.$=d,b.noConflict=function(){return a.Backbone=e,this},b.emulateHTTP=!1,b.emulateJSON=!1;var h=b.Events={on:function(a,b,c){if(!j(this,"on",a,[b,c])||!b)return this;this._events||(this._events={});var d=this._events[a]||(this._events[a]=[]);return d.push({callback:b,context:c,ctx:c||this}),this},once:function(a,b,d){if(!j(this,"once",a,[b,d])||!b)return this;var e=this,f=c.once(function(){e.off(a,f),b.apply(this,arguments)});return f._callback=b,this.on(a,f,d)},off:function(a,b,d){var e,f,g,h,i,k,l,m;if(!this._events||!j(this,"off",a,[b,d]))return this;if(!a&&!b&&!d)return this._events=void 0,this;for(h=a?[a]:c.keys(this._events),i=0,k=h.length;k>i;i++)if(a=h[i],g=this._events[a]){if(this._events[a]=e=[],b||d)for(l=0,m=g.length;m>l;l++)f=g[l],(b&&b!==f.callback&&b!==f.callback._callback||d&&d!==f.context)&&e.push(f);e.length||delete this._events[a]}return this},trigger:function(a){if(!this._events)return this;var b=g.call(arguments,1);if(!j(this,"trigger",a,b))return this;var c=this._events[a],d=this._events.all;return c&&k(c,b),d&&k(d,arguments),this},stopListening:function(a,b,d){var e=this._listeningTo;if(!e)return this;var f=!b&&!d;d||"object"!=typeof b||(d=this),a&&((e={})[a._listenId]=a);for(var g in e)a=e[g],a.off(b,d,this),(f||c.isEmpty(a._events))&&delete this._listeningTo[g];return this}},i=/\s+/,j=function(a,b,c,d){if(!c)return!0;if("object"==typeof c){for(var e in c)a[b].apply(a,[e,c[e]].concat(d));return!1}if(i.test(c)){for(var f=c.split(i),g=0,h=f.length;h>g;g++)a[b].apply(a,[f[g]].concat(d));return!1}return!0},k=function(a,b){var c,d=-1,e=a.length,f=b[0],g=b[1],h=b[2];switch(b.length){case 0:for(;++d<e;)(c=a[d]).callback.call(c.ctx);return;case 1:for(;++d<e;)(c=a[d]).callback.call(c.ctx,f);return;case 2:for(;++d<e;)(c=a[d]).callback.call(c.ctx,f,g);return;case 3:for(;++d<e;)(c=a[d]).callback.call(c.ctx,f,g,h);return;default:for(;++d<e;)(c=a[d]).callback.apply(c.ctx,b);return}},l={listenTo:"on",listenToOnce:"once"};c.each(l,function(a,b){h[b]=function(b,d,e){var f=this._listeningTo||(this._listeningTo={}),g=b._listenId||(b._listenId=c.uniqueId("l"));return f[g]=b,e||"object"!=typeof d||(e=this),b[a](d,e,this),this}}),h.bind=h.on,h.unbind=h.off,c.extend(b,h);var m=b.Model=function(a,b){var d=a||{};b||(b={}),this.cid=c.uniqueId("c"),this.attributes={},b.collection&&(this.collection=b.collection),b.parse&&(d=this.parse(d,b)||{}),d=c.defaults({},d,c.result(this,"defaults")),this.set(d,b),this.changed={},this.initialize.apply(this,arguments)};c.extend(m.prototype,h,{changed:null,validationError:null,idAttribute:"id",initialize:function(){},toJSON:function(){return c.clone(this.attributes)},sync:function(){return b.sync.apply(this,arguments)},get:function(a){return this.attributes[a]},escape:function(a){return c.escape(this.get(a))},has:function(a){return null!=this.get(a)},set:function(a,b,d){var e,f,g,h,i,j,k,l;if(null==a)return this;if("object"==typeof a?(f=a,d=b):(f={})[a]=b,d||(d={}),!this._validate(f,d))return!1;g=d.unset,i=d.silent,h=[],j=this._changing,this._changing=!0,j||(this._previousAttributes=c.clone(this.attributes),this.changed={}),l=this.attributes,k=this._previousAttributes,this.idAttribute in f&&(this.id=f[this.idAttribute]);for(e in f)b=f[e],c.isEqual(l[e],b)||h.push(e),c.isEqual(k[e],b)?delete this.changed[e]:this.changed[e]=b,g?delete l[e]:l[e]=b;if(!i){h.length&&(this._pending=d);for(var m=0,n=h.length;n>m;m++)this.trigger("change:"+h[m],this,l[h[m]],d)}if(j)return this;if(!i)for(;this._pending;)d=this._pending,this._pending=!1,this.trigger("change",this,d);return this._pending=!1,this._changing=!1,this},unset:function(a,b){return this.set(a,void 0,c.extend({},b,{unset:!0}))},clear:function(a){var b={};for(var d in this.attributes)b[d]=void 0;return this.set(b,c.extend({},a,{unset:!0}))},hasChanged:function(a){return null==a?!c.isEmpty(this.changed):c.has(this.changed,a)},changedAttributes:function(a){if(!a)return this.hasChanged()?c.clone(this.changed):!1;var b,d=!1,e=this._changing?this._previousAttributes:this.attributes;for(var f in a)c.isEqual(e[f],b=a[f])||((d||(d={}))[f]=b);return d},previous:function(a){return null!=a&&this._previousAttributes?this._previousAttributes[a]:null},previousAttributes:function(){return c.clone(this._previousAttributes)},fetch:function(a){a=a?c.clone(a):{},void 0===a.parse&&(a.parse=!0);var b=this,d=a.success;return a.success=function(c){return b.set(b.parse(c,a),a)?(d&&d(b,c,a),void b.trigger("sync",b,c,a)):!1},L(this,a),this.sync("read",this,a)},save:function(a,b,d){var e,f,g,h=this.attributes;if(null==a||"object"==typeof a?(e=a,d=b):(e={})[a]=b,d=c.extend({validate:!0},d),e&&!d.wait){if(!this.set(e,d))return!1}else if(!this._validate(e,d))return!1;e&&d.wait&&(this.attributes=c.extend({},h,e)),void 0===d.parse&&(d.parse=!0);var i=this,j=d.success;return d.success=function(a){i.attributes=h;var b=i.parse(a,d);return d.wait&&(b=c.extend(e||{},b)),c.isObject(b)&&!i.set(b,d)?!1:(j&&j(i,a,d),void i.trigger("sync",i,a,d))},L(this,d),f=this.isNew()?"create":d.patch?"patch":"update","patch"===f&&(d.attrs=e),g=this.sync(f,this,d),e&&d.wait&&(this.attributes=h),g},destroy:function(a){a=a?c.clone(a):{};var b=this,d=a.success,e=function(){b.trigger("destroy",b,b.collection,a)};if(a.success=function(c){(a.wait||b.isNew())&&e(),d&&d(b,c,a),b.isNew()||b.trigger("sync",b,c,a)},this.isNew())return a.success(),!1;L(this,a);var f=this.sync("delete",this,a);return a.wait||e(),f},url:function(){var a=c.result(this,"urlRoot")||c.result(this.collection,"url")||K();return this.isNew()?a:a.replace(/([^\/])$/,"$1/")+encodeURIComponent(this.id)},parse:function(a){return a},clone:function(){return new this.constructor(this.attributes)},isNew:function(){return!this.has(this.idAttribute)},isValid:function(a){return this._validate({},c.extend(a||{},{validate:!0}))},_validate:function(a,b){if(!b.validate||!this.validate)return!0;a=c.extend({},this.attributes,a);var d=this.validationError=this.validate(a,b)||null;return d?(this.trigger("invalid",this,d,c.extend(b,{validationError:d})),!1):!0}});var n=["keys","values","pairs","invert","pick","omit"];c.each(n,function(a){m.prototype[a]=function(){var b=g.call(arguments);return b.unshift(this.attributes),c[a].apply(c,b)}});var o=b.Collection=function(a,b){b||(b={}),b.model&&(this.model=b.model),void 0!==b.comparator&&(this.comparator=b.comparator),this._reset(),this.initialize.apply(this,arguments),a&&this.reset(a,c.extend({silent:!0},b))},p={add:!0,remove:!0,merge:!0},q={add:!0,remove:!1};c.extend(o.prototype,h,{model:m,initialize:function(){},toJSON:function(a){return this.map(function(b){return b.toJSON(a)})},sync:function(){return b.sync.apply(this,arguments)},add:function(a,b){return this.set(a,c.extend({merge:!1},b,q))},remove:function(a,b){var d=!c.isArray(a);a=d?[a]:c.clone(a),b||(b={});var e,f,g,h;for(e=0,f=a.length;f>e;e++)h=a[e]=this.get(a[e]),h&&(delete this._byId[h.id],delete this._byId[h.cid],g=this.indexOf(h),this.models.splice(g,1),this.length--,b.silent||(b.index=g,h.trigger("remove",h,this,b)),this._removeReference(h,b));return d?a[0]:a},set:function(a,b){b=c.defaults({},b,p),b.parse&&(a=this.parse(a,b));var d=!c.isArray(a);a=d?a?[a]:[]:c.clone(a);var e,f,g,h,i,j,k,l=b.at,n=this.model,o=this.comparator&&null==l&&b.sort!==!1,q=c.isString(this.comparator)?this.comparator:null,r=[],s=[],t={},u=b.add,v=b.merge,w=b.remove,x=!o&&u&&w?[]:!1;for(e=0,f=a.length;f>e;e++){if(i=a[e]||{},g=i instanceof m?h=i:i[n.prototype.idAttribute||"id"],j=this.get(g))w&&(t[j.cid]=!0),v&&(i=i===h?h.attributes:i,b.parse&&(i=j.parse(i,b)),j.set(i,b),o&&!k&&j.hasChanged(q)&&(k=!0)),a[e]=j;else if(u){if(h=a[e]=this._prepareModel(i,b),!h)continue;r.push(h),this._addReference(h,b)}h=j||h,!x||!h.isNew()&&t[h.id]||x.push(h),t[h.id]=!0}if(w){for(e=0,f=this.length;f>e;++e)t[(h=this.models[e]).cid]||s.push(h);s.length&&this.remove(s,b)}if(r.length||x&&x.length)if(o&&(k=!0),this.length+=r.length,null!=l)for(e=0,f=r.length;f>e;e++)this.models.splice(l+e,0,r[e]);else{x&&(this.models.length=0);var y=x||r;for(e=0,f=y.length;f>e;e++)this.models.push(y[e])}if(k&&this.sort({silent:!0}),!b.silent){for(e=0,f=r.length;f>e;e++)(h=r[e]).trigger("add",h,this,b);(k||x&&x.length)&&this.trigger("sort",this,b)}return d?a[0]:a},reset:function(a,b){b||(b={});for(var d=0,e=this.models.length;e>d;d++)this._removeReference(this.models[d],b);return b.previousModels=this.models,this._reset(),a=this.add(a,c.extend({silent:!0},b)),b.silent||this.trigger("reset",this,b),a},push:function(a,b){return this.add(a,c.extend({at:this.length},b))},pop:function(a){var b=this.at(this.length-1);return this.remove(b,a),b},unshift:function(a,b){return this.add(a,c.extend({at:0},b))},shift:function(a){var b=this.at(0);return this.remove(b,a),b},slice:function(){return g.apply(this.models,arguments)},get:function(a){return null==a?void 0:this._byId[a]||this._byId[a.id]||this._byId[a.cid]},at:function(a){return this.models[a]},where:function(a,b){return c.isEmpty(a)?b?void 0:[]:this[b?"find":"filter"](function(b){for(var c in a)if(a[c]!==b.get(c))return!1;return!0})},findWhere:function(a){return this.where(a,!0)},sort:function(a){if(!this.comparator)throw new Error("Cannot sort a set without a comparator");return a||(a={}),c.isString(this.comparator)||1===this.comparator.length?this.models=this.sortBy(this.comparator,this):this.models.sort(c.bind(this.comparator,this)),a.silent||this.trigger("sort",this,a),this},pluck:function(a){return c.invoke(this.models,"get",a)},fetch:function(a){a=a?c.clone(a):{},void 0===a.parse&&(a.parse=!0);var b=a.success,d=this;return a.success=function(c){var e=a.reset?"reset":"set";d[e](c,a),b&&b(d,c,a),d.trigger("sync",d,c,a)},L(this,a),this.sync("read",this,a)},create:function(a,b){if(b=b?c.clone(b):{},!(a=this._prepareModel(a,b)))return!1;b.wait||this.add(a,b);var d=this,e=b.success;return b.success=function(a,c){b.wait&&d.add(a,b),e&&e(a,c,b)},a.save(null,b),a},parse:function(a){return a},clone:function(){return new this.constructor(this.models)},_reset:function(){this.length=0,this.models=[],this._byId={}},_prepareModel:function(a,b){if(a instanceof m)return a;b=b?c.clone(b):{},b.collection=this;var d=new this.model(a,b);return d.validationError?(this.trigger("invalid",this,d.validationError,b),!1):d},_addReference:function(a){this._byId[a.cid]=a,null!=a.id&&(this._byId[a.id]=a),a.collection||(a.collection=this),a.on("all",this._onModelEvent,this)},_removeReference:function(a){this===a.collection&&delete a.collection,a.off("all",this._onModelEvent,this)},_onModelEvent:function(a,b,c,d){("add"!==a&&"remove"!==a||c===this)&&("destroy"===a&&this.remove(b,d),b&&a==="change:"+b.idAttribute&&(delete this._byId[b.previous(b.idAttribute)],null!=b.id&&(this._byId[b.id]=b)),this.trigger.apply(this,arguments))}});var r=["forEach","each","map","collect","reduce","foldl","inject","reduceRight","foldr","find","detect","filter","select","reject","every","all","some","any","include","contains","invoke","max","min","toArray","size","first","head","take","initial","rest","tail","drop","last","without","difference","indexOf","shuffle","lastIndexOf","isEmpty","chain","sample"];c.each(r,function(a){o.prototype[a]=function(){var b=g.call(arguments);return b.unshift(this.models),c[a].apply(c,b)}});var s=["groupBy","countBy","sortBy","indexBy"];c.each(s,function(a){o.prototype[a]=function(b,d){var e=c.isFunction(b)?b:function(a){return a.get(b)};return c[a](this.models,e,d)}});var t=b.View=function(a){this.cid=c.uniqueId("view"),a||(a={}),c.extend(this,c.pick(a,v)),this._ensureElement(),this.initialize.apply(this,arguments),this.delegateEvents()},u=/^(\S+)\s*(.*)$/,v=["model","collection","el","id","attributes","className","tagName","events"];c.extend(t.prototype,h,{tagName:"div",$:function(a){return this.$el.find(a)},initialize:function(){},render:function(){return this},remove:function(){return this.$el.remove(),this.stopListening(),this},setElement:function(a,c){return this.$el&&this.undelegateEvents(),this.$el=a instanceof b.$?a:b.$(a),this.el=this.$el[0],c!==!1&&this.delegateEvents(),this},delegateEvents:function(a){if(!a&&!(a=c.result(this,"events")))return this;this.undelegateEvents();for(var b in a){var d=a[b];if(c.isFunction(d)||(d=this[a[b]]),d){var e=b.match(u),f=e[1],g=e[2];d=c.bind(d,this),f+=".delegateEvents"+this.cid,""===g?this.$el.on(f,d):this.$el.on(f,g,d)}}return this},undelegateEvents:function(){return this.$el.off(".delegateEvents"+this.cid),this},_ensureElement:function(){if(this.el)this.setElement(c.result(this,"el"),!1);else{var a=c.extend({},c.result(this,"attributes"));this.id&&(a.id=c.result(this,"id")),this.className&&(a["class"]=c.result(this,"className"));var d=b.$("<"+c.result(this,"tagName")+">").attr(a);this.setElement(d,!1)}}}),b.sync=function(a,d,e){var f=x[a];c.defaults(e||(e={}),{emulateHTTP:b.emulateHTTP,emulateJSON:b.emulateJSON});var g={type:f,dataType:"json"};if(e.url||(g.url=c.result(d,"url")||K()),null!=e.data||!d||"create"!==a&&"update"!==a&&"patch"!==a||(g.contentType="application/json",g.data=JSON.stringify(e.attrs||d.toJSON(e))),e.emulateJSON&&(g.contentType="application/x-www-form-urlencoded",g.data=g.data?{model:g.data}:{}),e.emulateHTTP&&("PUT"===f||"DELETE"===f||"PATCH"===f)){g.type="POST",e.emulateJSON&&(g.data._method=f);var h=e.beforeSend;e.beforeSend=function(a){return a.setRequestHeader("X-HTTP-Method-Override",f),h?h.apply(this,arguments):void 0}}"GET"===g.type||e.emulateJSON||(g.processData=!1),"PATCH"===g.type&&w&&(g.xhr=function(){return new ActiveXObject("Microsoft.XMLHTTP")});var i=e.xhr=b.ajax(c.extend(g,e));return d.trigger("request",d,i,e),i};var w=!("undefined"==typeof window||!window.ActiveXObject||window.XMLHttpRequest&&(new XMLHttpRequest).dispatchEvent),x={create:"POST",update:"PUT",patch:"PATCH","delete":"DELETE",read:"GET"};b.ajax=function(){return b.$.ajax.apply(b.$,arguments)};var y=b.Router=function(a){a||(a={}),a.routes&&(this.routes=a.routes),this._bindRoutes(),this.initialize.apply(this,arguments)},z=/\((.*?)\)/g,A=/(\(\?)?:\w+/g,B=/\*\w+/g,C=/[\-{}\[\]+?.,\\\^$|#\s]/g;c.extend(y.prototype,h,{initialize:function(){},route:function(a,d,e){c.isRegExp(a)||(a=this._routeToRegExp(a)),c.isFunction(d)&&(e=d,d=""),e||(e=this[d]);var f=this;return b.history.route(a,function(c){var g=f._extractParameters(a,c);f.execute(e,g),f.trigger.apply(f,["route:"+d].concat(g)),f.trigger("route",d,g),b.history.trigger("route",f,d,g)}),this},execute:function(a,b){a&&a.apply(this,b)},navigate:function(a,c){return b.history.navigate(a,c),this},_bindRoutes:function(){if(this.routes){this.routes=c.result(this,"routes");for(var a,b=c.keys(this.routes);null!=(a=b.pop());)this.route(a,this.routes[a])}},_routeToRegExp:function(a){return a=a.replace(C,"\\$&").replace(z,"(?:$1)?").replace(A,function(a,b){return b?a:"([^/?]+)"}).replace(B,"([^?]*?)"),new RegExp("^"+a+"(?:\\?([\\s\\S]*))?$")},_extractParameters:function(a,b){var d=a.exec(b).slice(1);return c.map(d,function(a,b){return b===d.length-1?a||null:a?decodeURIComponent(a):null})}});var D=b.History=function(){this.handlers=[],c.bindAll(this,"checkUrl"),"undefined"!=typeof window&&(this.location=window.location,this.history=window.history)},E=/^[#\/]|\s+$/g,F=/^\/+|\/+$/g,G=/msie [\w.]+/,H=/\/$/,I=/#.*$/;D.started=!1,c.extend(D.prototype,h,{interval:50,atRoot:function(){return this.location.pathname.replace(/[^\/]$/,"$&/")===this.root},getHash:function(a){var b=(a||this).location.href.match(/#(.*)$/);return b?b[1]:""},getFragment:function(a,b){if(null==a)if(this._hasPushState||!this._wantsHashChange||b){a=decodeURI(this.location.pathname+this.location.search);var c=this.root.replace(H,"");a.indexOf(c)||(a=a.slice(c.length))}else a=this.getHash();return a.replace(E,"")},start:function(a){if(D.started)throw new Error("Backbone.history has already been started");D.started=!0,this.options=c.extend({root:"/"},this.options,a),this.root=this.options.root,this._wantsHashChange=this.options.hashChange!==!1,this._wantsPushState=!!this.options.pushState,this._hasPushState=!!(this.options.pushState&&this.history&&this.history.pushState);var d=this.getFragment(),e=document.documentMode,f=G.exec(navigator.userAgent.toLowerCase())&&(!e||7>=e);if(this.root=("/"+this.root+"/").replace(F,"/"),f&&this._wantsHashChange){var g=b.$('<iframe src="javascript:0" tabindex="-1">');this.iframe=g.hide().appendTo("body")[0].contentWindow,this.navigate(d)}this._hasPushState?b.$(window).on("popstate",this.checkUrl):this._wantsHashChange&&"onhashchange"in window&&!f?b.$(window).on("hashchange",this.checkUrl):this._wantsHashChange&&(this._checkUrlInterval=setInterval(this.checkUrl,this.interval)),this.fragment=d;var h=this.location;if(this._wantsHashChange&&this._wantsPushState){if(!this._hasPushState&&!this.atRoot())return this.fragment=this.getFragment(null,!0),this.location.replace(this.root+"#"+this.fragment),!0;this._hasPushState&&this.atRoot()&&h.hash&&(this.fragment=this.getHash().replace(E,""),this.history.replaceState({},document.title,this.root+this.fragment))}return this.options.silent?void 0:this.loadUrl()},stop:function(){b.$(window).off("popstate",this.checkUrl).off("hashchange",this.checkUrl),this._checkUrlInterval&&clearInterval(this._checkUrlInterval),D.started=!1},route:function(a,b){this.handlers.unshift({route:a,callback:b})},checkUrl:function(){var a=this.getFragment();return a===this.fragment&&this.iframe&&(a=this.getFragment(this.getHash(this.iframe))),a===this.fragment?!1:(this.iframe&&this.navigate(a),void this.loadUrl())},loadUrl:function(a){return a=this.fragment=this.getFragment(a),c.any(this.handlers,function(b){return b.route.test(a)?(b.callback(a),!0):void 0})},navigate:function(a,b){if(!D.started)return!1;b&&b!==!0||(b={trigger:!!b});var c=this.root+(a=this.getFragment(a||""));if(a=a.replace(I,""),this.fragment!==a){if(this.fragment=a,""===a&&"/"!==c&&(c=c.slice(0,-1)),this._hasPushState)this.history[b.replace?"replaceState":"pushState"]({},document.title,c);else{if(!this._wantsHashChange)return this.location.assign(c);this._updateHash(this.location,a,b.replace),this.iframe&&a!==this.getFragment(this.getHash(this.iframe))&&(b.replace||this.iframe.document.open().close(),this._updateHash(this.iframe.location,a,b.replace))}return b.trigger?this.loadUrl(a):void 0}},_updateHash:function(a,b,c){if(c){var d=a.href.replace(/(javascript:|#).*$/,"");a.replace(d+"#"+b)}else a.hash="#"+b}}),b.history=new D;var J=function(a,b){var d,e=this;d=a&&c.has(a,"constructor")?a.constructor:function(){return e.apply(this,arguments)},c.extend(d,e,b);var f=function(){this.constructor=d};return f.prototype=e.prototype,d.prototype=new f,a&&c.extend(d.prototype,a),d.__super__=e.prototype,d};m.extend=o.extend=y.extend=t.extend=D.extend=J;var K=function(){throw new Error('A "url" property or function must be specified')},L=function(a,b){var c=b.error;b.error=function(d){c&&c(a,d,b),a.trigger("error",a,d,b)}};return b});

//colorpicker.js
// ===================================================================
// Author: Matt Kruse <matt@mattkruse.com>
// WWW: http://www.mattkruse.com/
//
// NOTICE: You may use this code for any purpose, commercial or
// private, without any further permission from the author. You may
// remove this notice from your final code if you wish, however it is
// appreciated by the author if at least my web site address is kept.
//
// You may *NOT* re-distribute this code in any way except through its
// use. That means, you can include it in your product, or your web
// site, or any other form where the code is actually being used. You
// may not put the plain javascript up on your site for download or
// include it in your javascript libraries for download.
// If you wish to share this code with others, please just point them
// to the URL instead.
// Please DO NOT link directly to my .js files from your site. Copy
// the files to your server and use them there. Thank you.
// ===================================================================


/* SOURCE FILE: AnchorPosition.js */

/*
 AnchorPosition.js
 Author: Matt Kruse
 Last modified: 10/11/02

 DESCRIPTION: These functions find the position of an <A> tag in a document,
 so other elements can be positioned relative to it.

 COMPATABILITY: Netscape 4.x,6.x,Mozilla, IE 5.x,6.x on Windows. Some small
 positioning errors - usually with Window positioning - occur on the
 Macintosh platform.

 FUNCTIONS:
 getAnchorPosition(anchorname)
 Returns an Object() having .x and .y properties of the pixel coordinates
 of the upper-left corner of the anchor. Position is relative to the PAGE.

 getAnchorWindowPosition(anchorname)
 Returns an Object() having .x and .y properties of the pixel coordinates
 of the upper-left corner of the anchor, relative to the WHOLE SCREEN.

 NOTES:

 1) For popping up separate browser windows, use getAnchorWindowPosition.
 Otherwise, use getAnchorPosition

 2) Your anchor tag MUST contain both NAME and ID attributes which are the
 same. For example:
 <A NAME="test" ID="test"> </A>

 3) There must be at least a space between <A> </A> for IE5.5 to see the
 anchor tag correctly. Do not do <A></A> with no space.
 */

// getAnchorPosition(anchorname)
//   This function returns an object having .x and .y properties which are the coordinates
//   of the named anchor, relative to the page.
function getAnchorPosition(anchorname) {
    // This function will return an Object with x and y properties
    var useWindow=false;
    var coordinates=new Object();
    var x=0,y=0;
    // Browser capability sniffing
    var use_gebi=false, use_css=false, use_layers=false;
    if (document.getElementById) { use_gebi=true; }
    else if (document.all) { use_css=true; }
    else if (document.layers) { use_layers=true; }
    // Logic to find position
    if (use_gebi && document.all) {
        x=AnchorPosition_getPageOffsetLeft(document.all[anchorname]);
        y=AnchorPosition_getPageOffsetTop(document.all[anchorname]);
    }
    else if (use_gebi) {
        var o=document.getElementById(anchorname);
        x=AnchorPosition_getPageOffsetLeft(o);
        y=AnchorPosition_getPageOffsetTop(o);
    }
    else if (use_css) {
        x=AnchorPosition_getPageOffsetLeft(document.all[anchorname]);
        y=AnchorPosition_getPageOffsetTop(document.all[anchorname]);
    }
    else if (use_layers) {
        var found=0;
        for (var i=0; i<document.anchors.length; i++) {
            if (document.anchors[i].name==anchorname) { found=1; break; }
        }
        if (found==0) {
            coordinates.x=0; coordinates.y=0; return coordinates;
        }
        x=document.anchors[i].x;
        y=document.anchors[i].y;
    }
    else {
        coordinates.x=0; coordinates.y=0; return coordinates;
    }
    coordinates.x=x;
    coordinates.y=y;
    return coordinates;
}

// getAnchorWindowPosition(anchorname)
//   This function returns an object having .x and .y properties which are the coordinates
//   of the named anchor, relative to the window
function getAnchorWindowPosition(anchorname) {
    var coordinates=getAnchorPosition(anchorname);
    var x=0;
    var y=0;
    if (document.getElementById) {
        if (isNaN(window.screenX)) {
            x=coordinates.x-document.body.scrollLeft+window.screenLeft;
            y=coordinates.y-document.body.scrollTop+window.screenTop;
        }
        else {
            x=coordinates.x+window.screenX+(window.outerWidth-window.innerWidth)-window.pageXOffset;
            y=coordinates.y+window.screenY+(window.outerHeight-24-window.innerHeight)-window.pageYOffset;
        }
    }
    else if (document.all) {
        x=coordinates.x-document.body.scrollLeft+window.screenLeft;
        y=coordinates.y-document.body.scrollTop+window.screenTop;
    }
    else if (document.layers) {
        x=coordinates.x+window.screenX+(window.outerWidth-window.innerWidth)-window.pageXOffset;
        y=coordinates.y+window.screenY+(window.outerHeight-24-window.innerHeight)-window.pageYOffset;
    }
    coordinates.x=x;
    coordinates.y=y;
    return coordinates;
}

// Functions for IE to get position of an object
function AnchorPosition_getPageOffsetLeft (el) {
    var ol=el.offsetLeft;
    while ((el=el.offsetParent) != null) { ol += el.offsetLeft; }
    return ol;
}
function AnchorPosition_getWindowOffsetLeft (el) {
    return AnchorPosition_getPageOffsetLeft(el)-document.body.scrollLeft;
}
function AnchorPosition_getPageOffsetTop (el) {
    var ot=el.offsetTop;
    while((el=el.offsetParent) != null) { ot += el.offsetTop; }
    return ot;
}
function AnchorPosition_getWindowOffsetTop (el) {
    return AnchorPosition_getPageOffsetTop(el)-document.body.scrollTop;
}

/* SOURCE FILE: PopupWindow.js */

/*
 PopupWindow.js
 Author: Matt Kruse
 Last modified: 02/16/04

 DESCRIPTION: This object allows you to easily and quickly popup a window
 in a certain place. The window can either be a DIV or a separate browser
 window.

 COMPATABILITY: Works with Netscape 4.x, 6.x, IE 5.x on Windows. Some small
 positioning errors - usually with Window positioning - occur on the
 Macintosh platform. Due to bugs in Netscape 4.x, populating the popup
 window with <STYLE> tags may cause errors.

 USAGE:
 // Create an object for a WINDOW popup
 var win = new PopupWindow();

 // Create an object for a DIV window using the DIV named 'mydiv'
 var win = new PopupWindow('mydiv');

 // Set the window to automatically hide itself when the user clicks
 // anywhere else on the page except the popup
 win.autoHide();

 // Show the window relative to the anchor name passed in
 win.showPopup(anchorname);

 // Hide the popup
 win.hidePopup();

 // Set the size of the popup window (only applies to WINDOW popups
 win.setSize(width,height);

 // Populate the contents of the popup window that will be shown. If you
 // change the contents while it is displayed, you will need to refresh()
 win.populate(string);

 // set the URL of the window, rather than populating its contents
 // manually
 win.setUrl("http://www.site.com/");

 // Refresh the contents of the popup
 win.refresh();

 // Specify how many pixels to the right of the anchor the popup will appear
 win.offsetX = 50;

 // Specify how many pixels below the anchor the popup will appear
 win.offsetY = 100;

 NOTES:
 1) Requires the functions in AnchorPosition.js

 2) Your anchor tag MUST contain both NAME and ID attributes which are the
 same. For example:
 <A NAME="test" ID="test"> </A>

 3) There must be at least a space between <A> </A> for IE5.5 to see the
 anchor tag correctly. Do not do <A></A> with no space.

 4) When a PopupWindow object is created, a handler for 'onmouseup' is
 attached to any event handler you may have already defined. Do NOT define
 an event handler for 'onmouseup' after you define a PopupWindow object or
 the autoHide() will not work correctly.
 */

// Set the position of the popup window based on the anchor
function PopupWindow_getXYPosition(anchorname) {
    var coordinates;
    if (this.type == "WINDOW") {
        coordinates = getAnchorWindowPosition(anchorname);
    }
    else {
        coordinates = getAnchorPosition(anchorname);
    }
    this.x = coordinates.x;
    this.y = coordinates.y;
}
// Set width/height of DIV/popup window
function PopupWindow_setSize(width,height) {
    this.width = width;
    this.height = height;
}
// Fill the window with contents
function PopupWindow_populate(contents) {
    this.contents = contents;
    this.populated = false;
}
// Set the URL to go to
function PopupWindow_setUrl(url) {
    this.url = url;
}
// Set the window popup properties
function PopupWindow_setWindowProperties(props) {
    this.windowProperties = props;
}
// Refresh the displayed contents of the popup
function PopupWindow_refresh() {
    if (this.divName != null) {
        // refresh the DIV object
        if (this.use_gebi) {
            document.getElementById(this.divName).innerHTML = this.contents;
        }
        else if (this.use_css) {
            document.all[this.divName].innerHTML = this.contents;
        }
        else if (this.use_layers) {
            var d = document.layers[this.divName];
            d.document.open();
            d.document.writeln(this.contents);
            d.document.close();
        }
    }
    else {
        if (this.popupWindow != null && !this.popupWindow.closed) {
            if (this.url!="") {
                this.popupWindow.location.href=this.url;
            }
            else {
                this.popupWindow.document.open();
                this.popupWindow.document.writeln(this.contents);
                this.popupWindow.document.close();
            }
            this.popupWindow.focus();
        }
    }
}
// Position and show the popup, relative to an anchor object
function PopupWindow_showPopup(anchorname) {
    this.getXYPosition(anchorname);
    this.x += this.offsetX;
    this.y += this.offsetY;
    if (!this.populated && (this.contents != "")) {
        this.populated = true;
        this.refresh();
    }
    if (this.divName != null) {
        // Show the DIV object
        if (this.use_gebi) {
            document.getElementById(this.divName).style.left = this.x + "px";
            document.getElementById(this.divName).style.top = this.y;
            document.getElementById(this.divName).style.visibility = "visible";
        }
        else if (this.use_css) {
            document.all[this.divName].style.left = this.x;
            document.all[this.divName].style.top = this.y;
            document.all[this.divName].style.visibility = "visible";
        }
        else if (this.use_layers) {
            document.layers[this.divName].left = this.x;
            document.layers[this.divName].top = this.y;
            document.layers[this.divName].visibility = "visible";
        }
    }
    else {
        if (this.popupWindow == null || this.popupWindow.closed) {
            // If the popup window will go off-screen, move it so it doesn't
            if (this.x<0) { this.x=0; }
            if (this.y<0) { this.y=0; }
            if (screen && screen.availHeight) {
                if ((this.y + this.height) > screen.availHeight) {
                    this.y = screen.availHeight - this.height;
                }
            }
            if (screen && screen.availWidth) {
                if ((this.x + this.width) > screen.availWidth) {
                    this.x = screen.availWidth - this.width;
                }
            }
            var avoidAboutBlank = window.opera || ( document.layers && !navigator.mimeTypes['*'] ) || navigator.vendor == 'KDE' || ( document.childNodes && !document.all && !navigator.taintEnabled );
            this.popupWindow = window.open(avoidAboutBlank?"":"about:blank","window_"+anchorname,this.windowProperties+",width="+this.width+",height="+this.height+",screenX="+this.x+",left="+this.x+",screenY="+this.y+",top="+this.y+"");
        }
        this.refresh();
    }
}
// Hide the popup
function PopupWindow_hidePopup() {
    if (this.divName != null) {
        if (this.use_gebi) {
            document.getElementById(this.divName).style.visibility = "hidden";
        }
        else if (this.use_css) {
            document.all[this.divName].style.visibility = "hidden";
        }
        else if (this.use_layers) {
            document.layers[this.divName].visibility = "hidden";
        }
    }
    else {
        if (this.popupWindow && !this.popupWindow.closed) {
            this.popupWindow.close();
            this.popupWindow = null;
        }
    }
}
// Pass an event and return whether or not it was the popup DIV that was clicked
function PopupWindow_isClicked(e) {
    if (this.divName != null) {
        if (this.use_layers) {
            var clickX = e.pageX;
            var clickY = e.pageY;
            var t = document.layers[this.divName];
            if ((clickX > t.left) && (clickX < t.left+t.clip.width) && (clickY > t.top) && (clickY < t.top+t.clip.height)) {
                return true;
            }
            else { return false; }
        }
        else if (document.all) { // Need to hard-code this to trap IE for error-handling
            var t = window.event.srcElement;
            while (t.parentElement != null) {
                if (t.id==this.divName) {
                    return true;
                }
                t = t.parentElement;
            }
            return false;
        }
        else if (this.use_gebi && e) {
            var t = e.originalTarget;
            while (t.parentNode != null) {
                if (t.id==this.divName) {
                    return true;
                }
                t = t.parentNode;
            }
            return false;
        }
        return false;
    }
    return false;
}

// Check an onMouseDown event to see if we should hide
function PopupWindow_hideIfNotClicked(e) {
    if (this.autoHideEnabled && !this.isClicked(e)) {
        this.hidePopup();
    }
}
// Call this to make the DIV disable automatically when mouse is clicked outside it
function PopupWindow_autoHide() {
    this.autoHideEnabled = true;
}
// This global function checks all PopupWindow objects onmouseup to see if they should be hidden
function PopupWindow_hidePopupWindows(e) {
    for (var i=0; i<popupWindowObjects.length; i++) {
        if (popupWindowObjects[i] != null) {
            var p = popupWindowObjects[i];
            p.hideIfNotClicked(e);
        }
    }
}
// Run this immediately to attach the event listener
function PopupWindow_attachListener() {
    if (document.layers) {
        document.captureEvents(Event.MOUSEUP);
    }
    window.popupWindowOldEventListener = document.onmouseup;
    if (window.popupWindowOldEventListener != null) {
        document.onmouseup = new Function("window.popupWindowOldEventListener(); PopupWindow_hidePopupWindows();");
    }
    else {
        document.onmouseup = PopupWindow_hidePopupWindows;
    }
}
// CONSTRUCTOR for the PopupWindow object
// Pass it a DIV name to use a DHTML popup, otherwise will default to window popup
function PopupWindow() {
    if (!window.popupWindowIndex) { window.popupWindowIndex = 0; }
    if (!window.popupWindowObjects) { window.popupWindowObjects = new Array(); }
    if (!window.listenerAttached) {
        window.listenerAttached = true;
        PopupWindow_attachListener();
    }
    this.index = popupWindowIndex++;
    popupWindowObjects[this.index] = this;
    this.divName = null;
    this.popupWindow = null;
    this.width=0;
    this.height=0;
    this.populated = false;
    this.visible = false;
    this.autoHideEnabled = false;

    this.contents = "";
    this.url="";
    this.windowProperties="toolbar=no,location=no,status=no,menubar=no,scrollbars=auto,resizable,alwaysRaised,dependent,titlebar=no";
    if (arguments.length>0) {
        this.type="DIV";
        this.divName = arguments[0];
    }
    else {
        this.type="WINDOW";
    }
    this.use_gebi = false;
    this.use_css = false;
    this.use_layers = false;
    if (document.getElementById) { this.use_gebi = true; }
    else if (document.all) { this.use_css = true; }
    else if (document.layers) { this.use_layers = true; }
    else { this.type = "WINDOW"; }
    this.offsetX = 0;
    this.offsetY = 0;
    // Method mappings
    this.getXYPosition = PopupWindow_getXYPosition;
    this.populate = PopupWindow_populate;
    this.setUrl = PopupWindow_setUrl;
    this.setWindowProperties = PopupWindow_setWindowProperties;
    this.refresh = PopupWindow_refresh;
    this.showPopup = PopupWindow_showPopup;
    this.hidePopup = PopupWindow_hidePopup;
    this.setSize = PopupWindow_setSize;
    this.isClicked = PopupWindow_isClicked;
    this.autoHide = PopupWindow_autoHide;
    this.hideIfNotClicked = PopupWindow_hideIfNotClicked;
}

/* SOURCE FILE: ColorPicker2.js */

/*
 Last modified: 02/24/2003

 DESCRIPTION: This widget is used to select a color, in hexadecimal #RRGGBB
 form. It uses a color "swatch" to display the standard 216-color web-safe
 palette. The user can then click on a color to select it.

 COMPATABILITY: See notes in AnchorPosition.js and PopupWindow.js.
 Only the latest DHTML-capable browsers will show the color and hex values
 at the bottom as your mouse goes over them.

 USAGE:
 // Create a new ColorPicker object using DHTML popup
 var cp = new ColorPicker();

 // Create a new ColorPicker object using Window Popup
 var cp = new ColorPicker('window');

 // Add a link in your page to trigger the popup. For example:
 <A HREF="#" onClick="cp.show('pick');return false;" NAME="pick" ID="pick">Pick</A>

 // Or use the built-in "select" function to do the dirty work for you:
 <A HREF="#" onClick="cp.select(document.forms[0].color,'pick');return false;" NAME="pick" ID="pick">Pick</A>

 // If using DHTML popup, write out the required DIV tag near the bottom
 // of your page.
 <SCRIPT LANGUAGE="JavaScript">cp.writeDiv()</SCRIPT>

 // Write the 'pickColor' function that will be called when the user clicks
 // a color and do something with the value. This is only required if you
 // want to do something other than simply populate a form field, which is
 // what the 'select' function will give you.
 function pickColor(color) {
 field.value = color;
 }

 NOTES:
 1) Requires the functions in AnchorPosition.js and PopupWindow.js

 2) Your anchor tag MUST contain both NAME and ID attributes which are the
 same. For example:
 <A NAME="test" ID="test"> </A>

 3) There must be at least a space between <A> </A> for IE5.5 to see the
 anchor tag correctly. Do not do <A></A> with no space.

 4) When a ColorPicker object is created, a handler for 'onmouseup' is
 attached to any event handler you may have already defined. Do NOT define
 an event handler for 'onmouseup' after you define a ColorPicker object or
 the color picker will not hide itself correctly.
 */
ColorPicker_targetInput = null;
function ColorPicker_writeDiv() {
    document.writeln("<DIV ID=\"colorPickerDiv\" STYLE=\"position:absolute;visibility:hidden;\"> </DIV>");
}

function ColorPicker_show(anchorname) {
    this.showPopup(anchorname);
}

function ColorPicker_pickColor(color,obj) {
    obj.hidePopup();
    pickColor(color);
}

// A Default "pickColor" function to accept the color passed back from popup.
// User can over-ride this with their own function.
function pickColor(color) {
    if (ColorPicker_targetInput==null) {
        alert("Target Input is null, which means you either didn't use the 'select' function or you have no defined your own 'pickColor' function to handle the picked color!");
        return;
    }
    ColorPicker_targetInput.value = color;
}

// This function is the easiest way to popup the window, select a color, and
// have the value populate a form field, which is what most people want to do.
function ColorPicker_select(inputobj,linkname) {
    if (inputobj.type!="text" && inputobj.type!="hidden" && inputobj.type!="textarea") {
        alert("colorpicker.select: Input object passed is not a valid form input object");
        window.ColorPicker_targetInput=null;
        return;
    }
    window.ColorPicker_targetInput = inputobj;
    this.show(linkname);
}

// This function runs when you move your mouse over a color block, if you have a newer browser
function ColorPicker_highlightColor(c) {
    var thedoc = (arguments.length>1)?arguments[1]:window.document;
    var d = thedoc.getElementById("colorPickerSelectedColor");
    d.style.backgroundColor = c;
    d = thedoc.getElementById("colorPickerSelectedColorValue");
    d.innerHTML = c;
}

function ColorPicker() {
    var windowMode = false;
    // Create a new PopupWindow object
    if (arguments.length==0) {
        var divname = "colorPickerDiv";
    }
    else if (arguments[0] == "window") {
        var divname = '';
        windowMode = true;
    }
    else {
        var divname = arguments[0];
    }

    if (divname != "") {
        var cp = new PopupWindow(divname);
    }
    else {
        var cp = new PopupWindow();
        cp.setSize(225,250);
    }

    // Object variables
    cp.currentValue = "#FFFFFF";

    // Method Mappings
    cp.writeDiv = ColorPicker_writeDiv;
    cp.highlightColor = ColorPicker_highlightColor;
    cp.show = ColorPicker_show;
    cp.select = ColorPicker_select;

    // Code to populate color picker window
    var colors = new Array(	"#4180B6","#69AEE7","#000000","#000033","#000066","#000099","#0000CC","#0000FF","#330000","#330033","#330066","#330099",
        "#3300CC","#3300FF","#660000","#660033","#660066","#660099","#6600CC","#6600FF","#990000","#990033","#990066","#990099",
        "#9900CC","#9900FF","#CC0000","#CC0033","#CC0066","#CC0099","#CC00CC","#CC00FF","#FF0000","#FF0033","#FF0066","#FF0099",
        "#FF00CC","#FF00FF","#7FFFFF","#7FFFFF","#7FF7F7","#7FEFEF","#7FE7E7","#7FDFDF","#7FD7D7","#7FCFCF","#7FC7C7","#7FBFBF",
        "#7FB7B7","#7FAFAF","#7FA7A7","#7F9F9F","#7F9797","#7F8F8F","#7F8787","#7F7F7F","#7F7777","#7F6F6F","#7F6767","#7F5F5F",
        "#7F5757","#7F4F4F","#7F4747","#7F3F3F","#7F3737","#7F2F2F","#7F2727","#7F1F1F","#7F1717","#7F0F0F","#7F0707","#7F0000",

        "#4180B6","#69AEE7","#003300","#003333","#003366","#003399","#0033CC","#0033FF","#333300","#333333","#333366","#333399",
        "#3333CC","#3333FF","#663300","#663333","#663366","#663399","#6633CC","#6633FF","#993300","#993333","#993366","#993399",
        "#9933CC","#9933FF","#CC3300","#CC3333","#CC3366","#CC3399","#CC33CC","#CC33FF","#FF3300","#FF3333","#FF3366","#FF3399",
        "#FF33CC","#FF33FF","#FF7FFF","#FF7FFF","#F77FF7","#EF7FEF","#E77FE7","#DF7FDF","#D77FD7","#CF7FCF","#C77FC7","#BF7FBF",
        "#B77FB7","#AF7FAF","#A77FA7","#9F7F9F","#977F97","#8F7F8F","#877F87","#7F7F7F","#777F77","#6F7F6F","#677F67","#5F7F5F",
        "#577F57","#4F7F4F","#477F47","#3F7F3F","#377F37","#2F7F2F","#277F27","#1F7F1F","#177F17","#0F7F0F","#077F07","#007F00",

        "#4180B6","#69AEE7","#006600","#006633","#006666","#006699","#0066CC","#0066FF","#336600","#336633","#336666","#336699",
        "#3366CC","#3366FF","#666600","#666633","#666666","#666699","#6666CC","#6666FF","#996600","#996633","#996666","#996699",
        "#9966CC","#9966FF","#CC6600","#CC6633","#CC6666","#CC6699","#CC66CC","#CC66FF","#FF6600","#FF6633","#FF6666","#FF6699",
        "#FF66CC","#FF66FF","#FFFF7F","#FFFF7F","#F7F77F","#EFEF7F","#E7E77F","#DFDF7F","#D7D77F","#CFCF7F","#C7C77F","#BFBF7F",
        "#B7B77F","#AFAF7F","#A7A77F","#9F9F7F","#97977F","#8F8F7F","#87877F","#7F7F7F","#77777F","#6F6F7F","#67677F","#5F5F7F",
        "#57577F","#4F4F7F","#47477F","#3F3F7F","#37377F","#2F2F7F","#27277F","#1F1F7F","#17177F","#0F0F7F","#07077F","#00007F",

        "#4180B6","#69AEE7","#009900","#009933","#009966","#009999","#0099CC","#0099FF","#339900","#339933","#339966","#339999",
        "#3399CC","#3399FF","#669900","#669933","#669966","#669999","#6699CC","#6699FF","#999900","#999933","#999966","#999999",
        "#9999CC","#9999FF","#CC9900","#CC9933","#CC9966","#CC9999","#CC99CC","#CC99FF","#FF9900","#FF9933","#FF9966","#FF9999",
        "#FF99CC","#FF99FF","#3FFFFF","#3FFFFF","#3FF7F7","#3FEFEF","#3FE7E7","#3FDFDF","#3FD7D7","#3FCFCF","#3FC7C7","#3FBFBF",
        "#3FB7B7","#3FAFAF","#3FA7A7","#3F9F9F","#3F9797","#3F8F8F","#3F8787","#3F7F7F","#3F7777","#3F6F6F","#3F6767","#3F5F5F",
        "#3F5757","#3F4F4F","#3F4747","#3F3F3F","#3F3737","#3F2F2F","#3F2727","#3F1F1F","#3F1717","#3F0F0F","#3F0707","#3F0000",

        "#4180B6","#69AEE7","#00CC00","#00CC33","#00CC66","#00CC99","#00CCCC","#00CCFF","#33CC00","#33CC33","#33CC66","#33CC99",
        "#33CCCC","#33CCFF","#66CC00","#66CC33","#66CC66","#66CC99","#66CCCC","#66CCFF","#99CC00","#99CC33","#99CC66","#99CC99",
        "#99CCCC","#99CCFF","#CCCC00","#CCCC33","#CCCC66","#CCCC99","#CCCCCC","#CCCCFF","#FFCC00","#FFCC33","#FFCC66","#FFCC99",
        "#FFCCCC","#FFCCFF","#FF3FFF","#FF3FFF","#F73FF7","#EF3FEF","#E73FE7","#DF3FDF","#D73FD7","#CF3FCF","#C73FC7","#BF3FBF",
        "#B73FB7","#AF3FAF","#A73FA7","#9F3F9F","#973F97","#8F3F8F","#873F87","#7F3F7F","#773F77","#6F3F6F","#673F67","#5F3F5F",
        "#573F57","#4F3F4F","#473F47","#3F3F3F","#373F37","#2F3F2F","#273F27","#1F3F1F","#173F17","#0F3F0F","#073F07","#003F00",

        "#4180B6","#69AEE7","#00FF00","#00FF33","#00FF66","#00FF99","#00FFCC","#00FFFF","#33FF00","#33FF33","#33FF66","#33FF99",
        "#33FFCC","#33FFFF","#66FF00","#66FF33","#66FF66","#66FF99","#66FFCC","#66FFFF","#99FF00","#99FF33","#99FF66","#99FF99",
        "#99FFCC","#99FFFF","#CCFF00","#CCFF33","#CCFF66","#CCFF99","#CCFFCC","#CCFFFF","#FFFF00","#FFFF33","#FFFF66","#FFFF99",
        "#FFFFCC","#FFFFFF","#FFFF3F","#FFFF3F","#F7F73F","#EFEF3F","#E7E73F","#DFDF3F","#D7D73F","#CFCF3F","#C7C73F","#BFBF3F",
        "#B7B73F","#AFAF3F","#A7A73F","#9F9F3F","#97973F","#8F8F3F","#87873F","#7F7F3F","#77773F","#6F6F3F","#67673F","#5F5F3F",
        "#57573F","#4F4F3F","#47473F","#3F3F3F","#37373F","#2F2F3F","#27273F","#1F1F3F","#17173F","#0F0F3F","#07073F","#00003F",

        "#4180B6","#69AEE7","#FFFFFF","#FFEEEE","#FFDDDD","#FFCCCC","#FFBBBB","#FFAAAA","#FF9999","#FF8888","#FF7777","#FF6666",
        "#FF5555","#FF4444","#FF3333","#FF2222","#FF1111","#FF0000","#FF0000","#FF0000","#FF0000","#EE0000","#DD0000","#CC0000",
        "#BB0000","#AA0000","#990000","#880000","#770000","#660000","#550000","#440000","#330000","#220000","#110000","#000000",
        "#000000","#000000","#000000","#001111","#002222","#003333","#004444","#005555","#006666","#007777","#008888","#009999",
        "#00AAAA","#00BBBB","#00CCCC","#00DDDD","#00EEEE","#00FFFF","#00FFFF","#00FFFF","#00FFFF","#11FFFF","#22FFFF","#33FFFF",
        "#44FFFF","#55FFFF","#66FFFF","#77FFFF","#88FFFF","#99FFFF","#AAFFFF","#BBFFFF","#CCFFFF","#DDFFFF","#EEFFFF","#FFFFFF",

        "#4180B6","#69AEE7","#FFFFFF","#EEFFEE","#DDFFDD","#CCFFCC","#BBFFBB","#AAFFAA","#99FF99","#88FF88","#77FF77","#66FF66",
        "#55FF55","#44FF44","#33FF33","#22FF22","#11FF11","#00FF00","#00FF00","#00FF00","#00FF00","#00EE00","#00DD00","#00CC00",
        "#00BB00","#00AA00","#009900","#008800","#007700","#006600","#005500","#004400","#003300","#002200","#001100","#000000",
        "#000000","#000000","#000000","#110011","#220022","#330033","#440044","#550055","#660066","#770077","#880088","#990099",
        "#AA00AA","#BB00BB","#CC00CC","#DD00DD","#EE00EE","#FF00FF","#FF00FF","#FF00FF","#FF00FF","#FF11FF","#FF22FF","#FF33FF",
        "#FF44FF","#FF55FF","#FF66FF","#FF77FF","#FF88FF","#FF99FF","#FFAAFF","#FFBBFF","#FFCCFF","#FFDDFF","#FFEEFF","#FFFFFF",

        "#4180B6","#69AEE7","#FFFFFF","#EEEEFF","#DDDDFF","#CCCCFF","#BBBBFF","#AAAAFF","#9999FF","#8888FF","#7777FF","#6666FF",
        "#5555FF","#4444FF","#3333FF","#2222FF","#1111FF","#0000FF","#0000FF","#0000FF","#0000FF","#0000EE","#0000DD","#0000CC",
        "#0000BB","#0000AA","#000099","#000088","#000077","#000066","#000055","#000044","#000033","#000022","#000011","#000000",
        "#000000","#000000","#000000","#111100","#222200","#333300","#444400","#555500","#666600","#777700","#888800","#999900",
        "#AAAA00","#BBBB00","#CCCC00","#DDDD00","#EEEE00","#FFFF00","#FFFF00","#FFFF00","#FFFF00","#FFFF11","#FFFF22","#FFFF33",
        "#FFFF44","#FFFF55","#FFFF66","#FFFF77","#FFFF88","#FFFF99","#FFFFAA","#FFFFBB","#FFFFCC","#FFFFDD","#FFFFEE","#FFFFFF",

        "#4180B6","#69AEE7","#FFFFFF","#FFFFFF","#FBFBFB","#F7F7F7","#F3F3F3","#EFEFEF","#EBEBEB","#E7E7E7","#E3E3E3","#DFDFDF",
        "#DBDBDB","#D7D7D7","#D3D3D3","#CFCFCF","#CBCBCB","#C7C7C7","#C3C3C3","#BFBFBF","#BBBBBB","#B7B7B7","#B3B3B3","#AFAFAF",
        "#ABABAB","#A7A7A7","#A3A3A3","#9F9F9F","#9B9B9B","#979797","#939393","#8F8F8F","#8B8B8B","#878787","#838383","#7F7F7F",
        "#7B7B7B","#777777","#737373","#6F6F6F","#6B6B6B","#676767","#636363","#5F5F5F","#5B5B5B","#575757","#535353","#4F4F4F",
        "#4B4B4B","#474747","#434343","#3F3F3F","#3B3B3B","#373737","#333333","#2F2F2F","#2B2B2B","#272727","#232323","#1F1F1F",
        "#1B1B1B","#171717","#131313","#0F0F0F","#0B0B0B","#070707","#030303","#000000","#000000","#000000","#000000","#000000");
    var total = colors.length;
    var width = 72;
    var cp_contents = "";
    var windowRef = (windowMode)?"window.opener.":"";
    if (windowMode) {
        cp_contents += "<html><head><title>Select Color</title></head>";
        cp_contents += "<body marginwidth=0 marginheight=0 leftmargin=0 topmargin=0><span style='text-align: center;'>";
    }
    cp_contents += "<table style='border: none;' cellspacing=0 cellpadding=0>";
    var use_highlight = (document.getElementById || document.all)?true:false;
    for (var i=0; i<total; i++) {
        if ((i % width) == 0) { cp_contents += "<tr>"; }
        if (use_highlight) { var mo = 'onMouseOver="'+windowRef+'ColorPicker_highlightColor(\''+colors[i]+'\',window.document)"'; }
        else { mo = ""; }
        cp_contents += '<td style="background-color: '+colors[i]+';"><a href="javascript:void()" onclick="'+windowRef+'ColorPicker_pickColor(\''+colors[i]+'\','+windowRef+'window.popupWindowObjects['+cp.index+']);return false;" '+mo+'>&nbsp;</a></td>';
        if ( ((i+1)>=total) || (((i+1) % width) == 0)) {
            cp_contents += "</tr>";
        }
    }
    // If the browser supports dynamically changing TD cells, add the fancy stuff
    if (document.getElementById) {
        var width1 = Math.floor(width/2);
        var width2 = width = width1;
        cp_contents += "<tr><td colspan='"+width1+"' style='background-color: #FFF;' ID='colorPickerSelectedColor'>&nbsp;</td><td colspan='"+width2+"' style='text-align: center;' id='colorPickerSelectedColorValue'>#FFFFFF</td></tr>";
    }
    cp_contents += "</table>";
    if (windowMode) {
        cp_contents += "</span></body></html>";
    }
    // end populate code

    // Write the contents to the popup object
    cp.populate(cp_contents+"\n");
    // Move the table down a bit so you can see it
    cp.offsetY = 25;
    cp.autoHide();
    return cp;
}

//colorpicker.min.js
function getAnchorPosition(a){var b=new Object,c=0,d=0,e=!1,f=!1,g=!1;if(document.getElementById?e=!0:document.all?f=!0:document.layers&&(g=!0),e&&document.all)c=AnchorPosition_getPageOffsetLeft(document.all[a]),d=AnchorPosition_getPageOffsetTop(document.all[a]);else if(e){var h=document.getElementById(a);c=AnchorPosition_getPageOffsetLeft(h),d=AnchorPosition_getPageOffsetTop(h)}else if(f)c=AnchorPosition_getPageOffsetLeft(document.all[a]),d=AnchorPosition_getPageOffsetTop(document.all[a]);else{if(!g)return b.x=0,b.y=0,b;for(var i=0,j=0;j<document.anchors.length;j++)if(document.anchors[j].name==a){i=1;break}if(0==i)return b.x=0,b.y=0,b;c=document.anchors[j].x,d=document.anchors[j].y}return b.x=c,b.y=d,b}function getAnchorWindowPosition(a){var b=getAnchorPosition(a),c=0,d=0;return document.getElementById?isNaN(window.screenX)?(c=b.x-document.body.scrollLeft+window.screenLeft,d=b.y-document.body.scrollTop+window.screenTop):(c=b.x+window.screenX+(window.outerWidth-window.innerWidth)-window.pageXOffset,d=b.y+window.screenY+(window.outerHeight-24-window.innerHeight)-window.pageYOffset):document.all?(c=b.x-document.body.scrollLeft+window.screenLeft,d=b.y-document.body.scrollTop+window.screenTop):document.layers&&(c=b.x+window.screenX+(window.outerWidth-window.innerWidth)-window.pageXOffset,d=b.y+window.screenY+(window.outerHeight-24-window.innerHeight)-window.pageYOffset),b.x=c,b.y=d,b}function AnchorPosition_getPageOffsetLeft(a){for(var b=a.offsetLeft;null!=(a=a.offsetParent);)b+=a.offsetLeft;return b}function AnchorPosition_getWindowOffsetLeft(a){return AnchorPosition_getPageOffsetLeft(a)-document.body.scrollLeft}function AnchorPosition_getPageOffsetTop(a){for(var b=a.offsetTop;null!=(a=a.offsetParent);)b+=a.offsetTop;return b}function AnchorPosition_getWindowOffsetTop(a){return AnchorPosition_getPageOffsetTop(a)-document.body.scrollTop}function PopupWindow_getXYPosition(a){var b;b="WINDOW"==this.type?getAnchorWindowPosition(a):getAnchorPosition(a),this.x=b.x,this.y=b.y}function PopupWindow_setSize(a,b){this.width=a,this.height=b}function PopupWindow_populate(a){this.contents=a,this.populated=!1}function PopupWindow_setUrl(a){this.url=a}function PopupWindow_setWindowProperties(a){this.windowProperties=a}function PopupWindow_refresh(){if(null!=this.divName){if(this.use_gebi)document.getElementById(this.divName).innerHTML=this.contents;else if(this.use_css)document.all[this.divName].innerHTML=this.contents;else if(this.use_layers){var a=document.layers[this.divName];a.document.open(),a.document.writeln(this.contents),a.document.close()}}else null==this.popupWindow||this.popupWindow.closed||(""!=this.url?this.popupWindow.location.href=this.url:(this.popupWindow.document.open(),this.popupWindow.document.writeln(this.contents),this.popupWindow.document.close()),this.popupWindow.focus())}function PopupWindow_showPopup(a){if(this.getXYPosition(a),this.x+=this.offsetX,this.y+=this.offsetY,this.populated||""==this.contents||(this.populated=!0,this.refresh()),null!=this.divName)this.use_gebi?(document.getElementById(this.divName).style.left=this.x+"px",document.getElementById(this.divName).style.top=this.y,document.getElementById(this.divName).style.visibility="visible"):this.use_css?(document.all[this.divName].style.left=this.x,document.all[this.divName].style.top=this.y,document.all[this.divName].style.visibility="visible"):this.use_layers&&(document.layers[this.divName].left=this.x,document.layers[this.divName].top=this.y,document.layers[this.divName].visibility="visible");else{if(null==this.popupWindow||this.popupWindow.closed){this.x<0&&(this.x=0),this.y<0&&(this.y=0),screen&&screen.availHeight&&this.y+this.height>screen.availHeight&&(this.y=screen.availHeight-this.height),screen&&screen.availWidth&&this.x+this.width>screen.availWidth&&(this.x=screen.availWidth-this.width);var b=window.opera||document.layers&&!navigator.mimeTypes["*"]||"KDE"==navigator.vendor||document.childNodes&&!document.all&&!navigator.taintEnabled;this.popupWindow=window.open(b?"":"about:blank","window_"+a,this.windowProperties+",width="+this.width+",height="+this.height+",screenX="+this.x+",left="+this.x+",screenY="+this.y+",top="+this.y)}this.refresh()}}function PopupWindow_hidePopup(){null!=this.divName?this.use_gebi?document.getElementById(this.divName).style.visibility="hidden":this.use_css?document.all[this.divName].style.visibility="hidden":this.use_layers&&(document.layers[this.divName].visibility="hidden"):this.popupWindow&&!this.popupWindow.closed&&(this.popupWindow.close(),this.popupWindow=null)}function PopupWindow_isClicked(a){if(null!=this.divName){if(this.use_layers){var b=a.pageX,c=a.pageY,d=document.layers[this.divName];return b>d.left&&b<d.left+d.clip.width&&c>d.top&&c<d.top+d.clip.height?!0:!1}if(document.all){for(var d=window.event.srcElement;null!=d.parentElement;){if(d.id==this.divName)return!0;d=d.parentElement}return!1}if(this.use_gebi&&a){for(var d=a.originalTarget;null!=d.parentNode;){if(d.id==this.divName)return!0;d=d.parentNode}return!1}return!1}return!1}function PopupWindow_hideIfNotClicked(a){this.autoHideEnabled&&!this.isClicked(a)&&this.hidePopup()}function PopupWindow_autoHide(){this.autoHideEnabled=!0}function PopupWindow_hidePopupWindows(a){for(var b=0;b<popupWindowObjects.length;b++)if(null!=popupWindowObjects[b]){var c=popupWindowObjects[b];c.hideIfNotClicked(a)}}function PopupWindow_attachListener(){document.layers&&document.captureEvents(Event.MOUSEUP),window.popupWindowOldEventListener=document.onmouseup,document.onmouseup=null!=window.popupWindowOldEventListener?new Function("window.popupWindowOldEventListener(); PopupWindow_hidePopupWindows();"):PopupWindow_hidePopupWindows}function PopupWindow(){window.popupWindowIndex||(window.popupWindowIndex=0),window.popupWindowObjects||(window.popupWindowObjects=new Array),window.listenerAttached||(window.listenerAttached=!0,PopupWindow_attachListener()),this.index=popupWindowIndex++,popupWindowObjects[this.index]=this,this.divName=null,this.popupWindow=null,this.width=0,this.height=0,this.populated=!1,this.visible=!1,this.autoHideEnabled=!1,this.contents="",this.url="",this.windowProperties="toolbar=no,location=no,status=no,menubar=no,scrollbars=auto,resizable,alwaysRaised,dependent,titlebar=no",arguments.length>0?(this.type="DIV",this.divName=arguments[0]):this.type="WINDOW",this.use_gebi=!1,this.use_css=!1,this.use_layers=!1,document.getElementById?this.use_gebi=!0:document.all?this.use_css=!0:document.layers?this.use_layers=!0:this.type="WINDOW",this.offsetX=0,this.offsetY=0,this.getXYPosition=PopupWindow_getXYPosition,this.populate=PopupWindow_populate,this.setUrl=PopupWindow_setUrl,this.setWindowProperties=PopupWindow_setWindowProperties,this.refresh=PopupWindow_refresh,this.showPopup=PopupWindow_showPopup,this.hidePopup=PopupWindow_hidePopup,this.setSize=PopupWindow_setSize,this.isClicked=PopupWindow_isClicked,this.autoHide=PopupWindow_autoHide,this.hideIfNotClicked=PopupWindow_hideIfNotClicked}function ColorPicker_writeDiv(){document.writeln('<DIV ID="colorPickerDiv" STYLE="position:absolute;visibility:hidden;"> </DIV>')}function ColorPicker_show(a){this.showPopup(a)}function ColorPicker_pickColor(a,b){b.hidePopup(),pickColor(a)}function pickColor(a){return null==ColorPicker_targetInput?void alert("Target Input is null, which means you either didn't use the 'select' function or you have no defined your own 'pickColor' function to handle the picked color!"):void(ColorPicker_targetInput.value=a)}function ColorPicker_select(a,b){return"text"!=a.type&&"hidden"!=a.type&&"textarea"!=a.type?(alert("colorpicker.select: Input object passed is not a valid form input object"),void(window.ColorPicker_targetInput=null)):(window.ColorPicker_targetInput=a,void this.show(b))}function ColorPicker_highlightColor(a){var b=arguments.length>1?arguments[1]:window.document,c=b.getElementById("colorPickerSelectedColor");c.style.backgroundColor=a,c=b.getElementById("colorPickerSelectedColorValue"),c.innerHTML=a}function ColorPicker(){var a=!1;if(0==arguments.length)var b="colorPickerDiv";else if("window"==arguments[0]){var b="";a=!0}else var b=arguments[0];if(""!=b)var c=new PopupWindow(b);else{var c=new PopupWindow;c.setSize(225,250)}c.currentValue="#FFFFFF",c.writeDiv=ColorPicker_writeDiv,c.highlightColor=ColorPicker_highlightColor,c.show=ColorPicker_show,c.select=ColorPicker_select;var d=new Array("#4180B6","#69AEE7","#000000","#000033","#000066","#000099","#0000CC","#0000FF","#330000","#330033","#330066","#330099","#3300CC","#3300FF","#660000","#660033","#660066","#660099","#6600CC","#6600FF","#990000","#990033","#990066","#990099","#9900CC","#9900FF","#CC0000","#CC0033","#CC0066","#CC0099","#CC00CC","#CC00FF","#FF0000","#FF0033","#FF0066","#FF0099","#FF00CC","#FF00FF","#7FFFFF","#7FFFFF","#7FF7F7","#7FEFEF","#7FE7E7","#7FDFDF","#7FD7D7","#7FCFCF","#7FC7C7","#7FBFBF","#7FB7B7","#7FAFAF","#7FA7A7","#7F9F9F","#7F9797","#7F8F8F","#7F8787","#7F7F7F","#7F7777","#7F6F6F","#7F6767","#7F5F5F","#7F5757","#7F4F4F","#7F4747","#7F3F3F","#7F3737","#7F2F2F","#7F2727","#7F1F1F","#7F1717","#7F0F0F","#7F0707","#7F0000","#4180B6","#69AEE7","#003300","#003333","#003366","#003399","#0033CC","#0033FF","#333300","#333333","#333366","#333399","#3333CC","#3333FF","#663300","#663333","#663366","#663399","#6633CC","#6633FF","#993300","#993333","#993366","#993399","#9933CC","#9933FF","#CC3300","#CC3333","#CC3366","#CC3399","#CC33CC","#CC33FF","#FF3300","#FF3333","#FF3366","#FF3399","#FF33CC","#FF33FF","#FF7FFF","#FF7FFF","#F77FF7","#EF7FEF","#E77FE7","#DF7FDF","#D77FD7","#CF7FCF","#C77FC7","#BF7FBF","#B77FB7","#AF7FAF","#A77FA7","#9F7F9F","#977F97","#8F7F8F","#877F87","#7F7F7F","#777F77","#6F7F6F","#677F67","#5F7F5F","#577F57","#4F7F4F","#477F47","#3F7F3F","#377F37","#2F7F2F","#277F27","#1F7F1F","#177F17","#0F7F0F","#077F07","#007F00","#4180B6","#69AEE7","#006600","#006633","#006666","#006699","#0066CC","#0066FF","#336600","#336633","#336666","#336699","#3366CC","#3366FF","#666600","#666633","#666666","#666699","#6666CC","#6666FF","#996600","#996633","#996666","#996699","#9966CC","#9966FF","#CC6600","#CC6633","#CC6666","#CC6699","#CC66CC","#CC66FF","#FF6600","#FF6633","#FF6666","#FF6699","#FF66CC","#FF66FF","#FFFF7F","#FFFF7F","#F7F77F","#EFEF7F","#E7E77F","#DFDF7F","#D7D77F","#CFCF7F","#C7C77F","#BFBF7F","#B7B77F","#AFAF7F","#A7A77F","#9F9F7F","#97977F","#8F8F7F","#87877F","#7F7F7F","#77777F","#6F6F7F","#67677F","#5F5F7F","#57577F","#4F4F7F","#47477F","#3F3F7F","#37377F","#2F2F7F","#27277F","#1F1F7F","#17177F","#0F0F7F","#07077F","#00007F","#4180B6","#69AEE7","#009900","#009933","#009966","#009999","#0099CC","#0099FF","#339900","#339933","#339966","#339999","#3399CC","#3399FF","#669900","#669933","#669966","#669999","#6699CC","#6699FF","#999900","#999933","#999966","#999999","#9999CC","#9999FF","#CC9900","#CC9933","#CC9966","#CC9999","#CC99CC","#CC99FF","#FF9900","#FF9933","#FF9966","#FF9999","#FF99CC","#FF99FF","#3FFFFF","#3FFFFF","#3FF7F7","#3FEFEF","#3FE7E7","#3FDFDF","#3FD7D7","#3FCFCF","#3FC7C7","#3FBFBF","#3FB7B7","#3FAFAF","#3FA7A7","#3F9F9F","#3F9797","#3F8F8F","#3F8787","#3F7F7F","#3F7777","#3F6F6F","#3F6767","#3F5F5F","#3F5757","#3F4F4F","#3F4747","#3F3F3F","#3F3737","#3F2F2F","#3F2727","#3F1F1F","#3F1717","#3F0F0F","#3F0707","#3F0000","#4180B6","#69AEE7","#00CC00","#00CC33","#00CC66","#00CC99","#00CCCC","#00CCFF","#33CC00","#33CC33","#33CC66","#33CC99","#33CCCC","#33CCFF","#66CC00","#66CC33","#66CC66","#66CC99","#66CCCC","#66CCFF","#99CC00","#99CC33","#99CC66","#99CC99","#99CCCC","#99CCFF","#CCCC00","#CCCC33","#CCCC66","#CCCC99","#CCCCCC","#CCCCFF","#FFCC00","#FFCC33","#FFCC66","#FFCC99","#FFCCCC","#FFCCFF","#FF3FFF","#FF3FFF","#F73FF7","#EF3FEF","#E73FE7","#DF3FDF","#D73FD7","#CF3FCF","#C73FC7","#BF3FBF","#B73FB7","#AF3FAF","#A73FA7","#9F3F9F","#973F97","#8F3F8F","#873F87","#7F3F7F","#773F77","#6F3F6F","#673F67","#5F3F5F","#573F57","#4F3F4F","#473F47","#3F3F3F","#373F37","#2F3F2F","#273F27","#1F3F1F","#173F17","#0F3F0F","#073F07","#003F00","#4180B6","#69AEE7","#00FF00","#00FF33","#00FF66","#00FF99","#00FFCC","#00FFFF","#33FF00","#33FF33","#33FF66","#33FF99","#33FFCC","#33FFFF","#66FF00","#66FF33","#66FF66","#66FF99","#66FFCC","#66FFFF","#99FF00","#99FF33","#99FF66","#99FF99","#99FFCC","#99FFFF","#CCFF00","#CCFF33","#CCFF66","#CCFF99","#CCFFCC","#CCFFFF","#FFFF00","#FFFF33","#FFFF66","#FFFF99","#FFFFCC","#FFFFFF","#FFFF3F","#FFFF3F","#F7F73F","#EFEF3F","#E7E73F","#DFDF3F","#D7D73F","#CFCF3F","#C7C73F","#BFBF3F","#B7B73F","#AFAF3F","#A7A73F","#9F9F3F","#97973F","#8F8F3F","#87873F","#7F7F3F","#77773F","#6F6F3F","#67673F","#5F5F3F","#57573F","#4F4F3F","#47473F","#3F3F3F","#37373F","#2F2F3F","#27273F","#1F1F3F","#17173F","#0F0F3F","#07073F","#00003F","#4180B6","#69AEE7","#FFFFFF","#FFEEEE","#FFDDDD","#FFCCCC","#FFBBBB","#FFAAAA","#FF9999","#FF8888","#FF7777","#FF6666","#FF5555","#FF4444","#FF3333","#FF2222","#FF1111","#FF0000","#FF0000","#FF0000","#FF0000","#EE0000","#DD0000","#CC0000","#BB0000","#AA0000","#990000","#880000","#770000","#660000","#550000","#440000","#330000","#220000","#110000","#000000","#000000","#000000","#000000","#001111","#002222","#003333","#004444","#005555","#006666","#007777","#008888","#009999","#00AAAA","#00BBBB","#00CCCC","#00DDDD","#00EEEE","#00FFFF","#00FFFF","#00FFFF","#00FFFF","#11FFFF","#22FFFF","#33FFFF","#44FFFF","#55FFFF","#66FFFF","#77FFFF","#88FFFF","#99FFFF","#AAFFFF","#BBFFFF","#CCFFFF","#DDFFFF","#EEFFFF","#FFFFFF","#4180B6","#69AEE7","#FFFFFF","#EEFFEE","#DDFFDD","#CCFFCC","#BBFFBB","#AAFFAA","#99FF99","#88FF88","#77FF77","#66FF66","#55FF55","#44FF44","#33FF33","#22FF22","#11FF11","#00FF00","#00FF00","#00FF00","#00FF00","#00EE00","#00DD00","#00CC00","#00BB00","#00AA00","#009900","#008800","#007700","#006600","#005500","#004400","#003300","#002200","#001100","#000000","#000000","#000000","#000000","#110011","#220022","#330033","#440044","#550055","#660066","#770077","#880088","#990099","#AA00AA","#BB00BB","#CC00CC","#DD00DD","#EE00EE","#FF00FF","#FF00FF","#FF00FF","#FF00FF","#FF11FF","#FF22FF","#FF33FF","#FF44FF","#FF55FF","#FF66FF","#FF77FF","#FF88FF","#FF99FF","#FFAAFF","#FFBBFF","#FFCCFF","#FFDDFF","#FFEEFF","#FFFFFF","#4180B6","#69AEE7","#FFFFFF","#EEEEFF","#DDDDFF","#CCCCFF","#BBBBFF","#AAAAFF","#9999FF","#8888FF","#7777FF","#6666FF","#5555FF","#4444FF","#3333FF","#2222FF","#1111FF","#0000FF","#0000FF","#0000FF","#0000FF","#0000EE","#0000DD","#0000CC","#0000BB","#0000AA","#000099","#000088","#000077","#000066","#000055","#000044","#000033","#000022","#000011","#000000","#000000","#000000","#000000","#111100","#222200","#333300","#444400","#555500","#666600","#777700","#888800","#999900","#AAAA00","#BBBB00","#CCCC00","#DDDD00","#EEEE00","#FFFF00","#FFFF00","#FFFF00","#FFFF00","#FFFF11","#FFFF22","#FFFF33","#FFFF44","#FFFF55","#FFFF66","#FFFF77","#FFFF88","#FFFF99","#FFFFAA","#FFFFBB","#FFFFCC","#FFFFDD","#FFFFEE","#FFFFFF","#4180B6","#69AEE7","#FFFFFF","#FFFFFF","#FBFBFB","#F7F7F7","#F3F3F3","#EFEFEF","#EBEBEB","#E7E7E7","#E3E3E3","#DFDFDF","#DBDBDB","#D7D7D7","#D3D3D3","#CFCFCF","#CBCBCB","#C7C7C7","#C3C3C3","#BFBFBF","#BBBBBB","#B7B7B7","#B3B3B3","#AFAFAF","#ABABAB","#A7A7A7","#A3A3A3","#9F9F9F","#9B9B9B","#979797","#939393","#8F8F8F","#8B8B8B","#878787","#838383","#7F7F7F","#7B7B7B","#777777","#737373","#6F6F6F","#6B6B6B","#676767","#636363","#5F5F5F","#5B5B5B","#575757","#535353","#4F4F4F","#4B4B4B","#474747","#434343","#3F3F3F","#3B3B3B","#373737","#333333","#2F2F2F","#2B2B2B","#272727","#232323","#1F1F1F","#1B1B1B","#171717","#131313","#0F0F0F","#0B0B0B","#070707","#030303","#000000","#000000","#000000","#000000","#000000"),e=d.length,f=72,g="",h=a?"window.opener.":"";a&&(g+="<html><head><title>Select Color</title></head>",g+="<body marginwidth=0 marginheight=0 leftmargin=0 topmargin=0><span style='text-align: center;'>"),g+="<table style='border: none;' cellspacing=0 cellpadding=0>";for(var i=document.getElementById||document.all?!0:!1,j=0;e>j;j++){if(j%f==0&&(g+="<tr>"),i)var k='onMouseOver="'+h+"ColorPicker_highlightColor('"+d[j]+"',window.document)\"";else k="";g+='<td style="background-color: '+d[j]+';"><a href="javascript:void()" onclick="'+h+"ColorPicker_pickColor('"+d[j]+"',"+h+"window.popupWindowObjects["+c.index+']);return false;" '+k+">&nbsp;</a></td>",(j+1>=e||(j+1)%f==0)&&(g+="</tr>")}if(document.getElementById){var l=Math.floor(f/2),m=f=l;g+="<tr><td colspan='"+l+"' style='background-color: #FFF;' ID='colorPickerSelectedColor'>&nbsp;</td><td colspan='"+m+"' style='text-align: center;' id='colorPickerSelectedColorValue'>#FFFFFF</td></tr>"}return g+="</table>",a&&(g+="</span></body></html>"),c.populate(g+"\n"),c.offsetY=25,c.autoHide(),c}ColorPicker_targetInput=null;

//comment-reply.js
var addComment = {
    moveForm : function(commId, parentId, respondId, postId) {
        var t = this, div, comm = t.I(commId), respond = t.I(respondId), cancel = t.I('cancel-comment-reply-link'), parent = t.I('comment_parent'), post = t.I('comment_post_ID');

        if ( ! comm || ! respond || ! cancel || ! parent )
            return;

        t.respondId = respondId;
        postId = postId || false;

        if ( ! t.I('wp-temp-form-div') ) {
            div = document.createElement('div');
            div.id = 'wp-temp-form-div';
            div.style.display = 'none';
            respond.parentNode.insertBefore(div, respond);
        }

        comm.parentNode.insertBefore(respond, comm.nextSibling);
        if ( post && postId )
            post.value = postId;
        parent.value = parentId;
        cancel.style.display = '';

        cancel.onclick = function() {
            var t = addComment, temp = t.I('wp-temp-form-div'), respond = t.I(t.respondId);

            if ( ! temp || ! respond )
                return;

            t.I('comment_parent').value = '0';
            temp.parentNode.insertBefore(respond, temp);
            temp.parentNode.removeChild(temp);
            this.style.display = 'none';
            this.onclick = null;
            return false;
        };

        try { t.I('comment').focus(); }
        catch(e) {}

        return false;
    },

    I : function(e) {
        return document.getElementById(e);
    }
};

//comments-reply.min.js
var addComment={moveForm:function(a,b,c,d){var e,f=this,g=f.I(a),h=f.I(c),i=f.I("cancel-comment-reply-link"),j=f.I("comment_parent"),k=f.I("comment_post_ID");if(g&&h&&i&&j){f.respondId=c,d=d||!1,f.I("wp-temp-form-div")||(e=document.createElement("div"),e.id="wp-temp-form-div",e.style.display="none",h.parentNode.insertBefore(e,h)),g.parentNode.insertBefore(h,g.nextSibling),k&&d&&(k.value=d),j.value=b,i.style.display="",i.onclick=function(){var a=addComment,b=a.I("wp-temp-form-div"),c=a.I(a.respondId);if(b&&c)return a.I("comment_parent").value="0",b.parentNode.insertBefore(c,b),b.parentNode.removeChild(b),this.style.display="none",this.onclick=null,!1};try{f.I("comment").focus()}catch(l){}return!1}},I:function(a){return document.getElementById(a)}};

//customize-base.js
