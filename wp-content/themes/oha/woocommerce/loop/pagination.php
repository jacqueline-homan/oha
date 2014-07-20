<?php
/**
 * Pagination
 */
global $wp_query;
?>
<?php if ( $wp_query->max_num_pages > 1 ) : ?>

<div class="navigation">
	<div class="nav-next"><?php next_posts_link( __( 'Next', 'kauri' ) ); ?></div>
	<div class="nav-previous"><?php previous_posts_link( __( 'Previous', 'kauri' ) ); ?></div>
</div>
<?php endif; ?>