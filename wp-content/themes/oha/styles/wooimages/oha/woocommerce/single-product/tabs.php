<?php
/**
 * Single Product Tabs
 */
// Get tabs
ob_start();
do_action('woocommerce_product_tabs'); 
$tabs = trim( ob_get_clean() );
if ( ! empty( $tabs ) ) : ?>
	<div class="tabber">
		<ul class="tabs">
			<?php echo $tabs; ?>
		</ul>
		<div class="tab_container">
			<?php do_action('woocommerce_product_tab_panels'); ?>
		</div>	
	</div>
<?php endif; ?>