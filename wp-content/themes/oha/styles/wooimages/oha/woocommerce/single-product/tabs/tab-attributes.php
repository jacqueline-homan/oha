<?php global $product;
$show_attr = ( get_option( 'woocommerce_enable_dimension_product_attributes' ) == 'yes' ? true : false );
if ( $product->has_attributes() || ( $show_attr && $product->has_dimensions() ) || ( $show_attr && $product->has_weight() ) ) {
	?>
	<li><a href="#tab-attributes"><h5><?php _e('Additional Information', 'kauri'); ?></h5></a></li>
	<?php
}
?>