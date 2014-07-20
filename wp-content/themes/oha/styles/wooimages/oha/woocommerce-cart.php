<?php
/**
 *  Kauri  WOOCommerce Shopping Cart 
 *
 * Displays shopping cart dropdown if enabled in theme options
 * don't use together with Shopping cart widget. Only one shopping cart per page.
 */

		
global $woocommerce;

if (is_cart() || is_checkout()) return;

echo '<span class="cart-icon"></span><h2>'.__('Shopping cart','kauri').'</h2>';

echo '<div id="header-shopping-cart" class="widget_shopping_cart">';


echo '<ul class="cart_list product_list_widget ">';

//if ($hide_if_empty) echo 'hide_cart_widget_if_empty';


if (sizeof($woocommerce->cart->get_cart())>0) :

	foreach ($woocommerce->cart->get_cart() as $cart_item_key => $cart_item) :
		$_product = $cart_item['data'];
		if ($_product->exists() && $cart_item['quantity']>0) :
			echo '<li><a href="'.get_permalink($cart_item['product_id']).'" class="cart_item_link">';

			echo $_product->get_image();

			echo apply_filters('woocommerce_cart_widget_product_title', $_product->get_title(), $_product);

			echo $woocommerce->cart->get_item_data( $cart_item );

			echo '<span class="quantity">' .$cart_item['quantity'].' &times; '.woocommerce_price($_product->get_price()).'</span></a></li>';
		endif;
	endforeach;
	
else:

	echo '<li class="empty"><span>'.__('No products in the cart.', 'kauri').'</span></li>';
	
endif;

if (sizeof($woocommerce->cart->get_cart())>0) :
	echo '<li class="total"><strong>' . __('Subtotal', 'kauri') . ':</strong> '. $woocommerce->cart->get_cart_total() . '</li>';

	do_action( 'woocommerce_widget_shopping_cart_before_buttons' );

	echo '<li class="buttons"><a href="'.$woocommerce->cart->get_cart_url().'" class="button">'.__('View Cart &rarr;', 'kauri').'</a>';
	echo '<a href="'.$woocommerce->cart->get_checkout_url().'" class="button checkout">'.__('Checkout &rarr;', 'kauri').'</a></li>';
endif;

echo '</ul>';



if ( sizeof($woocommerce->cart->get_cart())==0 ) {
	$inline_js = "
		jQuery('.hide_cart_widget_if_empty').closest('.widget').hide();
		jQuery('body').bind('adding_to_cart', function(){
			jQuery(this).find('.hide_cart_widget_if_empty').closest('.widget').fadeIn();
		});
	";

	$woocommerce->add_inline_js( $inline_js );
}

echo '</div>';
?>