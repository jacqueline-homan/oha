<?php
/*
 * Template Name: Shop
 * Description: A Page Template for the shop
 */
get_header(); ?>

	<!-- CONTAINER BEGIN -->
	<div class="container"> 
		<div class="row"><div class="col_16">
			<h1 class="page-title replace">
				Shop O.H.A.
			</h1>
		</div></div>
		
		<div class="page-content row">
			<div class="col_12">
		
				<?php if ( have_posts() ) : ?>
					
					<!-- MODULE BEGIN -->
					<section class="module">
					<?php woocommerce_breadcrumb(array(
							'delimiter' => '<span class="divider">&nbsp;</span>',
							'wrap_before' => '<nav class="woocommerce-breadcrumb" id="bnk-crumbs" itemprop="breadcrumb">',
						)); ?>
					<?php while ( have_posts() ) : the_post(); ?>
			
						<?php woocommerce_get_template_part( 'content', 'single-product' ); ?>
			
					<?php endwhile; // end of the loop. ?>

					</section>
				<?php else : ?>
						
						<h1 class="entry-title"><?php _e( 'Nothing Found', 'bhinneka' ); ?></h1>				
						<?php if ( $data['bnk_custom_404_msg'] != '' ) {
							echo '<p>';
							echo $data['bnk_custom_404_msg'];
							echo '</p>';
						}
						else { 
							echo '<p>';
							_e('Apologies, it appears the page you are looking for no longer exists. Perhaps searching will help.', 'bhinneka');
							echo '</p>';
						 } ?>	
						<?php get_search_form(); ?>
	
				<?php endif; ?>
				<?php edit_post_link( ); ?> 
				
			</div>
			

			<?php get_sidebar('shop'); ?>
			
		</div>
		<!-- PAGE CONTENT END -->
		
	</div>
	<!-- CONTAINER END -->

<?php get_footer(); ?>