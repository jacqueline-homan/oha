<!-- INTRO BEGIN -->
<?php if ( $data['bnk_intro_title'] || $data['bnk_intro_content'] || $data['bnk_intro_button'] != '' ) { ?>


<section class="home-page-intro row">
    <article class="intro">
        <header class="entry-header">
            <h2 class="entry-title vintage-type replace">
            <?php if ($data['bnk_intro_title']) { 
            	echo stripslashes($data['bnk_intro_title']); 
            } ?>
            </h2>
        </header>
        <div class="entry-content">
            <?php if ($data['bnk_intro_content']) {
				echo '<p>';           
				echo stripslashes($data['bnk_intro_content']); 
				echo '</p>';           

			}?>
			<?php if ($data['bnk_intro_button']) { ?>
                <p><a href="<?php echo home_url( '/' ); ?>?page_id=<?php echo $data['bnk_intro_page']; ?>" class="btn primary">
                <?php echo $data['bnk_intro_button']; ?>
                </a></p>
            <?php }?>
            
            
        </div>
    </article>
    <hr class="thin"/>
</section>	

<?php } ?>
<!-- INTRO END -->