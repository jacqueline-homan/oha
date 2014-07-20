<?php
/**
 * Attributes Tab
 */
global $woocommerce, $post, $product;
$show_attr = ( get_option( 'woocommerce_enable_dimension_product_attributes' ) == 'yes' ? true : false );
if ( $product->has_attributes() || ( $show_attr && $product->has_dimensions() ) || ( $show_attr && $product->has_weight() ) ) {
	?>
	<div class="tab_content" id="tab-attributes">
		<?php $heading = apply_filters('woocommerce_product_additional_information_heading', __('Additional Information', 'kauri')); ?>
		<h4><?php echo $heading; ?></h4>
		<?php $product->list_attributes(); ?>
	</div>
	<?php
}
?>