<?php
/**
 * The template for displaying product category thumbnails within loops.
 *
 * Override this template by copying it to yourtheme/woocommerce/content-product_cat.php
 *
 * @package WooCommerce
 * @since WooCommerce 1.6
 */
 
global $product, $woocommerce_loop, $even, $prod_count; // KAURI ADD - $even, $prod_count;
//
// Store loop count we're currently on
if ( empty( $woocommerce_loop['loop'] ) ) 
	$woocommerce_loop['loop'] = 0;

// Store column count for displaying the grid
if ( empty( $woocommerce_loop['columns'] ) ) 
	$woocommerce_loop['columns'] = apply_filters( 'loop_shop_columns', 4 );

// Increase loop count
$woocommerce_loop['loop']++;
// KAURI CODE
if (!$even){
	$evenOdd_style = 'odd';
}else{
	$evenOdd_style = '';
}
// end KAURI CODE
?>
<li class="product sub-category <?php echo $evenOdd_style; ?>">
	<?php 
	/* REMOVED BY KAURI -from INSIDE <li> tag
	if ( $woocommerce_loop['loop'] % $woocommerce_loop['columns'] == 0 ) 
		echo 'last'; 
	elseif ( ( $woocommerce_loop['loop'] - 1 ) % $woocommerce_loop['columns'] == 0 ) 
		echo 'first'; 
	*/
	?>
	<?php do_action( 'woocommerce_before_subcategory', $category ); ?>
		
				
		
		<a href="<?php echo get_term_link($category->slug, 'product_cat'); ?>">

			<div class="imagecol">
			
			<div class="image-links">
			
				<?php
				/** 
				 * woocommerce_before_subcategory_title hook
				 *
				 * @hooked woocommerce_subcategory_thumbnail - 10
				 */	  
				do_action( 'woocommerce_before_subcategory_title', $category ); 
				?>
				
				<h4>
				<span>
				<?php echo $category->name; ?> 
				<?php if ( $category->count > 0 ) : ?>
					<mark class="count">(<?php echo $category->count; ?>)</mark>
				<?php endif; ?>
				</span>
				</h4>
				
				</div>
			
			</div>

			<?php
				/** 
				 * woocommerce_after_subcategory_title hook
				 */	  
				do_action( 'woocommerce_after_subcategory_title', $category ); 
			?>

			</a>
			
			<?php do_action( 'woocommerce_after_subcategory', $category ); ?>
		

			
</li>
<?php
$even = !$even;
$prod_count++; // KAURI CODE
?>