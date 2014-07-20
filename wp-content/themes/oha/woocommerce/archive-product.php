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
				<?php if ( is_search() ) : ?>
				<?php 
					printf( __( 'Search Results: &ldquo;%s&rdquo;', 'woocommerce' ), get_search_query() ); 
					if ( get_query_var( 'paged' ) )
						printf( __( '&nbsp;&ndash; Page %s', 'woocommerce' ), get_query_var( 'paged' ) );
				?>
			<?php elseif ( is_tax() ) : ?>
				<?php echo single_term_title( "", false ); ?>
			<?php else : ?>
				<?php 
					$shop_page = get_post( woocommerce_get_page_id( 'shop' ) );
					
					echo apply_filters( 'the_title', ( $shop_page_title = get_option( 'woocommerce_shop_page_title' ) ) ? $shop_page_title : $shop_page->post_title );
				?>
			<?php endif; ?>
			</h1>
		</div></div>
		
		<div class="page-content row">
			<div class="col_12">
		
				<?php if ( have_posts() ) : ?>
					
					<!-- MODULE BEGIN -->
					<section class="module">
						<?php //if (function_exists('bnk_breadcrumbs')) bnk_breadcrumbs(); 
						woocommerce_breadcrumb(array(
							'delimiter' => '<span class="divider">&nbsp;</span>',
							'wrap_before' => '<nav class="woocommerce-breadcrumb" id="bnk-crumbs" itemprop="breadcrumb">',
						)); ?>
						<?php 
							if ( is_tax() ) 
								do_action('woocommerce_before_shop_loop'); 
							else
								echo apply_filters( 'the_content', $shop_page->post_content );
						?>	
						<?php ?>
						<ul class="products">
							
							<?php woocommerce_product_subcategories(); ?>
							
							<?php $even = true;  $prod_count = 1; //KAURI CODE ?>
							
							<?php while ( have_posts() ) : the_post(); ?>
								
								<?php 
									if ( is_tax() )
										woocommerce_get_template_part( 'content', 'product' );
								?>
					
							<?php endwhile; // end of the loop. ?>
							
						</ul>
					
						<?php 
							if ( is_tax() )	
								do_action('woocommerce_after_shop_loop'); 
						?>
						
						<div class="clear"></div>					
						
					</section>
					<!-- MODULE END -->
				
				<?php else : ?>
					
					<!-- MODULE BEGIN -->
					<section class="module">
					
						<?php if ( ! woocommerce_product_subcategories( array( 'before' => '<ul class="products">', 'after' => '</ul>' ) ) ) : ?>
						<p><?php _e( 'No products found which match your selection.', 'woocommerce' ); ?></p>
						<?php endif; ?>
					
					</section>
					<!-- MODULE END -->
					
				<?php endif; ?>
			</div>
			
			<?php get_sidebar('shop'); ?>
			
		</div>
		
	</div>
	<?php
		/** 
		 * woocommerce_after_main_content hook
		 *
		 * @hooked woocommerce_output_content_wrapper_end - 10 (outputs closing divs for the content)
		 */	 
		//do_action('woocommerce_after_main_content'); 
	?>
                
	<!-- CONTAINER END -->
<?php get_footer(); ?>