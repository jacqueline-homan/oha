<?php

/**
 * Plugin Name: Bhinneka Video Widget
 * Version: 1.0
 * Author: Population2
 * Author URI: http://themeforest.net/user/population2?ref=population2
 **/


add_action( 'widgets_init', 'bnk_widget_video' );
function bnk_widget_video() {
	register_widget( 'bnk_widget_video' );
}

class bnk_widget_video extends WP_Widget {

	function bnk_widget_video() {
		// Widget settings
			$widget_ops = array(
				'classname' => 'bnk_widget_video',
				'description' => __('Display video', 'bhinneka')
			);
			$this->WP_Widget( 'bnk_widget_video', __('Bhinneka Video', 'bhinneka'), $widget_ops );		
	}
	
	//	Outputs the options form on admin
	function form( $instance ) {
		$defaults = array(
			'title' => '',
			'code' => '',
			'caption' => '',
		);
		$instance = wp_parse_args( (array) $instance, $defaults ); ?>
	
		<p>
			<label for="<?php echo $this->get_field_id( 'title' ); ?>"><?php _e('Title:', 'bhinneka') ?></label>
			<input class="widefat" id="<?php echo $this->get_field_id( 'title' ); ?>" name="<?php echo $this->get_field_name( 'title' ); ?>" value="<?php echo $instance['title']; ?>" />
		</p>
	
		<p>
			<label for="<?php echo $this->get_field_id( 'code' ); ?>"><?php _e('Embed code (iframe):', 'bhinneka') ?></label>
			<textarea style="height:140px;" class="widefat" id="<?php echo $this->get_field_id( 'code' ); ?>" name="<?php echo $this->get_field_name( 'code' ); ?>"><?php echo stripslashes(htmlspecialchars(( $instance['code'] ), ENT_QUOTES)); ?></textarea>
			Tip: Optimal width 400px.
		</p>
		
		<p>
			<label for="<?php echo $this->get_field_id( 'caption' ); ?>"><?php _e('Caption:', 'bhinneka') ?></label>
			<input class="widefat" id="<?php echo $this->get_field_id( 'caption' ); ?>" name="<?php echo $this->get_field_name( 'caption' ); ?>" value="<?php echo stripslashes(htmlspecialchars(( $instance['caption'] ), ENT_QUOTES)); ?>" />
		</p>
		
		<?php
		}
	
	//	Processes widget options to be saved
	function update( $new_instance, $old_instance ) {
		$instance = $old_instance;
		$instance['title'] = strip_tags( $new_instance['title'] );		
		$instance['caption'] = stripslashes( $new_instance['caption']);
		$instance['code'] = stripslashes( $new_instance['code']);
		return $instance;
	}
	
	//	Outputs the content of the widget
	function widget( $args, $instance ) {
		extract( $args );
		$title = apply_filters('widget_title', $instance['title'] );
		$code = $instance['code'];
		$caption = $instance['caption'];
		echo $before_widget;
		if ( $title )
			echo $before_title . $title . $after_title;
		?>
			<?php if ($code) {
			echo '<div class="video-container">'. $code.'</div>';
            } ?>
            <?php if ($caption) {
			echo '<p class="video-caption">'. $caption. '</p>';
		    } ?>
		<?php
		echo $after_widget;
		}
	
	}
?>