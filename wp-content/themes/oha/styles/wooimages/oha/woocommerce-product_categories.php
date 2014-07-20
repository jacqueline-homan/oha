<?php
/**
 * Kauri WOOCommerce products categories
 * 
 * Displays products categories dropdown if enabled in theme options
 *
 */
 

$c = 0;
$h = true;
$s = 0;
$d = 0;
$o = isset($instance['orderby']) ? $instance['orderby'] : 'order';


echo '<h2>' . __( 'Products Categories', 'kauri' ) . '</h2>';

$cat_args = array('show_count' => $c, 'hierarchical' => $h, 'taxonomy' => 'product_cat');

if ( $o == 'order' ) {
	
	$cat_args['menu_order'] = 'asc';
	
} else {
	
	$cat_args['orderby'] = $o;
	
}

if ( $d ) {

	// Stuck with this until a fix for http://core.trac.wordpress.org/ticket/13258
	woocommerce_product_dropdown_categories( $c, $h );
	
	?>
	<script type='text/javascript'>
	/* <![CDATA[ */
		var dropdown = document.getElementById("dropdown_product_cat");
		function onCatChange() {
			if ( dropdown.options[dropdown.selectedIndex].value !=='' ) {
				location.href = "<?php echo home_url(); ?>/?product_cat="+dropdown.options[dropdown.selectedIndex].value;
			}
		}
		dropdown.onchange = onCatChange;
	/* ]]> */
	</script>
	<?php
	
} else {
	
	global $wp_query, $post, $woocommerce;
	
	$woocommerce->current_cat = false;
	$woocommerce->cat_ancestors = array();
		
	if ( is_tax('product_cat') ) :
	
		$woocommerce->current_cat = $wp_query->queried_object;
		$woocommerce->cat_ancestors = get_ancestors( $woocommerce->current_cat->term_id, 'product_cat' );
	
	elseif ( is_singular('product') ) :
		
		$product_category = wp_get_post_terms( $post->ID, 'product_cat' ); 
		
		if ($product_category) :
			$woocommerce->current_cat = end($product_category);
			$woocommerce->cat_ancestors = get_ancestors( $woocommerce->current_cat->term_id, 'product_cat' );
		endif;
		
	endif;
	
	include_once( $woocommerce->plugin_path() . '/classes/walkers/class-product-cat-list-walker.php' );
	
	$cat_args['walker'] 			= new WC_Product_Cat_List_Walker;
	$cat_args['title_li'] 			= '';
	$cat_args['show_children_only']	= ( isset( $instance['show_children_only'] ) && $instance['show_children_only'] ) ? 1 : 0;
	$cat_args['pad_counts'] 		= 1;
	$cat_args['show_option_none'] 	= __('<p class="no_prod_cats">No product categories exist.</p>', 'kauri');
	$cat_args['current_category']	= ( $woocommerce->current_cat ) ? $woocommerce->current_cat->term_id : '';
	$cat_args['current_category_ancestors']	= $woocommerce->cat_ancestors;
	
	echo '<ul class="product-categories">';
	
	wp_list_categories( apply_filters( 'woocommerce_product_categories_widget_args', $cat_args ) );
	
	echo '</ul>';

}
?>