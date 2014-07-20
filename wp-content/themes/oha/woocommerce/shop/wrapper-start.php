<?php
/**
 * Content Wrappers
 */
$id = ( get_option('template') === 'twentyeleven' ) ? 'primary' : 'container';
?>
<div class="random_post_header_image">	
	<?php get_template_part('header','image'); ?>
</div>	
<div id="primary">
	<div id="content" role="main">
	<div class="entry-back">
	<div class="entry-content">