<?php
/**
 * Reviews Tab
 */
global $woocommerce, $post;
if ( comments_open() ) : ?>
	<div class="tab_content" id="tab-reviews">
		<?php comments_template(); // comments from woocommerce.php function - template file in kauri/woocommerce ?>
	</div>
<?php endif; ?>