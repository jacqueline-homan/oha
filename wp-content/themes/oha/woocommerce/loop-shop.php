<?php

global $woocommerce_loop;
//
$woocommerce_loop['loop'] = 0;
$woocommerce_loop['show_products'] = true;
//
if (!isset($woocommerce_loop['columns']) || !$woocommerce_loop['columns']) $woocommerce_loop['columns'] = apply_filters('loop_shop_columns', 2);
?>
<?php do_action('woocommerce_before_shop_loop'); ?>
<ul class="products">
	<?php 
	
	do_action('woocommerce_before_shop_loop_products'); // if there are subcategories
	
	$even = true; //Kauri even/odd products
	$i = 1;
	
	if ($woocommerce_loop['show_products'] && have_posts()) : while (have_posts()) : the_post(); 
//
		if ($even){
			$evenOdd_style = 'odd';
		}else{
			$evenOdd_style = '';
		}
//		
		global $product;
		
		if (!$product->is_visible()) continue; 
		
		$woocommerce_loop['loop']++;
		
		?>
		<li class="product <?php echo $evenOdd_style; if ($i == 1){ echo ' first_product';} ?><?php //if ($woocommerce_loop['loop']%$woocommerce_loop['columns']==0) echo ' last'; if (($woocommerce_loop['loop']-1)%$woocommerce_loop['columns']==0) echo ' first'; ?>">
			
			<?php do_action('woocommerce_before_shop_loop_item'); ?>
			<?php do_action('woocommerce_before_shop_loop_item_title');?>
			<?php /* woocommerce_before_shop_loop_item_title HOOK - 2 func:
					- woocommerce_show_product_loop_sale_flash 
					- woocommerce_template_loop_product_thumbnail */
			?>	
			<div class="productcol">
				<h3><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
				<?php do_action('woocommerce_after_shop_loop_item_title'); ?>
				<?php do_action('woocommerce_after_shop_loop_item'); ?>
			</div>
		</li><?php 
		$even = !$even;
		$i++;
	endwhile; endif;
	if ($woocommerce_loop['loop']==0) echo '<li class="info">'.__('No products found which match your selection.', 'woocommerce').'</li>'; 
	?>
</ul>
<div class="clear"></div>
<?php do_action('woocommerce_after_shop_loop'); ?>