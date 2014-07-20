<?php if ( comments_open() ) : ?>
	<li class="reviews_tab"><a href="#tab-reviews"><h5><?php _e('Reviews', 'kauri'); ?><?php echo comments_number(' (0)', ' (1)', ' (%)'); ?></h5></a></li>
<?php endif; ?>