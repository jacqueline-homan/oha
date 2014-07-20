<?php
/**
 * WooCommerce Product Thumbnail
**/
if ( ! function_exists( 'woo_kauri_template_loop_product_thumbnail' ) ) {
	function woo_kauri_template_loop_product_thumbnail() {
		echo woo_kauri_get_product_thumbnail();
	}
}
if ( ! function_exists( 'woo_kauri_get_product_thumbnail' ) ) {
	function woo_kauri_get_product_thumbnail( $size = 'shop_catalog', $placeholder_width = 0, $placeholder_height = 0  ) {
		global $post, $woocommerce, $product;
		if ( ! $placeholder_width )
			$placeholder_width = $woocommerce->get_image_size( 'shop_catalog_image_width' );
		if ( ! $placeholder_height )
			$placeholder_height = $woocommerce->get_image_size( 'shop_catalog_image_height' );
		/* ================*/
		/* KAURI CODE */
		if (!$product->is_in_stock()) :
			$prod_link = '<a href="'.get_permalink($product->id).'"class="single-product-link"><div class="prod-single">'.apply_filters("out_of_stock_add_to_cart_text", __("Read More", "kauri")).'</div></a>';
		else :
			switch ($product->product_type) :
				case "variable" :
					$link 	= get_permalink($product->id);
					$label 	= apply_filters('variable_add_to_cart_text', __('Select options', 'kauri'));
				break;
				case "grouped" :
					$link 	= get_permalink($product->id);
					$label 	= apply_filters('grouped_add_to_cart_text', __('View options', 'kauri'));
				break;
				case "external" :
					$link 	= get_permalink($product->id);
					$label 	= apply_filters('external_add_to_cart_text', __('Read More', 'kauri'));
				break;
				default :
					$link 	= esc_url( $product->add_to_cart_url() );
					$label 	= apply_filters('add_to_cart_text', __('Add to cart', 'kauri'));
				break;
			endswitch;
			$prod_type = $product->product_type;
			$prod_id = $product->id;
			//
			$prod_link = '<a href="'.$link .'"rel="nofollow" data-product_id="'.$prod_id.'"class="single-product-link product_type_'.$prod_type .'"><div class="prod-single">'.$label.'</div></a>';
			//printf('<a href="%s" rel="nofollow" data-product_id="%s" class="button add_to_cart_button product_type_%s">%s</a>', $link, $product->id, $product->product_type, $label);
		endif; 
		if ( has_post_thumbnail() ) { 
			$img_url = wp_get_attachment_image_src( get_post_thumbnail_id($post->ID), 'large');
			$image = '';
			$image .= '<div class="imagecol" id="imagecol_'.$post->ID.'">';
				$image .= '<div class="image-links" id="'.$post->ID.'">';
					$image .= '<div class="enlarge-link">';
						$image .= '<div class="products-zoom-single">';
						$image .= '<a rel="contents" class="fancybox" href="'.$img_url[0].'" title="'.$post->post_title.' "><div class="prod-zoom">'. __('zoom image','kauri') .'</div></a>';
						$image .= $prod_link;
						$image .= '</div>'; //end .products-zoom-single
					$image .= '</div>'; //end .enlarge-link
					$image .= get_the_post_thumbnail($post->ID, $size);
				$image .= '</div>';//end .image-links
			$image .= '</div>';//end .imagecol
			return $image;
		}else{ 
			$image = '';
			$image .= '<div class="imagecol" id="imagecol_'.$post->ID.'" style="text-align:center;">';
			$image .= '<div class="image-links" id="'.$post->ID.'">';
			$image .= '<img src="'. woocommerce_placeholder_img_src().'"alt="Placeholder" width="'.$placeholder_width.'"height="'.$placeholder_height.'"class="no_prod_image" />';
			$image .= '</div>';
			$image .= '</div>';
			return $image;
		}
		/* END KAURI CODE */
		/////
		/* ORIGINAL: 
		if ( has_post_thumbnail() )
			return get_the_post_thumbnail( $post->ID, $size ); else return '<img src="'. woocommerce_placeholder_img_src() .'" alt="Placeholder" width="' . $placeholder_width . '" height="' . $placeholder_height . '" />';
		*/
	}
}
?>