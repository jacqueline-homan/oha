<?php
function oha_theme_setup()
{
	//register sidebars
	add_action( 'widgets_init', 'oha_widgets_init');
}
add_action( 'after_setup_theme', 'oha_theme_setup' );

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