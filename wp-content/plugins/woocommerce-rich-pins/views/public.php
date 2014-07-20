<?php
/**
 * Represents the view for the public-facing component of the plugin.
 *
 * This typically includes any information, if any, that is rendered to the
 * frontend of the theme when the plugin is activated.
 *
 * @package   WCRP
 * @author    Phil Derksen <pderksen@gmail.com>, Nick Young <mycorpweb@gmail.com>
 * @license   GPL-2.0+
 * @copyright 2013 Phil Derksen
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}


/**
* Add the Open Graph meta tag for site name
*
* @since    1.0.0
*
*/
function wcrp_add_og_site_name() {
	global $wcrp_options;
	
	if ( ! empty ( $wcrp_options['og_site_name'] ) ) {
		echo '<meta property="og:site_name" content="' . esc_attr( $wcrp_options['og_site_name'] ) . '" />' . "\n";
	}
	
	return;
}
add_action( 'wp_head', 'wcrp_add_og_site_name' );


/**
 * Add additional Product meta values not already added by WooCommerce to the WooCommerce product meta DIV
 *
 * @since    1.0.0
 *
 */
function wcrp_additional_product_meta() {
	global $post, $wcrp_options;
	
	// Check post meta for brand
	$wcrp_brand_name = get_post_meta( $post->ID, 'wcrp_brand_name', true );
	
	if( ! empty( $wcrp_brand_name ) )
		echo '<meta itemprop="brand" content="' . esc_attr( $wcrp_brand_name ) . '" />' . "\n";
	
}
add_filter( 'woocommerce_product_meta_end', 'wcrp_additional_product_meta' );

/**
 * Rewrite the single product HTML so that the meta is setup correctly and will validate at Pinterest
 *
 * @since    1.0.0
 *
 */
function wcrp_single_price_html() {
	global $product, $post;
	
	$wcrp_price_html = '';
	
	// Get the SKU if it set
	$sku = get_post_meta( $post->ID, '_sku' );
	
	// need to add the URL before the offers itemtype so that it is added to the Product schema type
	$wcrp_price_html .= '<meta itemprop="url" content="' . get_permalink( $post->ID ) . '" />' . "\n";
	
	$wcrp_price_html .= '<div itemprop="offers" itemscope itemtype="http://schema.org/Offer">' . "\n";
	$wcrp_price_html .= '<p class="price">' . $product->get_price_html() . '</p>' . "\n";

	// Add SKU if it isnt empty
	if( ! empty( $sku ) ) {
		$wcrp_price_html .= '<meta itemprop="sku" content="' . esc_attr( $sku[0] ) . '" />' . "\n";
	}

	$wcrp_price_html .= '<meta itemprop="price" content="'. $product->get_price() . '" />' . "\n";
	$wcrp_price_html .= '<meta itemprop="priceCurrency" content="' . get_woocommerce_currency() . '" />' . "\n";
	$wcrp_price_html .= '<link itemprop="availability" href="http://schema.org/' . ( $product->is_in_stock() ? 'InStock' : 'OutOfStock' ) . '" />' . "\n";
	$wcrp_price_html .= '</div>';
	
	echo $wcrp_price_html;
}
remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_price', 10 );
add_action( 'woocommerce_single_product_summary', 'wcrp_single_price_html', 10 );
