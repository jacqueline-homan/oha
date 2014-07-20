<?php
/**
 * The template for displaying product content within loops.
 *
 * Override this template by copying it to yourtheme/woocommerce/content-product.php
 *
 * @package WooCommerce
 * @since WooCommerce 1.6
 */
 
global $product, $woocommerce_loop, $even, $prod_count; // KAURI ADD - $even, $prod_count
//
//
// Store loop count we're currently on
if ( empty( $woocommerce_loop['loop'] ) ) 
	$woocommerce_loop['loop'] = 0;

// Store column count for displaying the grid
if ( empty( $woocommerce_loop['columns'] ) ) 
	$woocommerce_loop['columns'] = apply_filters( 'loop_shop_columns', 4 );

// Ensure visibilty
if ( ! $product->is_visible() ) 
	return; 

// Increase loop count
$woocommerce_loop['loop']++;

// KAURI CODE
if ($even){
	$evenOdd_style = 'odd';
}else{
	$evenOdd_style = '';
}
// end KAURI CODE
?>
<li class="product <?php echo $evenOdd_style;?> <?php if ($prod_count == 0){ echo 'first_product';} ?>">
<?php
/* REMOVED BY KAURI -INSIDE <li> tag
if ( $woocommerce_loop['loop'] % $woocommerce_loop['columns'] == 0 ) 
	echo 'last'; 
elseif ( ( $woocommerce_loop['loop'] - 1 ) % $woocommerce_loop['columns'] == 0 ) 
	echo 'first'; 
*/
?><?php do_action( 'woocommerce_before_shop_loop_item' ); ?>
		
				
		<?php
			/** 
			 * woocommerce_before_shop_loop_item_title hook
			 *
			 * @hooked woocommerce_show_product_loop_sale_flash - 10
			 * @hooked woocommerce_template_loop_product_thumbnail - 10
			 */	  
			do_action( 'woocommerce_before_shop_loop_item_title' ); 
		?>
		<div class="productcol">
		<h3><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
		<?php
			/** 
			 * woocommerce_after_shop_loop_item_title hook
			 *
			 * @hooked woocommerce_template_loop_price - 10
			 */	  
			do_action( 'woocommerce_after_shop_loop_item_title' ); 
		?>
		<?php do_action( 'woocommerce_after_shop_loop_item' ); ?>
		
		</div>
			
</li>
<?php
$even = !$even;
$prod_count++; // KAURI CODE
?>