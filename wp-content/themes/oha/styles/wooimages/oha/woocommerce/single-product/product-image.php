<?php
/**
 * Single Product Image
 */

global $post, $product, $woocommerce;

?>
<div class="images">
		
		<!-- <a itemprop="image" href="<?php echo wp_get_attachment_url( get_post_thumbnail_id() ); ?>" class="zoom" rel="thumbnails" title="
		
		<?php echo get_the_title( get_post_thumbnail_id() ); ?>">-->
		
		<div class="imagecol" id="imagecol_<?php echo $post->ID ?>">
		
		<div class="image-links" id="<?php echo $post->ID ?>">
		
			<div class="enlarge-link">
				
				<div class="products-zoom-single">
					
					<a rel="products_list" class="zoom" href="<?php echo wp_get_attachment_url( get_post_thumbnail_id() ); ?>" title="<?php 
					echo get_the_title(); ?> - <?php echo __('Zoom product image','cherry'); ?>">
						<div class="prod-zoom"><?php echo __('zoom image','kauri') ?></div>
					</a>
					
				</div><!-- end .products-zoom-single -->
				
			</div><!-- end .enlarge-link -->
			
			<div class="img-wrapper">
			
				<?php if ( has_post_thumbnail() ) : ?>
					<?php echo get_the_post_thumbnail( $post->ID, apply_filters( 'single_product_large_thumbnail_size', 'shop_single' ) ) ?>
				<?php else : ?>
					<img src="<?php echo woocommerce_placeholder_img_src(); ?>" alt="Placeholder" />
				<?php endif; ?>
				
			</div>	
			
			<!--</a> -->
			
		</div><!-- end .image-links -->
		</div><!-- end .imagecol -->

		
	<?php do_action('woocommerce_product_thumbnails'); ?>
</div>