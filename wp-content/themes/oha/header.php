<?php
/**
 * The Header for Bhinneka theme.
 *
 * Displays all of the <head> section and everything up till <div class="container">
 */
 ?>

<!DOCTYPE html>

<!--[if IE 6]>
<html id="ie6" class="ie ie6" <?php language_attributes(); ?>>
<![endif]-->
<!--[if IE 7]>
<html id="ie7" class="ie ie7" <?php language_attributes(); ?>>
<![endif]-->
<!--[if IE 8]>
<html id="ie8" class="ie ie8" <?php language_attributes(); ?>>
<![endif]-->
<!--[if IE 9]>
<html id="ie9" class="ie ie9" <?php language_attributes(); ?>>
<![endif]-->
<!--[if !IE]>
<html <?php language_attributes(); ?> >
<![endif]-->

<head>
<meta charset="<?php bloginfo( 'charset' ); ?>" />
<title><?php	wp_title( '|', true, 'right' ); ?></title>
<meta http-equiv="X-UA-Compatible" content="IE=Edge;chrome=1" >
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0;">
<link rel="profile" href="http://gmpg.org/xfn/11" />
<!-- TINYHOUSE -->
<!-- Stylesheet -->

<!--[if lt IE 9]>
	<link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/css/ie.css" type="text/css" media="all" />
<![endif]-->
<?php 
	/*
global $data;
	if ($data['bnk_stylesheet']) { ?>
	<link rel="stylesheet" type="text/css" media="all" href="<?php echo get_template_directory_uri(); ?>/css/<?php echo $data['bnk_stylesheet']; ?>"/>
<?php };
*/ ?>


<!-- Favicons -->
<link rel="shortcut icon" href="<?php echo get_template_directory_uri(); ?>/img/favicon.ico">

<!-- RSS -->
<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>" />

<?php wp_head(); ?>

<?php if (is_home()) { ?>
<meta property='og:image' content='http://www.organichealthalliance.com/wp-content/uploads/2013/03/feat-1.jpg'/>
<?php } ?>

<?php wp_enqueue_script('fancy-kauri', THEME_DIR .'/js/fancy-kauri.js'); // must be after wp_head() to override woo fancybox ?>

</head>

<body <?php body_class(); ?>>
<?php if ( is_front_page() || is_page('blog') || is_single() || is_archive() ): the_fb_sdk(); endif; ?>
<!-- HEADER BEGIN -->
	<?php if(is_front_page()): ?>
	
	<div id="floating-sub-nav">
		<div class="sub-nav-wrap">
			<div class="sub-nav-inner">
				
				<div class="sub-nav-list">
				</div>
				<div class="sub-nav-bg">
					<img src="<?=THEME_DIR?>/images/nav-ribbon-sized.png" width="940px" height="63"/>
				</div>
			</div>
		</div>
	</div>
	<?php endif; ?>
<header id="header">
	
	<div class="container" id="pre-header">
		
		<div class="row">
			<div id="logo">
				<a href="<?php echo home_url( '/' ); ?>" title="<?php echo esc_attr( get_bloginfo( 'name', 'display' ) ); ?>" rel="home">
					<img src="<?php /* Use the default logo (logo.png) if custom logo does not exist */ global $data;
							if ( $data['bnk_custom_logo']) : echo $data['bnk_custom_logo']; else: bloginfo('template_directory');?>/img/logo.png<?php endif; ?>" alt="Organic Health Alliance" />
				</a>
	        </div>
			<?php include 'lib/preheader.php';   ?>
		</div>
	</div>
	<div id="header-b">
	<!-- MAIN HEADER BEGIN -->
	<div id="main-header" class="row">
		<!-- LOGO BEGIN -->
        <div class="col_logo"></div>
		<!-- LOGO END -->

        <div id="sf-nav">
            <!-- PRIMARY NAVIGATION BEGIN -->
	        <div id="nav-wrapper" role="navigation">
				<?php if ( has_nav_menu( 'primary' ) ) { /* if menu 'Primary' menu exists then use Custom Menu */ ?>
				<?php wp_nav_menu( array( 'theme_location' => 'primary', 'menu_class' => 'sf-menu' ) ); ?>
				<?php } else { /* else use wp_list_pages */?>
				<ul class="sf-menu">
					<?php wp_list_pages( 'title_li=&depth=2' ); ?>
				</ul>
				<?php } ?>
			</div>
			<!-- PRIMARY NAVIGATION END -->
        </div>
	</div>
    <!-- MAIN HEADER END -->
	</div>

</header>
<!-- #HEADER END -->