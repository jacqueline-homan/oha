<?php

/**
 * Add function to widgets_init that'll load our widget.
 */
add_action( 'widgets_init', 'load_Featured_Product_thumbs_Widget' );

/**
 * Register our widget.
 * 'Widget_Featured_Thumbs' is the widget class used below.
 */
function load_Featured_Product_thumbs_Widget() {
	register_widget( 'Widget_Featured_Thumbs' );
}

/**
 * Widget class.
 * This class handles everything that needs to be handled with the widget:
 * the settings, form, display, and update. 
 */
class Widget_Featured_Thumbs extends WP_Widget {

	/**
	 * Widget setup.
	 */
	function Widget_Featured_Thumbs() {
		/* Widget settings. */
		$widget_ops = array( 'classname' => 'Featured-image', 'description' => __('A widget displaying featured product with small thumbnail images.', 'kauri') );

		/* Widget control settings. */
		$control_ops = array( 'width' => 300, 'height' => 350, 'id_base' => 'featured-products-images' );

		/* Create the widget. */
		$this->WP_Widget( 'featured-products-images', __('Kauri Featured products', 'kauri'), $widget_ops, $control_ops );
	}

	/**
	 * How to display the widget on the screen.
	 */
	function widget( $args, $instance ) {
		extract( $args );

		/* Our variables from the widget settings. */
		$title = apply_filters('widget_title', $instance['title'] );
		$num = $instance['num'];
		//$posttype =  array($instance['posttype']) ;
		//$posttype = isset( $instance['posttype'] ) ? $instance['posttype'] : false;

		/* Before widget (defined by themes). */
		echo $before_widget;

		/* Display the widget title if one was input (before and after defined by themes). */
		if ( $title )
			echo $before_title . $title . $after_title;

		/* Display num from widget settings if one was input. */
		if ( $num )
		
		$sticky_array = get_option( 'sticky_products' );
		
		echo '<div class="featured-products-images-widget">';
		
		$products = get_posts( array(
				'numberposts' => $num, 
				'no_found_rows' => 1,
				'post_status' => 'publish',
				'post_type' => 'product',
				'meta_key' => '_featured',
				'meta_value' => 'yes',
				'post_parent' => 0,
				'orderby'     => 'post_date',
				'order'       => 'DESC'
				)
			);
		
		if ( count( $products ) > 0 ) {
			
			foreach( $products as $product ){
				setup_postdata ( $product );
				global $post;
				$old_post = $post;
				$post = $product;
				//$product->the_post();

				$product_link = get_permalink();
				
				$product_image = new WP_Query( array( 'post_type' => 'attachment', 'post_status' => 'inherit', 'post_mime_type' => 'image', 'posts_per_page' => 1, 'post_parent' => $product->ID, 'orderby' => 'ID', 'order'=>'ASC' ) );
				
				while( $product_image->have_posts() ) {
					$product_image->the_post();
					$url_img = wp_get_attachment_image_src( get_the_ID(),'large' );
					//
					$attr = array(
						'alt'   => trim(strip_tags( $product->post_title ) ),
						'title' => trim(strip_tags( $product->post_title ) )
					);
					
					echo '<a href="'. $product_link .'" rel="external" >';
					
				
					$post_thumb = get_the_post_thumbnail( $product->ID, 'thumbnail', $attr );
					if ($post_thumb) {
						echo $post_thumb;
					}else{
						echo wp_get_attachment_image( get_the_ID(), 'thumbnail', false , $attr );
					}
					
					
					
					//echo wp_get_attachment_image( get_the_ID(),'', false, $attr );
					
					echo '</a>';
				}
				
				
			}// endforeach
			
		}// endif

		echo '</div>';	
					
		/* If show sex was selected, display the user's sex. */
		//if ( $posttype )
		//	

		
		/* After widget (defined by themes). */
		echo $after_widget;
	}

	/**
	 * Update the widget settings.
	 */
	function update( $new_instance, $old_instance ) {
		$instance = $old_instance;

		/* Strip tags for title and name to remove HTML (important for text inputs). */
		$instance['title'] = strip_tags( $new_instance['title'] );
		$instance['num'] = strip_tags( $new_instance['num'] );

		/* No need to strip tags for sex and show_sex. */
		//$instance['posttype'] = $new_instance['posttype'];

		return $instance;
	}

	/**
	 * Displays the widget settings controls on the widget panel.
	 * Make use of the get_field_id() and get_field_name() function
	 * when creating your form elements. This handles the confusing stuff.
	 */
	function form( $instance ) {

		/* Set up some default widget settings. */
		$defaults = array( 'title' => __('Featured products', 'kauri'), 'num' => 6, 'posttype' => array('wpsc-product') );
		$instance = wp_parse_args( (array) $instance, $defaults ); ?>
		<!-- Widget Title: Text Input -->
		<p>
			<label for="<?php echo $this->get_field_id( 'title' ); ?>"><?php _e('Title:', 'kauri'); ?></label>
			<input id="<?php echo $this->get_field_id( 'title' ); ?>" name="<?php echo $this->get_field_name( 'title' ); ?>" value="<?php echo $instance['title']; ?>" style="width:100%;" />
		</p>
		<!-- Number of images: Text Input -->
		<p>
			<label for="<?php echo $this->get_field_id( 'num' ); ?>"><?php _e('Number of images:', 'kauri'); ?></label>
			<input id="<?php echo $this->get_field_id( 'num' ); ?>" name="<?php echo $this->get_field_name( 'num' ); ?>" value="<?php echo $instance['num']; ?>" style="width:100%;" />
		</p>
		<!--
		<p>
			<?php 
			/*
			$post_types=get_post_types('','names'); 
			foreach ($post_types as $post_type ) {
			
				if( !( $post_type == 'revision' || $post_type == 'nav_menu_item' || $post_type == 'attachment' || $post_type == 'wpsc-product-file' )) {
			
					echo '<input class="checkbox" type="checkbox" '. checked( $instance['posttype'], true ) .' id="'. $this->get_field_id( 'posttype' ). '" name="'. $this->get_field_name( 'posttype' ) .' " /> <label for="'. $this->get_field_id( 'posttype' ) .'" >'. $post_type .'</label>' ;
			
				}//endif
			}
			*/
			?>
			
		</p>
		-->
	<?php
	}
}
?>