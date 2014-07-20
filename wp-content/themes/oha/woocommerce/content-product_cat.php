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
<li class="product sub-category <?php echo $evenOdd_style; if($prod_count==0) echo " first-item"; ?>">
	<?php 
	/* REMOVED BY KAURI -from INSIDE <li> tag
	if ( $woocommerce_loop['loop'] % $woocommerce_loop['columns'] == 0 ) 
		echo 'last'; 
	elseif ( ( $woocommerce_loop['loop'] - 1 ) % $woocommerce_loop['columns'] == 0 ) 
		echo 'first'; 
	*/
	?>
	<?php do_action( 'woocommerce_before_subcategory', $category ); ?>
		
				
		
		<a href="<?php echo "/shop/".$category->slug; ?>">

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
				
				
				</div>
			
			</div>
			<?php
				/** 
				 * woocommerce_after_subcategory_title hook
				 */	  
				do_action( 'woocommerce_after_subcategory_title', $category ); 
			?>

			</a>
			<div class="title-area">
				<h4 class="replace">
					<span>
					<?php echo $category->name; ?>
					</span>
				</h4>
			</div>
			<?php 
				// get up to 4 'featured'
				
				$featured_products = get_posts( array(
					'no_found_rows' => 1,
					'post_status' => 'publish',
					'product_cat' => $category->slug,
					'post_type' => 'product',
					'meta_key' => '_featured',
					'meta_value' => 'yes',
					'post_parent' => 0,
					'suppress_filters' => false,
					'orderby'     => 'post_date',
					'order'       => 'DESC'
				) );
				//print_r($featured_products);
				$output = '';
				if($featured_products):
			?>
			<ul class="featured-products">
				<?php
					$i=0;
					foreach($featured_products as $aProduct):
						
						if($i<4)
						{
							$i++;
							$title = get_post_meta($aProduct->ID, 'short_name', true);
							if(!$title)
								$title = $aProduct->post_title;
							echo "<li><a href=\"".get_permalink($aProduct->ID)."\">".$title."</a></li>";
						}
					endforeach; 
				?>
			</ul>
			<?php endif; ?>
			<div class="center">
				<a href="<?php echo "/shop/".$category->slug; ?>" target="_self" class="small-btn left">View All</a>
			</div>

			<?php do_action( 'woocommerce_after_subcategory', $category ); ?>
	
</li>
<?php
$even = !$even;
$prod_count++; // KAURI CODE
?>