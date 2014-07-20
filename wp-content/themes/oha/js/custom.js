(function( $ ){

	/* === PLUGIN hCaption: Zoom in image on hover and adds caption overlay  === */
	
	$.fn.hCaption = function() {
	
	return this.each(function(options) {
		
		var defaults = {   
			image: 'img',  
			caption: ".enlarge-link",
			zoom: 1.1,
		}; 
		var options = $.extend(defaults, options);
	
		var zoomRatio = options.zoom;
		
		var imgW = $(this).find( options.image ).width();
		var imgH = $(this).find( options.image ).height();
		
		
		$(this).hover(function() {
					
			width = imgW * zoomRatio; // calculate zoom
			height = imgH * zoomRatio; //
			
			moveX = imgW/2 - width/2; // centering zoom
			moveY = imgH/2 - height/2;
			 
			$(this).find( options.image ).stop(false,true).animate({'width':width, 'height':height, 'top':moveY, 'left':moveX}, {duration:200});
			$(this).find( options.caption ).stop(false,true).fadeIn(200);
		},
		function() {
			$(this).find( options.image ).stop(false,true).animate({'width': imgW, 'height':imgH , 'top':'0', 'left':'0'}, {duration:50});    
			$(this).find( options.caption ).stop(false,true).fadeOut(200);
		});
	
	})
	
  };//end $.fn.hCaption = function()
  
})( jQuery );

var $j = jQuery.noConflict();

jQuery(document).ready(function($j) {
	var ie8 = $j('html').hasClass('ie8');
	var ie9 = $j('html').hasClass('ie9');
	var isIE = ie8 || ie9;
	var noScale = $j('html').hasClass('ie8');
	
	var ieOffset = 0;
	if(ie8)
		ieOffset = -382;
	else if(ie9)
		ieOffset = -458;
		
	var navHeight = 63;
	
	/*$j(".scroll").on('click', function(event){		
		event.preventDefault();
		var extra = 0;
		if($j(this).attr('rel') == 'first-nav')
			extra = -navHeight*1.28;
		
		
		if($j(this).attr('rel') == 'first-nav')
			$j('html,body').animate({scrollTop:$j(this.hash).offset().top+extra}, 500);
		else
			$j('html,body').animate({scrollTop:$j(this.hash).offset().top-(navHeight*.75)}, 500);
		//if(!isIE)
			//$j('html,body').animate({scrollTop:$j(this.hash).offset().top-55+extra}, 500);
		//else
			//$j('html,body').animate({scrollTop:$j(this.hash).offset().top+ieOffset}, 500);
	});*/
	
	if(params.is_home)
	{
			var bannerScroll = 0;
			var bannerVisible = false;
			var curScroll = 0;
			var animating = false;
			var curNavItem = 0;
			var sectionScroll = new Array();
			$j('#floating-sub-nav .sub-nav-list').html($j('#home-sub-nav .sub-nav-list').html());
			function checkHomeScroll(){
				curScroll = $j(document).scrollTop();
				//console.log('curScroll: + ' + curScroll + ', bannerScroll: ' + bannerScroll);
				
				/* show or hide banner */
				if(curScroll > bannerScroll)
				{
					
					if(!bannerVisible)					
						$j('#floating-sub-nav').css('display', 'block').animate({opacity: 1}, 500);
					bannerVisible = true;
				} else {
					if(bannerVisible && !animating)
					{
						animating = true;
						$j('#floating-sub-nav').animate({opacity: 0}, 300, function(){
							$j(this).css('display', 'none')
							bannerVisible = false;
							animating = false;
						});
					}						
				}
				
				/* set current sub nav item */
				updateNav();
			}
			function updateHeight() {
				navHeight = $j('#home-sub-nav .sub-nav-inner').width()/940 * 63;
				$j('#floating-sub-nav .sub-nav-inner, #home-sub-nav .sub-nav-inner').height(navHeight);
				//console.log(height);
			}
			function updateNav() {
				if(curScroll > bannerScroll)
				{	
					var prevNav = curNavItem;
					//console.log('curscroll: ' + curScroll);
					for(var i=0; i<sectionScroll.length; i++)
					{
						if(curScroll > sectionScroll[i]) {
							curNavItem = i;
							//console.log(curNavItem);
						}
					}
					
					if(prevNav != curNavItem) {
						setCurrentSubNav(curNavItem);
						//console.log(curNavItem + 1);
					}
				}
				
				function setCurrentSubNav($nav) {
					if( ($nav > 4) || ($nav < 0) )
						$nav = 0;
					$j('.current').removeClass('current');
					var selector = '#floating-sub-nav .nav-'+($nav+1);
					$j(selector).addClass('current');
					//console.log(selector);
				}
			}
			function updateNavScroll() {
				sectionScroll = new Array();
				$j('.bookmark').each(function(index){
					//$j(this).addClass('bookmark_'+index);
					sectionScroll[index]=$j(this).offset().top - 80;
					console.log(sectionScroll[index]);
				});
			}
			$j(window).resize(function() {
				bannerScroll = $j('#home-sub-nav').offset().top+100;
				updateNavScroll();
				updateHeight();
				checkHomeScroll();
			});
			$j(window).load(function() {
				setTimeout( function() { 
					$j(window).trigger('resize'); 
					$j(window).scroll(function () {
						checkHomeScroll();
					});
				}, 200);
				setTimeout( function() {
					updateNavScroll();
					updateNav();
				}, 200)
			});
				
	}
		
	/* =====  ajaxForm plugin email contact form validation with =====*/
	/*
$j('#contact').ajaxForm(function(data) {
		if (data==1){
			$j('#success').fadeIn("slow");
			$j('#bademail').fadeOut("slow");
			$j('#badserver').fadeOut("slow");
			$j('#contact').resetForm();
		}
		else if (data==2){
			$j('#badserver').fadeIn("slow");
		}
		else if (data==3)
		{
			$j('#bademail').fadeIn("slow");
		}
	});
*/
	
	/*===== custom jQuery plugin for thumbmail images and caption animation ======= */
	//$j('.image-links, .latest_item_image, .gallery-thumb-with-zoom, .search-product-image').hCaption();
	
	/*===== tabs snippet ======= */
	$j('.tabber').each(function() {
		
		var tabHolder = $j(this);
		
		tabHolder.find(".tab_container .tab_content").hide(); //Hide all content
		tabHolder.find("ul.tabs li:first").addClass("active").show(); //Activate first tab
		tabHolder.find(".tab_content:first").show(); //Show first tab content
		
		tabHolder.find("ul.tabs li").click( function() {

			tabHolder.find("ul.tabs li").removeClass("active"); //Remove any "active" class
			$j(this).addClass("active"); //Add "active" class to selected tab
			tabHolder.find(".tab_content").hide(); //Hide all tab content

			var tabIdentifier =  $j(this).find("a").attr("href");//Find the href attribute value to identify the active tab + content
			var activeTab = tabHolder.find(tabIdentifier); 
			
			$j(activeTab).fadeIn(); //Fade in the active ID content
			return false;
		}); // end click
	});
	
	function checkForChanges() {
		if ($j('#stock-toggler div').hasClass('out_of_stock'))
			$j('#out_of_stock_overlay').fadeIn()
		else
			$j('#out_of_stock_overlay').fadeOut()
			setTimeout(checkForChanges, 200);
	}
	$j(checkForChanges);
	
	/*
function setupLabel() {
		if ($j('.label_check input').length) {
			$j('.label_check').each(function(){ 
				$j(this).removeClass('c_on');
			});
			$j('.label_check input:checked').each(function(){ 
				$j(this).parent('label').addClass('c_on');
			});                
		};
		if ($j('.label_radio input').length) {
			$j('.label_radio').each(function(){ 
				$j(this).removeClass('r_on');
			});
			$j('.label_radio input:checked').each(function(){ 
				$j(this).parent('label').addClass('r_on');
			});
		};
	};
	$j('body').addClass('has-js');
	$j('.label_check, .label_radio').click(function(){
		setupLabel();
	});
	setupLabel(); 
*/
	
});


function initPage()
{
	clearFormFields({
		clearInputs: true,
		clearTextareas: true,
		passwordFieldText: false,
		addClassFocus: "focus",
		filterClass: "default"
	});
}
function clearFormFields(o)
{
	if (o.clearInputs == null) o.clearInputs = true;
	if (o.clearTextareas == null) o.clearTextareas = true;
	if (o.passwordFieldText == null) o.passwordFieldText = false;
	if (o.addClassFocus == null) o.addClassFocus = false;
	if (!o.filterClass) o.filterClass = "default";
	if(o.clearInputs) {
		var inputs = document.getElementsByTagName("input");
		for (var i = 0; i < inputs.length; i++ ) {
			if((inputs[i].type == "text" || inputs[i].type == "password") && inputs[i].className.indexOf(o.filterClass) == -1) {
				inputs[i].valueHtml = inputs[i].value;
				inputs[i].onfocus = function ()	{
					if(this.valueHtml == this.value) this.value = "";
					if(this.fake) {
						inputsSwap(this, this.previousSibling);
						this.previousSibling.focus();
					}
					if(o.addClassFocus && !this.fake) {
						this.className += " " + o.addClassFocus;
						this.parentNode.className += " parent-" + o.addClassFocus;
					}
				}
				inputs[i].onblur = function () {
					if(this.value == "") {
						this.value = this.valueHtml;
						if(o.passwordFieldText && this.type == "password") inputsSwap(this, this.nextSibling);
					}
					if(o.addClassFocus) {
						this.className = this.className.replace(o.addClassFocus, "");
						this.parentNode.className = this.parentNode.className.replace("parent-"+o.addClassFocus, "");
					}
				}
				if(o.passwordFieldText && inputs[i].type == "password") {
					var fakeInput = document.createElement("input");
					fakeInput.type = "text";
					fakeInput.value = inputs[i].value;
					fakeInput.className = inputs[i].className;
					fakeInput.fake = true;
					inputs[i].parentNode.insertBefore(fakeInput, inputs[i].nextSibling);
					inputsSwap(inputs[i], null);
				}
			}
		}
	}
	if(o.clearTextareas) {
		var textareas = document.getElementsByTagName("textarea");
		for(var i=0; i<textareas.length; i++) {
			if(textareas[i].className.indexOf(o.filterClass) == -1) {
				textareas[i].valueHtml = textareas[i].value;
				textareas[i].onfocus = function() {
					if(this.value == this.valueHtml) this.value = "";
					if(o.addClassFocus) {
						this.className += " " + o.addClassFocus;
						this.parentNode.className += " parent-" + o.addClassFocus;
					}
				}
				textareas[i].onblur = function() {
					if(this.value == "") this.value = this.valueHtml;
					if(o.addClassFocus) {
						this.className = this.className.replace(o.addClassFocus, "");
						this.parentNode.className = this.parentNode.className.replace("parent-"+o.addClassFocus, "");
					}
				}
			}
		}
	}
	function inputsSwap(el, el2) {
		if(el) el.style.display = "none";
		if(el2) el2.style.display = "inline";
	}
}
if (window.addEventListener)
	window.addEventListener("load", initPage, false);
else if (window.attachEvent)
	window.attachEvent("onload", initPage);
	
// BEGIN Tynt Script
if(document.location.protocol=='http:'){
 var Tynt=Tynt||[];Tynt.push('aN1vIqKOar4PGnacwqm_6r');
 (function(){var s=document.createElement('script');s.async="async";s.type="text/javascript";s.src='http://tcr.tynt.com/ti.js';var h=document.getElementsByTagName('script')[0];h.parentNode.insertBefore(s,h);})();
}
// END Tynt Script