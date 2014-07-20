<?php
define("THEME_DIR", '/wp-content/themes/oha');

function oha_theme_setup()
{
	include("includes/widget-contact.php");
	include("includes/widget_latest_images.php");
	include("includes/widget_featured_thumbs.php");
	
	add_image_size( 'social', 200, 200, false );
	
	//register sidebars
	add_action( 'widgets_init', 'oha_widgets_init');
	add_action( 'wp_print_styles', 'oha_enqueue_css');
	add_action( 'wp_enqueue_scripts', 'oha_enqueue_scripts');
	add_action( 'wp_footer', 'oha_footer');
	remove_action('woocommerce_pagination', 'woocommerce_pagination', 10);
	add_action( 'woocommerce_pagination', 'woocommerce_pagination', 10);
	
	
	remove_filter('excerpt_more', 'bnk_auto_excerpt_more' );
	remove_filter('excerpt_length', 'bnk_excerpt_length' );
	add_filter('excerpt_more', 'oha_excerpt_more');
	add_filter( 'excerpt_length', 'oha_excerpt_length' );
	
	//home nav menu short codes
	add_shortcode('home-nav-menu', 'home_nav_menu');
	add_shortcode('home-nav-bookmark', 'home_nav_bookmark');
	
	remove_shortcode('btn_danger');
	add_shortcode('btn_danger', 'oha_button_danger');
}
add_action( 'after_setup_theme', 'oha_theme_setup', 10 );

function oha_enqueue_css()
{
	wp_register_style( 'fancybox', THEME_DIR .'/js/fancybox/jquery.fancybox-1.3.4.css');
	wp_register_style( 'woo-commerce', THEME_DIR . '/styles/woocommerce.css', false, '.002');
	wp_register_style( 'all', THEME_DIR . '/styles/all.css', false, '.024');
	wp_register_style( 'main', get_bloginfo( 'stylesheet_url' ), array('all'));
	wp_enqueue_style( 'main' );
	wp_enqueue_style( 'woo-commerce' );
	//wp_enqueue_style( 'formalize');
	
	//if on store
	if(is_front_page())
		wp_enqueue_script('addthis');
	wp_enqueue_style( 'fancybox' );
}

function oha_enqueue_scripts()
{
	//wp_deregister_script('jquery');
	//wp_register_script('jquery', THEME_DIR.'/js/vendor/jquery.js');
	wp_enqueue_script('jquery');
	wp_register_script( 'fancybox', THEME_DIR .'/js/fancybox/jquery.fancybox-1.3.4.js');
	wp_register_script( 'custom-oha', THEME_DIR .'/js/custom.js', false,'.021');
	$params = array( 'is_home' => is_front_page() );
	wp_enqueue_script( 'custom-oha' );
	wp_localize_script( 'custom-oha', 'params', $params );
	wp_register_script('social-footer', THEME_DIR .'/js/social-footer.js', false, '.01', true);
	wp_enqueue_script('social-footer');
	//if on store
	wp_enqueue_script( 'fancybox' );
}

function oha_footer()
{
	?><script type="text/javascript" src="//assets.pinterest.com/js/pinit.js"></script><?php
}

function oha_excerpt_more($more) 
{
    global $post;
	return '<br/><br/><a class="moretag" href="'. get_permalink($post->ID) . '">Read More »</a>';
}

function oha_excerpt_length( $length ) {
	return 60;
}

function woocommerce_pagination() {
	bnk_pagination();
}

function oha_widgets_init()
{
	if ( function_exists('register_sidebar') ) {
		register_sidebar( array(
			'name' => __( 'Blog Sidebar', 'bhinneka' ),
			'id' => 'sidebar-blog',
			'description' => __( 'The blog sidebar widget area', 'bhinneka' ),
			'before_widget' => '<aside id="%1$s" class="bnk-widget %2$s">',
			'after_widget' => '</aside>',
			'before_title' => '<h3 class="widget-title replace inset-light">',
			'before_title' => '<h3 class="widget-title replace inset-light">',
			'after_title' => '</h3>',
		) );
		register_sidebar( array(
			'name' => __( 'Shop Sidebar', 'bhinneka' ),
			'id' => 'sidebar-shop',
			'description' => __( 'The shop sidebar widget area', 'bhinneka' ),
			'before_widget' => '<aside id="%1$s" class="bnk-widget %2$s">',
			'after_widget' => '</aside>',
			'before_title' => '<h3 class="widget-title replace inset-light">',
			'before_title' => '<h3 class="widget-title replace inset-light">',
			'after_title' => '</h3>',
		) );
		/*
register_sidebar( array(
			'name' => __( 'Default CTA', 'bhinneka' ),
			'id' => 'sidebar-shop',
			'description' => __( 'The default CTA widget area', 'bhinneka' ),
			'before_widget' => '<aside id="%1$s" class="bnk-widget %2$s">',
			'after_widget' => '</aside>',
			'before_title' => '<h3 class="widget-title replace inset-light">',
			'before_title' => '<h3 class="widget-title replace inset-light">',
			'after_title' => '</h3>',
		) );
*/
	}
}

/* Home nav menu shortcode handlers */
function home_nav_menu($atts) 
{
	extract(shortcode_atts(array(
	      'one' => 'path1', 'one_name' => '1',
	      'two' => 'path2', 'two_name' => '2',
	      'three' => 'path3', 'three_name' => '3',
	      'four' => 'path4', 'four_name' => '4',
	      'five' => 'path5', 'five_name' => '5'
     ), $atts));
	$value = "<div id=\"home-sub-nav-wrap\">
		<div id=\"home-sub-nav\">
			<div class=\"sub-nav-inner\">
				<div class=\"sub-nav-list\">
					<ul class=\"nav-ribbon\">
						<li class=\"current nav-1\"><a class=\"scroll\" href=\"#{$one}\" rel=\"first-nav\"><img src=\"/wp-content/themes/oha/images/icon-1.png\" alt=\"{$one_name}\"/></a></li>
						<li class=\"nav-2\"><a class=\"scroll\" href=\"#{$two}\"><img src=\"/wp-content/themes/oha/images/icon-2.png\" alt=\"{$two_name}\"/></a></li>
						<li class=\"nav-3\"><a class=\"scroll\" href=\"#{$three}\"><img src=\"/wp-content/themes/oha/images/icon-3.png\"/ alt=\"{$three_name}\"></a></li>
						<li class=\"nav-4\"><a class=\"scroll\" href=\"#{$four}\"><img src=\"/wp-content/themes/oha/images/icon-4.png\" alt=\"{$four_name}\"/></a></li>
						<li class=\"nav-5\"><a class=\"scroll\" href=\"#{$five}\"><img src=\"/wp-content/themes/oha/images/icon-5.png\" alt=\"{$five_name}\"/></a></li>
					</ul>
				</div>
				<div class=\"sub-nav-bg\">
					<img src=\"/wp-content/themes/oha/images/nav-ribbon-sized.png\" width=\"940px\" height=\"63\"/>
				</div>
			</div>
		</div>
	</div>";
	return $value; 
}

function home_nav_bookmark($atts) 
{
	extract(shortcode_atts(array(
	      'name' => 'path',
	      'first' => false
	), $atts));	
	
	$firstClass = ($first)?' first':'';
	$value = "<a name=\"{$name}\" id=\"{$name}\" class=\"bookmark{$firstClass}\">&nbsp;</a>";
	return $value;
}

function oha_button_danger( $atts, $content = null ) {
    extract(shortcode_atts(array(
		'url'     	 => '#',
		'target'     => '_self',
		'position'   => 'left',
		'track'		 => 'Section Button'
    ), $atts));
	$out = "<a href=\"" .$url. "\" target=\"" .$target. "\" class=\"btn danger " .$position. "\" onclick=\"var _gaq = _gaq || []; _gaq.push(['_trackEvent', 'Home Page CTAs', '{$track}']);\"><span>".do_shortcode($content)."</span></a>";
    return $out;
}

function the_fb_sdk() 
{
	?><div id="fb-root"></div>
	<script>
	  window.fbAsyncInit = function() {
	    // init the FB JS SDK
	    FB.init({
	      appId      : '557295264288550', // App ID from the App Dashboard
	      /* channelUrl : '//<?=site_url()?>/channel.php', // Channel File for x-domain communication */
	      status     : true, // check the login status upon init?
	      cookie     : true, // set sessions cookies to allow your server to access the session?
	      xfbml      : true  // parse XFBML tags on this page?
	    });
	
	    // Additional initialization code such as adding Event Listeners goes here
	
	  };
	
	  // Load the SDK's source Asynchronously
	  // Note that the debug version is being actively developed and might 
	  // contain some type checks that are overly strict. 
	  // Please report such bugs using the bugs tool.
	  (function(d, debug){
	     var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
	     if (d.getElementById(id)) {return;}
	     js = d.createElement('script'); js.id = id; js.async = true;
	     js.src = "//connect.facebook.net/en_US/all" + (debug ? "/debug" : "") + ".js";
	     ref.parentNode.insertBefore(js, ref);
	   }(document, /*debug*/ false));
	</script><?php
}