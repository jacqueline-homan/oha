<?php

/**
 * Represents the view for the post meta options.
 *
 * @package    WCRP
 * @subpackage Views
 * @author     Phil Derksen <pderksen@gmail.com>, Nick Young <mycorpweb@gmail.com>
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

global $post, $wcrp_options;

$wcrp_permalink       = get_permalink( $post->ID );
$wcrp_brand_name = get_post_meta( $post->ID, 'wcrp_brand_name', true );
$wcrp_description     = wp_strip_all_tags( $post->post_excerpt );
$wcrp_sku             = get_post_meta( $post->ID, '_sku', true );
$wcrp_sale            = get_post_meta( $post->ID, '_sale_price', true );
$wcrp_reg_price       = get_post_meta( $post->ID, '_regular_price', true );
$wcrp_price           = ( ! empty( $wcrp_sale ) ? $wcrp_sale : $wcrp_reg_price );
$wcrp_stock           = get_post_meta( $post->ID, '_stock_status', true );
$wcrp_base_domain     = wcrp_get_base_domain_name( home_url() );

?>

<p>
	<strong>
		<a href="http://developers.pinterest.com/rich_pins/validator/?link=<?php echo urlencode( $wcrp_permalink ); ?>" target="_blank">
			<?php _e( 'Validate this Product with Pinterest', 'wcrp' ); ?>
		</a>&nbsp;&nbsp;|&nbsp;
		<a href="http://www.pinterest.com/source/<?php echo $wcrp_base_domain; ?>" target="_blank">
			<?php _e( 'View recent pins for ' . $wcrp_base_domain, 'wcrp' ); ?>
		</a>
	</strong>
</p>

<strong><?php _e( 'Product Rich Pin Tips', 'wcrp' ); ?>:</strong><br/>

<p class="description">
	<?php _e( 'Rich Pin values are automatically generated for all your products. The values below are what this current product is using and where it\'s pulling from.', 'wcrp' ); ?>
	<?php _e( 'You don\'t need to validate every product. The above link is just to spot check as desired.', 'wcrp' ); ?>
	<?php _e( 'Sometimes the validation page on Pinterest doesn\'t fully load and needs a page refresh.', 'wcrp' ); ?>
</p>

<table class="widefat">
	<thead>
	<tr>
		<th><?php _e( 'Schema.org field', 'wcrp' ); ?></th>
		<th><?php _e( 'Required?', 'wcrp' ); ?></th>
		<th><?php _e( 'Taken from', 'wcrp' ); ?></th>
		<th style="width: 50%;"><?php _e( 'Current value', 'wcrp' ); ?></th>
	</tr>
	</thead>
	<tbody>
	<tr>
		<td><?php _e( 'Product URL', 'wcrp' ); ?></td>
		<td><?php _e( 'Required', 'wcrp' ); ?></td>
		<td><?php _e( 'Product permalink', 'wcrp' ); ?></td>
		<td style="width: 50%;"><?php echo $wcrp_permalink; ?></td>
	</tr>
	<tr>
		<td><?php _e( 'Product Name', 'wcrp' ); ?></td>
		<td><?php _e( 'Required', 'wcrp' ); ?></td>
		<td><?php _e( 'Product name', 'wcrp' ); ?></td>
		<td><?php echo wp_strip_all_tags( get_the_title( $post->ID ) ); ?></td>
	</tr>
	<tr>
		<td><?php _e( 'Product Description', 'wcrp' ); ?></td>
		<td><?php _e( 'Optional', 'wcrp' ); ?></td>
		<td><?php _e( 'Short description', 'wcrp' ); ?></td>
		<td><?php echo $wcrp_description; ?></td>
	</tr>
	<tr>
		<td><?php _e( 'Product ID', 'wcrp' ); ?></td>
		<td><?php _e( 'Optional', 'wcrp' ); ?></td>
		<td><?php _e( 'Product Data > SKU', 'wcrp' ); ?></td>
		<td><?php echo $wcrp_sku; ?></td>
	</tr>
	<tr>
		<td><?php _e( 'SKU', 'wcrp' ); ?></td>
		<td><?php _e( 'Optional', 'wcrp' ); ?></td>
		<td><?php _e( 'Product Data > SKU', 'wcrp' ); ?></td>
		<td><?php echo $wcrp_sku; ?></td>
	</tr>
	<tr>
		<td><?php _e( 'Price', 'wcrp' ); ?></td>
		<td><?php _e( 'Required', 'wcrp' ); ?></td>
		<td><?php _e( 'Product Data > Sales Price (if exists), otherwise Regular Price', 'wcrp' ); ?></td>
		<td><?php echo $wcrp_price; ?></td>
	</tr>
	<tr>
		<td><?php _e( 'Currency', 'wcrp' ); ?></td>
		<td><?php _e( 'Required', 'wcrp' ); ?></td>
		<td><?php _e( 'WooCommerce > Settings > Currency', 'wcrp' ); ?></td>
		<td><?php echo get_woocommerce_currency(); ?></td>
	</tr>
	<tr>
		<td><?php _e( 'Availability', 'wcrp' ); ?></td>
		<td><?php _e( 'Optional', 'wcrp' ); ?></td>
		<td><?php _e( 'Product Data > Inventory > Stock status', 'wcrp' ); ?></td>
		<td><?php echo $wcrp_stock; ?></td>
	</tr>
	</tbody>
</table>

<h4>
	<?php _e( 'Optional Product Rich Pin values', 'wcrp' ); ?>:
</h4>

<table class="form-table">
	<tbody>
		<tr valign="top">
			<th scope="row">
				<label for="wcrp_brand_name"><?php _e( 'Brand Name', 'wcrp' ); ?>
			</th>
			<td>
				<input type="text" class="regular-text" name="wcrp_brand_name" id="wcrp_brand_name" value="<?php echo esc_attr( $wcrp_brand_name ); ?>" />
			</td>
		</tr>
	</tbody>
</table>
