<?php
/*
 * Template Name: Home Page
 * Description: A Page Template for Home Page
 */
?>

<?php get_header(); ?>

<!-- PAGE CONTENT BEGIN -->
<div class="container">
	
	<div class="page-content row">
		<div class="col_16">
			<?php include 'lib/mod-intro.php'; ?>

			<section class="main-content row">
			<?php if ( have_posts() ) : ?>
            	<?php while ( have_posts() ) : the_post(); ?>
            		<?php the_content(); ?>
            	<?php endwhile; ?>
            <?php endif; ?>
            <div class="clear"></div>
			</section>
			
			<?php include 'lib/mod-outro.php'; ?>
		</div>
		
	</div>
</div>
<!-- PAGE CONTENT END -->

<?php get_footer(); ?>