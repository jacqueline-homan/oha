<?php
/**
 * Description Tab
 */
global $woocommerce, $post;
if ( $post->post_content ) : ?>
	<div class="tab_content" id="tab-description">
		<?php $heading = apply_filters('woocommerce_product_description_heading', __('Product Description', 'kauri')); ?>
		<h4><?php echo $heading; ?></h4>
		<?php the_content(); ?>
	</div>
<?php endif; ?>